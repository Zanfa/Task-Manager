from util.task import Task

task = Task(raw='notify @Vahur !Martin',
    assign=[{'name': 'Vahur', 'isCompleted': True}],
    notify=[{'name': 'Martin', 'isCompleted': False}])
print task.decorate()