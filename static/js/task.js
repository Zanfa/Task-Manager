/**
 * Parse the given string and find all people to notify
 * assign the task to and tags
 */

function Task(task) {
    if (typeof task == "string") {
        this._task = task;
        this._findAssigns();
        this._findNotify();
        this._findTags();
    } else {
        this._task = task.task || "";
        this._assign = task.assign || [];
        this._notify = task.notify || [];
        this._tags = task.tags || [];
    }
}

Task.prototype._findAssigns = function () {
    var assign = [], i;

    assign = this._task.match(/(@[a-zA-Z0-9_]+)/g) || [];
    for (i = 0; i < assign.length; i++)
        assign[i] = assign[i].replace("@", "");

    this._assign = assign;
};

Task.prototype._findNotify = function () {
    var notify = [], i;

    notify = this._task.match(/(\![a-zA-Z0-9_]+)/g) || [];
    for (i = 0; i < notify.length; i++)
        notify[i] = notify[i].replace("!", "");

    this._notify = notify;
};

Task.prototype._findTags = function () {
    var tags = [], i;

    tags = this._task.match(/(\#[a-zA-Z0-9_]+)/g) || [];
    for (i = 0; i < tags.length; i++)
        tags[i] = tags[i].replace("#", "");

    this._tags = tags;
};

Task.prototype.toJSON = function () {
    return {
        task: this._task,
        assign: this._assign,
        notify: this._notify,
        tags: this._tags
    };
};

