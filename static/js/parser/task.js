var Parser = Parser || {};

/**
 * @constructor
 * @param {string} description
 * @param {Array.<Parser.Tag>} tags
 */
Parser.Task = function (description, tags) {
    /**
     * @private
     * @type {string}
     */
    this.description = description;

    /** @type {Array.<Parser.Tag>} */
    this.tags = tags;

    this.tags.sort(Parser.Tag.sortByLocation);
};

/** @return {string} */
Parser.Task.prototype.decorate = function () {
    var i, result;

    // Start off with the undecorated string and decorations one tag at a time
    result = this.description;

    // Loop through the tags array backwards to prevent replacements from changing the locations
    for (i = this.tags.length - 1; i >= 0; i--) {
        var tag, prefix, name, suffix;
        tag = this.tags[i];

        prefix = result.substr(0, tag.location);
        name = result.substr(tag.location, tag.getLength());
        suffix = result.substr(tag.location + tag.getLength(), result.length);

        result = [prefix, tag.decorate(name), suffix].join("");
    }

    return result;
}