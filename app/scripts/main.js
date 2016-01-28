$(function () {
    
    // SITE CONFIG!
    
    var siteRoot = 'http://localhost:9000';
    var backEnd = 'http://localhost/reaktor-backend/';

    var fileName;
    var hash = location.search.substring(1, location.search.length);
    var permalink = '<a href="' + siteRoot + '/single.html?' + hash + '">permalink: ' + hash + '</a>';


    Dropzone.options.uploadWidget = {
        paramName: 'file',
        maxFilesize: 10, // MB
        maxFiles: 1,
        dictDefaultMessage: '<h1>Drop files here</h1>',
        previewsContainer: "#preview",
        addRemoveLinks: true,
        headers: {
            'Cache-Control': null,
            'X-Requested-With': null
        },
        acceptedFiles: 'image/*,.JPG',
        init: function () {
            this.on('success', function (file, resp) {
                fileName = resp;
                //console.log(resp);
            });
        },
        thumbnail: function (file, dataUrl) {
            if (file.previewElement) {
                file.previewElement.classList.remove("dz-file-preview");
                var images = file.previewElement.querySelectorAll("[data-dz-thumbnail]");
                for (var i = 0; i < images.length; i++) {
                    var thumbnailElement = images[i];
                    thumbnailElement.alt = file.name;
                    thumbnailElement.src = dataUrl;
                }
                setTimeout(function () {
                    file.previewElement.classList.add("dz-image-preview");
                }, 1);
            }
        }
    };

    // IF FRONTPAGE    
    $("#newest").load(backEnd + "/newest.php");

    // IF SINGLE PAGE   

    $("#single").load(backEnd + "/single.php", {
        hash: hash
    });

    $("#comments").load(backEnd + "/comments.php", {
        hash: hash
    });

    $("#permalink").append(permalink);

    $('#message').keypress(function (e) {
        if (e.which == 13) {
            parseInput();
        }
    });

    $('#send').click(function () {
        parseInput();
    });

    function parseInput() {
        var comment = $('#message').val();
        $('#message').val('');

        $.post(backEnd + "/comments.php", {
                hash: hash,
                message: comment
            })
            .done(function (data) {
                $("#comments").html(data);
            });
    };

    // IF ADDITION PAGE

    $('#title').keypress(function (e) {
        if (e.which == 13) {
            saveImage();
            return false;
        }
    });

    $('#save').click(function () {
        saveImage();
    });

    function saveImage() {
        var title = $('#title').val();
        $('#title').val('');

        $.post(backEnd + "/save.php", {
                url: fileName,
                message: title
            })
            .done(function (data) {
                console.log(data);
                window.location.replace(siteRoot + '/single.html?' + data);
            });
    };

});