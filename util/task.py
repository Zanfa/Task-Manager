import re

TARGET_REGEX = re.compile('^(@|!|#)([a-zA-z]+)$')

class Task:
    def __init__(self, raw='', assign=[], notify=[], tags=[]):
        self.raw = raw
        self.assign = assign
        self.notify = notify
        self.tags = tags
        self.decorated = []

    def findUserFor(self, match):
        users = []
        if match.group(1) == '@':
            users = self.assign
        elif match.group(1) == '!':
            users = self.notify

        for user in users:
            if user['name'] == match.group(2):
                return user

    def decorateTarget(self, match, isCompleted):
        classNames = ''

        if match.group(1) == '@':
            classNames += 'assign'
        elif match.group(1) == '!':
            classNames += 'notify'

        # Add a special class to give completed classes visual feedback
        if isCompleted:
            classNames += ' completed'

        return '<span class="' + classNames + '">' + match.group(0) + '</span>'


    def decorate(self):
        words = self.raw.split(' ')
        self.decorated = []

        for i, word in enumerate(words):
            self.decorated.append(word)

            match = re.match(TARGET_REGEX, word)
            # Not a target word
            if match is None:
                continue

            user = self.findUserFor(match)
            self.decorated[i] = self.decorateTarget(match, user['isCompleted'])

        return ' '.join(self.decorated)
