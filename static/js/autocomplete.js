var Autocomplete = Autocomplete || {};

/** @type {Array.<Parser.Tag>} */
Autocomplete.Tags = [];

/**
 * @param {Parser.Task} task
 * @param {User.Range} range
 * @param {User.Action} action
 */
Autocomplete.complete = function (task, range, action) {
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

        if (tag.location < range.start && range.start <= tag.location + tag.getLength()) {
            activeTag = tag;

            $("#activeWord").text(tag.action + tag.value);

            break;
        }
    }

    if (activeTag && action !== User.Action.ARROW_KEY && action !== User.Action.AUTOCOMPLETE) {
        /** @type {string} */
        var newValue = Autocomplete.completeTag(activeTag, action);
        Autocomplete.replaceTagValue(task, activeTag, newValue);
        var reparsedTask = Parser.parse(task.description);
        var selectionIndex = activeTag.location + activeTag.getLength();
        User.updateInput(reparsedTask, new User.Range(selectionIndex, selectionIndex));
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

    if (tag.type !== Parser.Tag.TYPE.UNKNOWN)
        return tag.value;

    for (i = 0, len = Autocomplete.Tags.length; i < len; i++) {
        potentialMatchTag = Autocomplete.Tags[i];

        if (potentialMatchTag.value.toUpperCase().startsWith(tag.value.toUpperCase()) &&
                potentialMatchTag.value.toUpperCase() !== tag.value.toUpperCase() &&
                Parser.Tag.doActionAndTypeMatch(tag, potentialMatchTag)) {

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