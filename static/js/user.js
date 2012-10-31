var User = User || {};

/** @enum */
User.Action = {
    TYPE: 0,
    BACKSPACE: 1,
    ARROW_KEY: 2,
    AUTOCOMPLETE: 3
};

/**
 * @param {Parser.Task} task
 * @param {number} cursorIndex
 */
User.updateInput = function (task, cursorIndex) {
    $("#task").val(task.description).focus().setSelection(cursorIndex);

    $('#decorated').html(task.decorate());

    var root = $("#decorated")[0];
    var offsetSum = 0;
    var node = root.childNodes[0];

    while (offsetSum < cursorIndex) {
        if (node.hasChildNodes())
            node = node.childNodes[0];

        if (offsetSum + node.textContent.length < cursorIndex) {
            offsetSum += node.textContent.length;
            if (node.nextSibling)
                node = node.nextSibling;
            else
                node = node.parentNode.nextSibling;
            continue;
        }

        var offset = cursorIndex - offsetSum;
        var cursorRange = rangy.createRange();
        cursorRange.setStart(node, offset);
        cursorRange.collapse(true);
        cursorRange.insertNode($("<span class='cursor'>&nbsp;</span>")[0]);
        break;
    }

    Autocomplete.complete(task, cursorIndex, User.Action.AUTOCOMPLETE);

};