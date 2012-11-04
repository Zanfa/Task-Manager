var Upload = Upload || {};

Upload.setup = function (target) {
    target[0].addEventListener("dragover", Upload.onDragOver, false);
    target[0].addEventListener("dragenter", Upload.onDragEnter, false);
    target[0].addEventListener("dragleave", Upload.onDragLeave, false);
    target[0].addEventListener("drop", Upload.onDrop, false);
};

Upload.onDragEnter = function (e) {
    $(e.target).addClass("dragOver");

    e.preventDefault();
};

Upload.onDragOver = function (e) {
    e.preventDefault();
};

Upload.onDragLeave = function (e) {
    $(".dragOver").removeClass("dragOver");

    e.preventDefault();
};

Upload.onDrop = function (e) {
    $(".dragOver").removeClass("dragOver");

    e.preventDefault();
    Upload.handleFiles(e.dataTransfer.files)
};

/**
 * @param {FileList} files
 */
Upload.handleFiles = function (files) {
    var i, file;
    for (i = 0; i < files.length; i++) {
        file = new Upload.File(files[i]);

        if (file.isValid())
            Upload.files.push(file);
    }
};

Upload.files = [];
