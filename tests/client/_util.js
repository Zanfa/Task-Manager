UtilTest = TestCase('UtilTest');

UtilTest.prototype.testShallowNamespace = function () {
    define('scheme');
    
    assertEquals(true, scheme instanceof Object);
};

UtilTest.prototype.testDeepNamespace = function () {
    define('scheme.namespace.deep');
    
    assertEquals(true, scheme.namespace.deep instanceof Object);
};

UtilTest.prototype.testExtend = function () {
    define('test');
    
    test.a = function () {};
    test.a.prototype = {
        protoA: function () {}
    };
    
    test.b = function () {};
    test.b.prototype = extend(test.a, {
        protoB: function () {}
    });
    
    var B = new test.b();
    
    assertEquals('function', typeof B.protoA);
    assertEquals('function', typeof B.protoA);
};

UtilTest.prototype.testExtendWithoutObjectCreate = function () {
    define('test');
    
    delete window.Object.create;
    
    test.a = function () {};
    test.a.prototype = {
        protoA: function () {}
    };
    
    test.b = function () {};
    test.b.prototype = extend(test.a, {
        protoB: function () {}
    });
    
    var B = new test.b();
    
    assertEquals('function', typeof B.protoA);
    assertEquals('function', typeof B.protoB);
};