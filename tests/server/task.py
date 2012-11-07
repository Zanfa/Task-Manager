import unittest
from server.models.task import Task, Tag, File, InvalidJSONException

class TestTask(unittest.TestCase):
    def test_tag_parsing_type_validation(self):
        # Test valid JSON
        self.assertIsInstance(Tag.from_json({
            "targetType": 0,
            "target": "Test",
            "action": Tag.Action.ASSIGN,
            "location": 0
        }), Tag)

        # Test tag targetType property type validation
        self.assertRaises(InvalidJSONException, Tag.from_json, {
            "targetType": "",
            "target": "Test",
            "action": Tag.Action.ASSIGN,
            "location": 0
        })

        # Test tag target type validation
        self.assertRaises(InvalidJSONException, Tag.from_json, {
            "targetType": 0,
            "target": 0,
            "action": Tag.Action.ASSIGN,
            "location": 0
        })

        # Test tag value type validation
        self.assertRaises(InvalidJSONException, Tag.from_json, {
            "targetType": 0,
            "target": "Test",
            "action": 0,
            "location": 0
        })

        # Test tag location type validation
        self.assertRaises(InvalidJSONException, Tag.from_json, {
            "targetType": 0,
            "target": "Test",
            "action": Tag.Action.ASSIGN,
            "location": ""
        })

    def test_tag_parsing_missing_property(self):
        # Test tag missing targetType
        self.assertRaises(InvalidJSONException, Tag.from_json, {
            "target": "Test",
            "action": Tag.Action.ASSIGN,
            "location": 0
        })

        # Test tag missing target
        self.assertRaises(InvalidJSONException, Tag.from_json, {
            "targetType": 0,
            "action": Tag.Action.ASSIGN,
            "location": 0
        })

        # Test tag missing action
        self.assertRaises(InvalidJSONException, Tag.from_json, {
            "targetType": 0,
            "target": "Test",
            "location": 0
        })

        # Test tag missing location
        self.assertRaises(InvalidJSONException, Tag.from_json, {
            "targetType": 0,
            "target": "Test",
            "action": Tag.Action.ASSIGN,
        })

    def test_tag_is_completed(self):
        # Test tag with isCompleted set to True
        self.assertTrue(Tag.from_json({
            "targetType": 0,
            "target": "Test",
            "action": Tag.Action.ASSIGN,
            "location": 0,
            "isCompleted": True
        }).is_completed)

    def test_file_parsing_type_validation(self):
        # Test valid JSON
        self.assertIsInstance(File.from_json({
            "name": "file.jpeg",
            "url": "www.test.com/file.jpeg",
            "size": 123,
            "contentType": "image/jpeg"
        }), File)

        # Test file name type validation
        self.assertRaises(InvalidJSONException, File.from_json, {
            "name": 0,
            "url": "www.test.com/file.jpeg",
            "size": 123,
            "contentType": "image/jpeg"
        })

        # Test file url type validation
        self.assertRaises(InvalidJSONException, File.from_json, {
            "name": "file.jpeg",
            "url": 0,
            "size": 123,
            "contentType": "image/jpeg"
        })

        # Test file size type validation
        self.assertRaises(InvalidJSONException, File.from_json, {
            "name": "file.jpeg",
            "url": "www.test.com/file.jpeg",
            "size": "",
            "contentType": "image/jpeg"
        })

        # Test file contentType type validation
        self.assertRaises(InvalidJSONException, File.from_json, {
            "name": "file.jpeg",
            "url": "www.test.com/file.jpeg",
            "size": 123,
            "contentType": 0
        })

    def test_file_parsing_missing_property(self):
        # Test file missing name
        self.assertRaises(InvalidJSONException, File.from_json, {
            "url": "www.test.com/file.jpeg",
            "size": 123,
            "contentType": "image/jpeg"
        })

        # Test file missing url
        self.assertRaises(InvalidJSONException, File.from_json, {
            "name": "file.jpeg",
            "size": 123,
            "contentType": "image/jpeg"
        })

        # Test file missing size
        self.assertRaises(InvalidJSONException, File.from_json, {
            "name": "file.jpeg",
            "url": "www.test.com/file.jpeg",
            "contentType": "image/jpeg"
        })

        # Test file missing contentType
        self.assertRaises(InvalidJSONException, File.from_json, {
            "name": "file.jpeg",
            "url": "www.test.com/file.jpeg",
            "size": 123,
        })

    def test_tag_decoration(self):
        tag = Tag(Tag.TargetType.USER, "Test", Tag.Action.ASSIGN, 0)
        self.assertEqual("<span class=\"assign\">@Test</span>", tag.decorate())

        tag = Tag(Tag.TargetType.GROUP, "Test2", Tag.Action.NOTIFY, 0)
        self.assertEqual("<span class=\"notify\">!Test2</span>", tag.decorate())

        tag = Tag(Tag.TargetType.CATEGORY, "Test3", Tag.Action.CATEGORIZE, 0)
        self.assertEqual("<span class=\"categorize\">#Test3</span>", tag.decorate())

    def test_tag_parsing_type_validation(self):
        # Test valid JSON
        self.assertIsInstance(Task.from_json({
            "description": "",
            "tags": [],
            "files": []
        }), Task)

        # Test task description type validation
        self.assertRaises(InvalidJSONException, Task.from_json, {
            "description": 0,
            "tags": [],
            "files": []
        })

        # Test task tags type validation
        self.assertRaises(InvalidJSONException, Task.from_json, {
            "description": "",
            "tags": "",
            "files": []
        })

        # Test task files type validation
        self.assertRaises(InvalidJSONException, Task.from_json, {
            "description": "",
            "tags": [],
            "files": ""
        })

    def test_task_parsing_missing_property(self):
        # Test file missing description
        self.assertRaises(InvalidJSONException, File.from_json, {
            "tags": [],
            "files": []
        })

        # Test task missing tags
        self.assertRaises(InvalidJSONException, File.from_json, {
            "description": "",
            "files": []
        })

        # Test task missing files
        self.assertRaises(InvalidJSONException, File.from_json, {
            "description": "",
            "tags": []
        })

    def test_task_decoration(self):
        tag = Tag(Tag.TargetType.USER, "Test", Tag.Action.ASSIGN, 0)
        tag2 = Tag(Tag.TargetType.GROUP, "Test2", Tag.Action.NOTIFY, 10)
        task = Task("@Test abc !Test2 his and", [tag, tag2], [])

        self.assertEqual("<span class=\"assign\">@Test</span> abc <span class=\"notify\">!Test2</span> his and",
            task.decorate())

    def test_task_completed_tag_decoration(self):
        tag = Tag(Tag.TargetType.USER, "Test", Tag.Action.ASSIGN, 0)
        tag2 = Tag(Tag.TargetType.GROUP, "Test2", Tag.Action.NOTIFY, 10, True)
        task = Task("@Test abc !Test2 his and", [tag, tag2], [])

        self.assertEqual("<span class=\"assign\">@Test</span> abc <span class=\"notify completed\">!Test2</span> his and",
            task.decorate())

    def test_task_tag_order(self):
        tag = Tag(Tag.TargetType.USER, "Test", Tag.Action.ASSIGN, 5)
        tag2 = Tag(Tag.TargetType.GROUP, "Test2", Tag.Action.NOTIFY, 15)
        task = Task("abcd @Test abc !Test2 his and", [tag, tag2], [])

        self.assertEqual("abcd <span class=\"assign\">@Test</span> abc <span class=\"notify\">!Test2</span> his and",
            task.decorate())

    """def test_task_full_parse(self):
        # Test valid JSON
        self.assertIsInstance(Task.from_json({
            "description": "Lorem Ipsum @Assign and !Notify #ENGINEERING",
            "tags": [
                {
                    "targetType":
                    "action"
                },
            ],
            "files": []
        }), Task)"""