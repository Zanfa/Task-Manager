/**
 * Parse the given string and find all people to notify
 * assign the task to and tags
 */

function Task(task) {
    if (typeof task == "string") {
        this._raw = task;
        this._findAssigns();
        this._findNotify();
        this._findTags();
    } else {
        this._raw = task.raw || "";
        this._assign = task.assign || [];
        this._notify = task.notify || [];
        this._tags = task.tags || [];
    }
}

Task.prototype._findAssigns = function () {
    var assign = [], i;

    assign = this._raw.match(/(@[a-zA-Z0-9_]+)/g) || [];
    for (i = 0; i < assign.length; i++)
        assign[i] = assign[i].replace("@", "");

    this._assign = assign;
};

Task.prototype._findNotify = function () {
    var notify = [], i;

    notify = this._raw.match(/(\![a-zA-Z0-9_]+)/g) || [];
    for (i = 0; i < notify.length; i++)
        notify[i] = notify[i].replace("!", "");

    this._notify = notify;
};

Task.prototype._findTags = function () {
    var tags = [], i;

    tags = this._raw.match(/(\#[a-zA-Z0-9_]+)/g) || [];
    for (i = 0; i < tags.length; i++)
        tags[i] = tags[i].replace("#", "");

    this._tags = tags;
};

Task.prototype.getHighlighted = function () {
    var html = this._raw;

    html = html.replace(/(\@[a-zA-Z0-9_]+)/g, "<span class=\"assign\">$1</span>")
        .replace(/(\![a-zA-Z0-9_]+)/g, "<span class=\"notify\">$1</span>")
        .replace(/(\#[a-zA-Z0-9_]+)/g, "<span class=\"tag\">$1</span>");

    return html;
};

Task.prototype.toJSON = function () {
    return {
        raw: this._raw,
        assign: this._assign,
        notify: this._notify,
        tags: this._tags
    };
};

