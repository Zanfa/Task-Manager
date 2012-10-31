var User = User || {};

/** @enum */
User.Action = {
    TYPE: 0,
    BACKSPACE: 1,
    ARROW_KEY: 2
};

/**
 * @param {Parser.Task} task
 * @param {number} cursorIndex
 */
User.updateInput = function (task, cursorIndex) {
    $("#task").val(task.description).focus().setSelection(cursorIndex);
};