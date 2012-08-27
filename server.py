from flask import Flask
from flaskext.mongoalchemy import MongoAlchemy
app = Flask(__name__)
app.config['MONGOALCHEMY_DATABASE'] = 'TaskManager'
db = MongoAlchemy(app)

@app.route('/')
def main():
    return "Hello, World!"

if __name__ == "__main__":
    app.run()