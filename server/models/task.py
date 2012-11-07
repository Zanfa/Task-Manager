__author__ = 'vahur'

class InvalidJSONException(Exception):
    pass

class Tag(object):
    """Tag that represents a user, group or a category of tasks"""

    class TargetType:
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
        COMPLETED = "completed"

    def __init__(self, targetType, target, action, location, is_completed=False):
        self.targetType = targetType
        self.target = target
        self.action = action
        self.location = location
        self.is_completed = is_completed

    def __str__(self):
        return self.action + self.target

    def get_length(self):
        """Calculate the total length of the tag's string representation"""
        return len(self.target) + len(self.action)

    def decorate(self):
        """Wrap the tag in a decorated span tag, based on tag's action"""

        if self.action == Tag.Action.ASSIGN:
            className = Tag.DecoratorClass.ASSIGN
        elif self.action == Tag.Action.NOTIFY:
            className = Tag.DecoratorClass.NOTIFY
        else:
            className = Tag.DecoratorClass.CATEGORIZE

        if self.is_completed:
            className += " " + Tag.DecoratorClass.COMPLETED

        return "<span class=\"" + className + "\">" + self.action + self.target + "</span>"

    @staticmethod
    def from_json(json):
        """Validate client-sent JSON and create a new Tag if it's valid"""

        if "targetType" not in json or "target" not in json or "action" not in json or "location" not in json:
            raise InvalidJSONException("Tag must have a type, a value, an action and a location")

        if type(json["targetType"]) != int:
            raise InvalidJSONException("Tag targetType must be an int")

        if type(json["target"]) != str:
            raise InvalidJSONException("Tag target must be a string")

        if type(json["action"]) != str:
            raise InvalidJSONException("Tag action must be a string")

        if type(json["location"]) != int:
            raise InvalidJSONException("Tag location must be an int")

        is_completed = False
        if "isCompleted" in json and type(json["isCompleted"]) == bool:
            is_completed = json["isCompleted"]

        return Tag(json["targetType"], json["target"], json["action"], json["location"], is_completed)


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

    @staticmethod
    def from_json(json):
        """Validate client-sent JSON and create a new File if it's valid"""

        if "name" not in json or "url" not in json or "size" not in json or "contentType" not in json:
            raise InvalidJSONException("File must have a name, an url, size and a contentType")

        if type(json["name"]) != str:
            raise InvalidJSONException("File name must be a string")

        if type(json["url"]) != str:
            raise InvalidJSONException("File URL must be a string")

        if type(json["size"]) != int:
            raise InvalidJSONException("File size must be an int")

        if type(json["contentType"]) != str:
            raise InvalidJSONException("File content type must be a string")

        return File(json["name"], json["url"], json["size"], json["contentType"])


class Task(object):
    """Task with all it's accompanying tags, files, usually parsed from user submitted JSON"""

    def __init__(self, description, tags, files):
        self.description = description
        self.tags = tags
        self.files = files

        # Sort tags in ascending order by location, useful when decorating
        self.tags = sorted(self.tags, key=lambda tag: tag.location)

    def decorate(self):
        """Generate the HTML-decorated description of the task"""

        result = self.description

        # Go through the tags backwards to prevent messing up tag locations
        for tag in reversed(self.tags):
            if tag.targetType == Tag.TargetType.UNKNOWN:
                continue;

            prefix = result[0: tag.location]
            value = result[tag.location: tag.location + tag.get_length()]
            suffix = result[tag.location + tag.get_length():]

            result = prefix + tag.decorate() + suffix

        return result

    @staticmethod
    def from_json(json):
        """Validate client generated JSON and force it into standardized format"""

        if "description" not in json or "tags" not in json or "files" not in json:
            raise InvalidJSONException("Task must have a description, a list of tags and a list of files")

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