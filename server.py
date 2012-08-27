from flask import Flask, render_template
from flaskext.mongoalchemy import MongoAlchemy
app = Flask(__name__)
app.config['MONGOALCHEMY_DATABASE'] = 'TaskManager'
db = MongoAlchemy(app)

@app.route('/')
def main():
    return render_template('main.html')



if __name__ == "__main__":
    app.run(debug = True)