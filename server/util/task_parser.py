import re

class TaskParser:
    """
        Parse task strings and decorate
    """
    def __init__(self, raw):
        self.raw = raw
        self.assignRegexp = re.compile('(@[a-zA-Z0-9_]+)')
        self.notifyRegexp = re.compile('(\![a-zA-Z0-9_]+)')
        self.tagRegexp = re.compile('(#[a-zA-Z0-9_]+)')

    def to_html(self):
        html = self.raw
        html = self.assignRegexp.sub("<span class=\"assign\">\g<1></span>")
        html = self.notifyRegexp.sub("<span class=\"notify\">\g<1></span>")
        html = self.tagRegexp.sub("<span class=\"tag\">\g<1></span>")

        return html



def decorate(task=""):
    assignRegexp = re.compile('(@[a-zA-Z0-9_]+)')
    notifyRegexp = re.compile('(\![a-zA-Z0-9_]+)')
    tagRegexp = re.compile('(#[a-zA-Z0-9_]+)')

    task = assignRegexp.sub("<span class=\"assign\">\g<1></span>", task)
    task = notifyRegexp.sub("<span class=\"notify\">\g<1></span>", task)
    task = tagRegexp.sub("<span class=\"tag\">\g<1></span>", task)

    return task