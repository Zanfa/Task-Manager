var Upload = Upload || {};

/**
 * @param {File} file
 */
Upload.File = function (file) {
    this.file = file;

    this.uploadRequest = null;

    this.setupUI();
    this.startUpload();
};

/** @private */
Upload.File.prototype.setupUI = function () {
    var t, fileList;

    t = this;
    this.fileElement = $("<li>" +
        "<span class=\"uploadProgress\"></span>" +
        "<span class=\"file\"><i class=\"icon-upload\"></i><i class=\"icon-remove\">" +
        "</i><a target=\"_blank\" class=\"filename unclickable\"></a></span>" +
        "</li>");

    this.fileElement.find(".filename").text(Upload.File.trimFilename(this.file.name));
    this.fileElement.find(".icon-remove").click(function (e) {
        t.onRemove(e);
    });

    fileList = $("#uploads");
    fileList.append(this.fileElement);
    fileList.show();
};

/** @private */
Upload.File.prototype.onRemove = function (e) {
    var confirmRemove, fileList;

    if (!e.metaKey)
        confirmRemove = confirm("Are you sure you wish to remove " + this.file.name);

    if (e.metaKey || confirmRemove) {
        this.fileElement.remove();
        this.uploadRequest.cancel();
        fileList = $("#uploads");
        if (fileList.children().length === 0)
            fileList.hide();
    }

};

/** @private */
Upload.File.prototype.startUpload = function () {
    this.uploadRequest = new Upload.Request("http://co.photato.rawimages.s3.amazonaws.com/", this);
};

Upload.File.prototype.onUploadComplete = function () {
    this.fileElement.find(".icon-upload").removeClass("icon-upload").addClass("icon-file");
    this.fileElement.find(".uploadProgress").addClass("uploadDone");
    this.fileElement.find(".unclickable").removeClass("unclickable").attr("href", "http://www.google.com");
};

/**
 * @param {number} progress
 */
Upload.File.prototype.onProgress = function (progress) {
    if (progress >= 100) {
        this.onUploadComplete();
        return;
    }

    this.fileElement.find(".uploadProgress").css("width", progress + "%");
};

/**
 * @return {boolean}
 */
Upload.File.prototype.isValid = function () {
    return true;
};

/**
 * @param {String} filename
 *
 * @return {string}
 */
Upload.File.trimFilename = function (filename) {
    if (filename.length > 10)
        return filename.substr(0, 5) + "..." + filename.substr(filename.length - 5, 5);

    return filename;
};