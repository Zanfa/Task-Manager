from flask import request, jsonify
from server import app, mongo

@app.route("/task/create", methods=["POST"])
def task_create():
    if is_task_valid(request.json):
        decorate_task(request.json)
        mongo.db.Tasks.insert(request.json)
        del request.json["_id"]
        return jsonify(request.json)
    else:
        return jsonify({"Error": "Invalid Task"})

def is_task_valid(taskJSON):
    return True

def decorate_task(task):
    result = task["description"];

    # Loop through the tags array backwards to prevent replacements from changing the locations
    for tag in reversed(task["tags"]):
        if tag["type"] == 3:
            continue;

        prefix = result[0: tag["location"]]
        name = result[tag["location"]: tag["location"] + len(tag["value"]) + 1]
        suffix = result[tag["location"] + len(tag["value"]) + 1:]

        if tag["action"] == "!":
            className = "notify"
        elif tag["action"] == "@":
            className = "assign"
        else:
            className = "categorize"

        result = "".join([prefix, "<span class=\"", className, "\">", name, "</span>", suffix]);

    task["decorated"] = result
    print(result)
