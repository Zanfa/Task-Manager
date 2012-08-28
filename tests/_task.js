TestCase("TaskTestCase", {

    testParseObject: function () {
        var task = new Task({
            task: "Do this @Foo !Bar #Test",
            assign: ["Foo"],
            notify: ["Bar"],
            tags: ["Test"]
        });

        assertEquals({
                "task":"Do this @Foo !Bar #Test",
                "assign":["Foo"],
                "notify":["Bar"],
                "tags":["Test"]
            }, task.toJSON());
    },

    /*testParseString: function () {
        var task = new Task("Do this @Foo !Bar #Test");

        assertEquals({
                "task":"Do this @Foo !Bar #Test",
                "assign":["Foo"],
                "notify":["Bar"],
                "tag":["Test"]
            }, task.toJSON());
    },*/

    testParseStringOnlyAssign: function () {
        var task = new Task("Do this @Foo @Bar @Test");

        assertEquals({
            "task":"Do this @Foo @Bar @Test",
            "assign":["Foo", "Bar", "Test"],
            "notify":[],
            "tags":[]
        }, task.toJSON());
    },

    testParseStringOnlyNotify: function () {
        var task = new Task("Do this !Foo !Bar !Test");

        assertEquals({
            "task":"Do this !Foo !Bar !Test",
            "assign":[],
            "notify":["Foo", "Bar", "Test"],
            "tags":[]
        }, task.toJSON());
    },

    testParseStringOnlyTags: function () {
        var task = new Task("Do this #Foo #Bar #Test");

        assertEquals({
            "task":"Do this #Foo #Bar #Test",
            "assign":[],
            "notify":[],
            "tags":["Foo", "Bar", "Test"]
        }, task.toJSON());
    },

    testHighlight: function() {
        var task = new Task("Do this @Foo !Bar #Test");

        assertEquals("Do this <span class=\"assign\">@Foo</span> " +
            "<span class=\"notify\">!Bar</span> " +
            "<span class=\"tag\">#Test</span>", task.getHighlighted());
    }
});