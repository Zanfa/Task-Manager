var Autocomplete = Autocomplete || {};

/** @type {Array.<Parser.Tag>} */
Autocomplete.Tags = [];



/**
 * @param {Parser.Task} task
 * @param {number} cursorIndex
 * @param {User.Action} action
 */
Autocomplete.complete = function (task, cursorIndex, action) {
    /** @type {number} */
    var i;

    /** @type {number} */
    var tagsLength;
    
    /** @type {Parser.Tag} */
    var tag;
    
    /** @type {Parser.Tag} */
    var activeTag;

    $("#activeWord").text("");

    for (i = 0, tagsLength = task.tags.length; i < tagsLength; i++) {
        /** @type {Parser.Tag} */
        tag = task.tags[i];

        if (tag.location < cursorIndex && cursorIndex <= tag.location + tag.getLength()) {
            activeTag = tag;

            $("#activeWord").text(tag.action + tag.value);

            break;
        }
    }

    if (activeTag && action !== User.Action.ARROW_KEY) {
        /** @type {string} */
        var newValue = Autocomplete.completeTag(activeTag, action);
        Autocomplete.replaceTagValue(task, activeTag, newValue);
        var reparsedTask = Parser.parse(task.description);
        User.updateInput(reparsedTask, activeTag.location + activeTag.getLength());
    }
};

/**
 * @param {Parser.Tag} tag
 * @param {User.Action} action
 *
 * @return {string}
 */
Autocomplete.completeTag = function (tag, action) {
    /** @type {number} */
    var i;

    /** @type {number} */
    var len;

    /** @type {Parser.Tag} */
    var potentialMatchTag;

    if (action === User.Action.BACKSPACE) {
        return "";
    }

    for (i = 0, len = Autocomplete.Tags.length; i < len; i++) {
        potentialMatchTag = Autocomplete.Tags[i];

        if (potentialMatchTag.value.startsWith(tag.value) &&
                potentialMatchTag.value !== tag.value) {

            return potentialMatchTag.value;
        }
    }

    return tag.value;
};

/**
 * @param {Parser.Task} task
 * @param {Parser.Tag} tag
 * @param {string} newValue
 */
Autocomplete.replaceTagValue = function (task, tag, newValue) {
    /** @type {string} */
    var prefix;

    /** @type {string} */
    var suffix;

    prefix = task.description.substr(0, tag.location);
    suffix = task.description.substr(tag.location + tag.getLength(), task.description.length);
    tag.value = newValue;

    task.description = prefix + tag.getValueWithAction() + suffix;
};