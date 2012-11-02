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
        var tagMatches = Autocomplete.completeTag(activeTag, action);
        console.log(tagMatches);
        if (tagMatches.length === 1) {
            var newTag = tagMatches[0];
            Autocomplete.replaceTagValue(task, activeTag, newTag);
            var reparsedTask = Parser.parse(task.description);
            var selectionIndex = newTag.location + newTag.getLength();
            User.updateInput(reparsedTask, new User.Range(selectionIndex, selectionIndex));
        }
    }
};

/**
 * @param {Parser.Tag} tag
 * @param {User.Action} action
 *
 * @return {Array.<Parser.Tag>|null}
 */
Autocomplete.completeTag = function (tag, action) {
    var i, len, newTag, matchTag, potentialMatches = [];

    if (action === User.Action.BACKSPACE) {
        newTag = new Parser.Tag(tag.type, "", tag.action, tag.location);
        return [newTag];
    }

    if (tag.type !== Parser.Tag.TYPE.UNKNOWN)
        return [tag];

    for (i = 0, len = Autocomplete.Tags.length; i < len; i++) {
        matchTag = Autocomplete.Tags[i];

        if (matchTag.value.toUpperCase().startsWith(tag.value.toUpperCase()) &&
                matchTag.value.toUpperCase() !== tag.value.toUpperCase() &&
                Parser.Tag.doActionAndTypeMatch(tag, matchTag)) {

            matchTag.action = tag.action;
            matchTag.location = tag.location;

            potentialMatches.push(matchTag);
        }
    }

    if (potentialMatches.length !== 0)
        return potentialMatches;

    return [tag];
};

/**
 * @param {Parser.Task} task
 * @param {Parser.Tag} tag
 * @param {Parser.Tag} newTag
 */
Autocomplete.replaceTagValue = function (task, tag, newTag) {
    /** @type {string} */
    var prefix;

    /** @type {string} */
    var suffix;

    prefix = task.description.substr(0, tag.location);
    suffix = task.description.substr(tag.location + tag.getLength(), task.description.length);

    task.description = prefix + newTag.getValueWithAction() + suffix;
};