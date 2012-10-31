Parser = Parser || {};

/**
 * @constructor
 * @param {Parser.Tag.TYPE} type
 * @param {string} value
 * @param {Parser.Tag.ACTION=} action
 * @param {number=} location
 */
Parser.Tag = function (type, value, action, location) {
    /** @type {Parser.Tag.TYPE} */
    this.type = type;

    /** @type {string} */
    this.value = value;

    /** @type {Parser.Tag.ACTION} */
    this.action = action;

    /** @type {number} */
    this.location = location;
};

/** @return {string} */
Parser.Tag.prototype.getValueWithAction = function () {
    return this.action + this.value;
}

/** @return {number} */
Parser.Tag.prototype.getLength = function () {
    return this.value.length + this.action.length;
}

/**
 * @param {string} value
 *
 * @return {string}
 */
Parser.Tag.prototype.decorate = function (value) {
    var className = "decorated";

    switch (this.action) {
        case Parser.Tag.ACTION.ASSIGN:
            className = Parser.Tag.DECORATOR_CLASS.ASSIGN;
            break;

        case Parser.Tag.ACTION.NOTIFY:
            className = Parser.Tag.DECORATOR_CLASS.NOTIFY;
            break;

        case Parser.Tag.ACTION.CATEGORIZE:
            className = Parser.Tag.DECORATOR_CLASS.CATEGORIZE;
            break;
    }

    return "<span class='" + className + "'>" + value + "</span>";
};

/**
 * @const
 * @enum {number}
 */
Parser.Tag.TYPE = {
    USER: 0,
    GROUP: 1,
    CATEGORY: 2
};

/**
 * @const
 * @enum {string}
 */
Parser.Tag.ACTION = {
    ASSIGN: "@",
    NOTIFY: "!",
    CATEGORIZE: "#"
};

/**
 * @const
 * @enum {string}
 */
Parser.Tag.DECORATOR_CLASS = {
    ASSIGN: "assign",
    NOTIFY: "notify",
    CATEGORIZE: "categorize"
};

/**
 * @param {Parser.Tag} a
 * @param {Parser.Tag} b
 */
Parser.Tag.sortByLocation = function (a, b) {
    return a.location - b.location;
};