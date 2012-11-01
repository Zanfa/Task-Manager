var User = User || {};

/** @enum {number} */
User.Action = {
    TYPE: 0,
    BACKSPACE: 1,
    ARROW_KEY: 2,
    AUTOCOMPLETE: 3
};

User.Range = function (start, end) {
    /** @type {number} */
    this.start = start;
    
    /** @type {number} */
    this.end = end;
};

/**
 * @param {Parser.Task} task
 * @param {User.Range} range
 */
User.updateInput = function (task, range) {
    $("#task").val(task.description).focus().setSelection(range.start, range.end);

    $('#decorated').html(task.decorate());

    var root = $("#decorated")[0];
    var offsetSum = 0;
    var node = root.childNodes[0];

    while (offsetSum < range.start) {
        if (node.hasChildNodes())
            node = node.childNodes[0];

        if (offsetSum + node.textContent.length < range.start) {
            offsetSum += node.textContent.length;
            if (node.nextSibling)
                node = node.nextSibling;
            else
                node = node.parentNode.nextSibling;
            continue;
        }

        var offset = range.start - offsetSum;
        var cursorRange = rangy.createRange();
        cursorRange.setStart(node, offset);
        cursorRange.collapse(true);
        cursorRange.insertNode($("<span class='cursor'>&nbsp;</span>")[0]);
        break;
    }

    Autocomplete.complete(task, range, User.Action.AUTOCOMPLETE);
    User.resizeInput();
};

User.resizeInput = function () {
    $("#task").height($('#decorated').height());
};