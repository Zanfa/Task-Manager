from flask import make_response, jsonify, json
from flask.globals import request
from flask.templating import render_template
from util.task_parser import decorate

import base64
import hmac, sha

from server import app, mongo

@app.route('/')
def main():
    return render_template("index.html")

@app.route('/uploaded')
def uploaded():
    uploadData = {
        "bucket": request.args.get("bucket", ""),
        "key": request.args.get("key", ""),
        "etag": request.args.get("etag", "")
    }

    response = make_response(jsonify(uploadData))
    response.headers["Access-Control-Allow-Origin"] = "*"
    return response

@app.route("/generatePolicy", methods=["POST"])
def generate_policy():
    fileInfo = request.json

    aws_secret_key = "fGzbb1AZEN+Xe8wOLW/PdUKo+hFsdmxPV00K5m2E"
    policy_document = {
        "expiration": "2013-01-01T00:00:00Z",
        "conditions":[
            {"bucket": "co.photato.rawimages"},
            ["starts-with", "$key", "uploads/" + fileInfo["fileName"]],
            {"acl": "public-read"},
            {"success_action_redirect": "http://localhost:8000/uploaded"},
            ["starts-with", "$Content-Type", fileInfo["fileType"]],
            ["content-length-range", 0, fileInfo["fileSize"]]
        ]
    }

    policy = base64.b64encode(json.dumps(policy_document))

    signature = base64.b64encode(hmac.new(aws_secret_key, policy, sha).digest())

    params = {
        "key": "uploads/" + fileInfo["fileName"],
        "AWSAccessKeyId": "AKIAJWT3W6BKEXJKPDDA",
        "acl": "public-read",
        "success_action_redirect": "http://localhost:8000/uploaded",
        "policy": policy,
        "signature": signature,
        "Content-Type": fileInfo["fileType"]
    }

    return jsonify(params)

@app.route('/<user>')
def user_home(user=None):
    currentUser = mongo.db.User.find_one_or_404({'name': user})
    tasks = mongo.db.Task.find({'users': {'user': currentUser['_id'], 'isCompleted': False}})
    users = list(mongo.db.User.find(fields=['name']))
    for user in users:
        user[u'_id'] = str(user[u'_id'])

    return render_template('main.html', tasks=tasks,
        count=tasks.count(), user=currentUser['name'], users=users)

@app.route('/task/add', methods=['POST'])
def task_add():
    rawTask = request.json
    task = {
        'raw': rawTask['raw'],
        'description': decorate(rawTask['raw']),
        'users': []
    }
    users = []

    for user in rawTask['assign']:
        users.append({u'name': user})

    for user in rawTask['notify']:
        users.append({u'name': user})

    for user in mongo.db.User.find({'$or': users }):
        task['users'].append({'user': user['_id'], 'isCompleted': False})

    mongo.db.Task.insert(task)
    return str(task)