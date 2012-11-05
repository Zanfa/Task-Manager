import base64
import hmac
import sha
from flask import request, make_response, jsonify, json
from server import app

@app.route('/uploaded')
def uploaded():
    uploadData = {
        "bucket": request.args.get("bucket", ""),
        "key": request.args.get("key", "") #,
        # "etag": request.args.get("etag", "")
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