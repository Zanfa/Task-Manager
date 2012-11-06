var API = API || {};

/** @const {sting} */
API.BASE_URL = "http://localhost:8000";

/**
 * @param {Parser.Task} task
 * @param {Array.<Upload.File>} files
 * @param {Function} onSuccess
 * @param {Function=} onError
 */
API.createTask = function (task, files, onSuccess, onError) {
    var i, url, fileUrls;

    fileUrls = [];
    for (i = 0; i < files.length; i++) {
        url = files[i].url;

        if (url)
            fileUrls.push(url);
    }

    $.ajax({
        type: "POST",
        url: API.BASE_URL + "/task/create",
        contentType: "application/json",
        dataType: "json",
        data: JSON.stringify({
            description: task.description,
            tags: task.tags,
            files: fileUrls
        }),
        success: onSuccess,
        error: onError
    });
};