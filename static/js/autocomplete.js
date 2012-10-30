var Autocomplete = Autocomplete || {};

/** @type {Array.<Parser.Tag>} */
Autocomplete.Tags = [];

/**
 * @param {Parser.Task} task
 * @param {number} cursorIndex
 */
Autocomplete.complete = function (task, cursorIndex) {
    var i, tagsLength, tag, activeTag;

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

};