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
    var params = {
        key: "uploads/${filename}",
        AWSAccessKeyId: "AKIAJWT3W6BKEXJKPDDA",
        acl: "public-read",
        success_action_redirect: "http://localhost:8000/",
        policy: "eyJleHBpcmF0aW9uIjoiMjAxMy0wMS0wMVQwMDowMDowMFoiLCJjb25kaXRpb25zIjpbeyJidWNrZXQiOiJjby5waG90YXRvLnJhd2ltYWdlcyJ9LFsic3RhcnRzLXdpdGgiLCIka2V5IiwidXBsb2Fkcy8iXSx7ImFjbCI6InB1YmxpYy1yZWFkIn0seyJzdWNjZXNzX2FjdGlvbl9yZWRpcmVjdCI6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC8ifSxbInN0YXJ0cy13aXRoIiwiJENvbnRlbnQtVHlwZSIsImltYWdlL3BuZyJdLFsiY29udGVudC1sZW5ndGgtcmFuZ2UiLDAsMTA0ODU3Nl1dfQ==",
        signature: "1sL+NA1ua53qZfinaXFTUi5L+wI=",
        "Content-Type": "image/png"
    }

    this.buildUploadRequest(params);
};

/** @private */
Upload.Request.prototype.buildUploadRequest = function (requestData) {
    var t, key, request, formData, fileReader;

    t = this;
    request = new XMLHttpRequest();
    formData = new FormData();

    request.addEventListener("progress", function (e) {
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

