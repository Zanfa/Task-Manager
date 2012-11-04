var Upload = Upload || {};

Upload.setup = function (target) {
    target[0].addEventListener("dragover", Upload.onDragOver, false);
    target[0].addEventListener("dragenter", Upload.onDragEnter, false);
    target[0].addEventListener("dragexit", Upload.onDragExit, false);
    target[0].addEventListener("drop", Upload.onDrop, false);
};

Upload.onDragEnter = function (e) {
    e.preventDefault();
};

Upload.onDragOver = function (e) {
    e.preventDefault();
};

Upload.onDragExit = function (e) {
    e.preventDefault();
};

Upload.onDrop = function (e) {
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
