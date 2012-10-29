from flask import Flask, render_template
from flask.ext.pymongo import PyMongo

app = Flask(__name__)
app.config['MONGO_DBNAME'] = 'TaskManager'
mongo = PyMongo(app)

from views import *

if __name__ == "__main__":
    app.run(port=8000, debug = True)