from flask.templating import render_template

from server import app, mongo

@app.route('/')
def main():
    tasks = mongo.db.Tasks.find()
    return render_template("index.html", tasks=tasks)