from flask.globals import request
from flask.templating import render_template
from util.task_parser import decorate

from server import app, mongo

@app.route('/')
def main():
    return user_home(user='Vahur')

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