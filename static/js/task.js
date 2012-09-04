/**
 * Parse the given string and find all people to notify
 * assign the task to and tags
 */

function Task(task) {
    // Used to find all cases of @Name, !Name and #Tag
    this.TARGET_REGEX = /^(@|!|#)([a-zA-z]+)$/;

    if (typeof task == "string") {
        this._raw = task;
        this._assign = [];
        this._notify = [];
        this._tags = [];
        this._decorated = [];
        this._raw = this._autoComplete();
        this._findTargets();
    } else {
        this._raw = task.raw || "";
        this._assign = task.assign || [];
        this._notify = task.notify || [];
        this._tags = task.tags || [];
    }
}

Task.prototype._autoComplete = function () {
    var words, match, i, len, name;

    words = this._raw.split(' ');

    if (words.length === 0)
        return this._raw;

    match = words[words.length - 1].match(this.TARGET_REGEX);
    if (match === null)
        return this._raw;

    // Find a user whose name begins the same
    for (i = 0, len = users.length; i < len; i++) {
        name = users[i].name;
        if (name.toUpperCase().startsWith(match[2].toUpperCase())) {
            words[words.length - 1] = match[1] + name + ' ';
        }

    }

    return words.join(' ');
};

Task.prototype._findTargets = function () {
    var words, i, len, match, j, lenUsers, prefix;

    words = this._raw.split(' ');

    for (i = 0, len = words.length; i < len; i++) {
        this._decorated[i] = words[i];
        match = words[i].match(this.TARGET_REGEX);

        if (match === null)
            continue;

        prefix = match[1];
        name = match[2];

        // See if there's a user with that name
        for (j = 0, lenUsers = users.length; j < lenUsers; j++) {
            if (name.toUpperCase() === users[j].name.toUpperCase()) {
                if (prefix === '@')
                    this._assign.push(name);
                else if (prefix === '!')
                    this._notify.push(name);
                else if (prefix === '#')
                    this._tags.push(name);

                this._decorated[i] = this._decorate(words[i]);
            }
        }
    }
};

Task.prototype._decorate = function (target) {
    return target.replace(/(\@[a-zA-Z]+)/g, '<span class="assign">$1</span>')
        .replace(/(\![a-zA-Z]+)/g, '<span class="notify">$1</span>')
        .replace(/(\#[a-zA-Z]+)/g, '<span class="tag">$1</span>');
};

Task.prototype.getHighlighted = function () {
    return this._decorated.join(' ');
};

Task.prototype.toJSON = function () {
    return {
        raw: this._raw,
        assign: this._assign,
        notify: this._notify,
        tags: this._tags
    };
};

