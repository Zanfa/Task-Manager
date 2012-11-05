from flask import make_response, jsonify, json
from flask.globals import request
from flask.templating import render_template
from util.task_parser import decorate
from upload import *
from task import *

from server import app, mongo

@app.route('/')
def main():
    return render_template("index.html")