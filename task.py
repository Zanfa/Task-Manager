from flask import request, jsonify
from server import app, mongo

@app.route("/task/create", methods=["POST"])
def task_create():
    if is_task_valid(request.json):
        mongo.db.Tasks.insert(request.json)
        del request.json["_id"]
        return jsonify(request.json)
    else:
        return jsonify({"Error": "Invalid Task"})

def is_task_valid(taskJSON):
    return True