var Upload = Upload || {};

/**
 * @param {string} url
 * @param {Upload.File} file
 */
Upload.Request = function (url, file) {
    this.url = url;
    this.file = file;

    this.request = null;

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
    var t, key, formData, fileReader;

    t = this;
    this.request = new XMLHttpRequest();
    formData = new FormData();

    this.request.upload.addEventListener("progress", function (e) {
        t.onProgress(e);
    }, false);

    this.request.addEventListener("load", function (e) {
        t.onLoad(e);
    }, false);

    this.request.addEventListener("error", function (e) {
        t.onError(e);
    }, false);

    for (key in requestData) {
        if (!requestData.hasOwnProperty(key))
            return;

        formData.append(key, requestData[key]);
    }

    formData.append("file", this.file.file);

    this.request.open("post", t.url, true);
    this.request.send(formData);
};

/** @private
 *
 * @param {XMLHttpRequestProgressEvent} e
 */
Upload.Request.prototype.onProgress = function (e) {
    if (e.lengthComputable)
        this.file.onProgress(Math.round((e.loaded / e.total) * 100));
};

/** @private
 *
 * @param {XMLHttpRequestProgressEvent} e
 */
Upload.Request.prototype.onLoad = function (e) {
    this.file.onProgress(100);
};

/** @private */
Upload.Request.prototype.onError = function (e) {
    console.log("error");
};

/** @return {boolean} */
Upload.Request.prototype.isComplete = function () {
    return this.request !== null &&
        this.request.readyState === 4 &&
        this.request.status === 200;
};

Upload.Request.prototype.cancel = function () {
    if (this.request !== null)
        this.request.abort();
};

