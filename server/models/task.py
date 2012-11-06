__author__ = 'vahur'

class InvalidJSONException(Exception):
    pass

class Tag(object):
    """Tag that represents a user, group or a category of tasks"""

    class Target:
        USER = 0
        GROUP = 1
        CATEGORY = 2
        UNKNOWN = 3

    class Action:
        ASSIGN = "@"
        NOTIFY = "!"
        CATEGORIZE = "#"

    class DecoratorClass:
        ASSIGN = "assign"
        NOTIFY = "notify"
        CATEGORIZE = "categorize"

    def __init__(self, type, value, action, location):
        self.type = type
        self.value = value
        self.action = action
        self.location = location

    def __str__(self):
        return self.action + self.value

    def get_length(self):
        """Calculate the total length of the tag's string representation"""
        return len(self.value) + len(self.action)

    def decorate(self):
        """Wrap the tag in a decorated span tag, based on tag's action"""

        if self.action == Tag.Action.ASSIGN:
            className = Tag.DecoratorClass.ASSIGN
        elif self.action == Tag.Action.NOTIFY:
            className = Tag.DecoratorClass.NOTIFY
        else:
            className = Tag.DecoratorClass.CATEGORIZE

        return "<span class=\"" + className + "\">" + self.value + "</span>"

    def from_json(json):
        """Validate client-sent JSON and create a new Tag if it's valid"""

        if type(json["type"]) != int:
            raise InvalidJSONException("Tag type must be an int")

        if type(json["value"]) != str:
            raise InvalidJSONException("Tag value must be a string")

        if type(json["action"]) != str:
            raise InvalidJSONException("Tag action must be a string")

        if type(json["location"]) != int:
            raise InvalidJSONException("Tag location must be an int")

        return Tag(json["type"], json["value"], json["action"], json["location"])


class File(object):
    """File attachments to tasks, including necessary meta-data"""

    def __init__(self, name, url, size, content_type):
        self.name = name
        self.url = url
        self.size = size
        self.content_type = content_type

    def trim_name(self):
        """Intelligently trim the file's name if it's over 10 characters"""
        if len(self.name) > 10:
            return self.name[0:5] + "..." + self.name[-5:]

        return self.name

    def from_json(json):
        """Validate client-sent JSON and create a new File if it's valid"""

        if type(json["name"]) != str:
            raise InvalidJSONException("File name must be a string")

        if type(json["url"]) != str:
            raise InvalidJSONException("File URL must be a string")

        if type(json["size"]) != int:
            raise InvalidJSONException("File size must be an int")

        if type(json["contentType"]) != int:
            raise InvalidJSONException("File content type must be a string")

        return File(json["name"], json["url"], json["size"], json["contentType"])


class Task(object):
    """Task with all it's accompanying tags, files, usually parsed from user submitted JSON"""

    def __init__(self, description, tags, files):
        self.description = ""
        self.tags = []
        self.files = []

    def from_json(json):
        """Validate client generated JSON and force it into standardized format"""

        if type(json["description"]) != str:
            raise InvalidJSONException("Description must be a string")

        if type(json["tags"]) != list:
            raise InvalidJSONException("Tags must be a list of Tags")

        for i, tag in enumerate(json["tags"]):
            json["tags"][i] = Tag.from_json(tag)

        if type(json["files"]) != list:
            raise InvalidJSONException("Files must be a list of Files")

        for i, file in enumerate(json["files"]):
            json["files"][i] = File.from_json(file)

        return Task(json["description"], json["tags"], json["files"])




