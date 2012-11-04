var Upload = Upload || {};

/**
 * @param {string} url
 * @param {Upload.File} file
 */
Upload.Request = function (url, file) {
    this.url = url;
    this.file = file;

    this.getSignature();
};

/** @private */
Upload.Request.prototype.getSignature = function () {
    var t, file, data;
    t = this;
    file = this.file.file, data;

    data = {
        fileSize: file.size,
        fileName: file.name,
        fileType: file.type
    }

    $.ajax({
        type: "post",
        url: "/generatePolicy",
        contentType: "application/json",
        data: JSON.stringify(data),
        dataType: "json",
        success: function(json) {
            t.buildUploadRequest(json);
        }
    });
};

/** @private */
Upload.Request.prototype.buildUploadRequest = function (requestData) {
    var t, key, request, formData, fileReader;

    t = this;
    request = new XMLHttpRequest();
    formData = new FormData();

    request.upload.addEventListener("progress", function (e) {
        t.onProgress(request, e);
    }, false);

    request.addEventListener("load", function (e) {
        t.onLoad(request, e);
    }, false);

    request.addEventListener("error", function () {}, false);

    for (key in requestData) {
        if (!requestData.hasOwnProperty(key))
            return;

        formData.append(key, requestData[key]);
    }

    formData.append("file", this.file.file);

    request.open("post", t.url, true);
    request.send(formData);
};

/** @private
 *
 * @param {XMLHttpRequest} request
 * @param {XMLHttpRequestProgressEvent} e
 */
Upload.Request.prototype.onProgress = function (request, e) {
    if (e.lengthComputable)
        this.file.onProgress(Math.round((e.loaded / e.total) * 100));
};

/** @private
 *
 * @param {XMLHttpRequest} request
 * @param {ProgressEvent} e
 */
Upload.Request.prototype.onLoad = function (request, e) {
    this.file.onProgress(100);
};

/** @private */
Upload.Request.prototype.onError = function () {};

