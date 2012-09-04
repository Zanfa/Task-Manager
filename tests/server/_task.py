import unittest
from util.task import Task

class TestTask(unittest.TestCase):
    def testAssignNotify(self):
        task = Task(raw='notify @Vahur !Martin',
            assign=[{'name': 'Vahur', 'isCompleted': False}],
            notify=[{'name': 'Martin', 'isCompleted': False}])

        self.assertEqual('notify <span class="assign">@Vahur</span> <span class="notify">!Martin</span>',
            task.decorate())

    def testSomeCompleted(self):
        task = Task(raw='notify @Vahur !Martin',
            assign=[{'name': 'Vahur', 'isCompleted': False}],
            notify=[{'name': 'Martin', 'isCompleted': True}])

        self.assertEqual('notify <span class="assign">@Vahur</span> <span class="notify completed">!Martin</span>',
            task.decorate())

    def testAllCompleted(self):
        task = Task(raw='notify @Vahur !Martin',
            assign=[{'name': 'Vahur', 'isCompleted': True}],
            notify=[{'name': 'Martin', 'isCompleted': True}])

        self.assertEqual('notify <span class="assign completed">@Vahur</span> <span class="notify completed">!Martin</span>',
            task.decorate())