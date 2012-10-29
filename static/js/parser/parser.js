var Parser = Parser || {};

/** @const */
Parser.TAG_REGEXP = /(@|!|#)([a-zA-z]+)/g;

/**
 * @param {String} description
 * @param {Parser.Task=} previouslyParsedTask
 *
 * @return {Parser.Task}
 */
Parser.parse = function (description, previouslyParsedTask) {
    var result, tag, tags = [];

    while (result = Parser.TAG_REGEXP.exec(description)) {
        console.log(result.index, result);
        tag = new Parser.Tag(Parser.Tag.TYPE.USER, result[2], result[1], result.index);
        tags.push(tag);
    }

    return new Parser.Task(description, tags);
};
