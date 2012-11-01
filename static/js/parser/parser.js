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
        var i, len;
        tag = new Parser.Tag(Parser.Tag.TYPE.UNKNOWN, result[2], result[1], result.index);

        for (i = 0, len = Autocomplete.Tags.length; i < len; i++) {
            var potentialMatchTag = Autocomplete.Tags[i];

            if (potentialMatchTag.value.toUpperCase() === tag.value.toUpperCase() &&
                Parser.Tag.doActionAndTypeMatch(tag, potentialMatchTag)) {

                tag.type = potentialMatchTag.type;
            }
        }

        tags.push(tag);
    }

    return new Parser.Task(description, tags);
};
