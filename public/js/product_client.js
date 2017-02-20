$(document).ready(function () {
    //$('#create-product').click(function () {
    //    $.post('/products/create', $('#create-product-form').serialize(), function (answer) {
    //        if (answer.success) {
    //            window.location.href = '/admin';
    //            return;
    //        }
    //        console.log(answer);
    //    });
    //});

    //var files;
    //var formData = new FormData();

    //$('#create-product').on('click', function () {


        //$.ajax({
        //    url: "/products/create",
        //    type: "POST",
        //    data: formData,
        //    processData: false,
        //    contentType: false,
        //    success: function (response) {
        //        if (answer.success) {
        //        window.location.href = '/admin';
        //        return;
        //    }
        //    console.log(answer);
        //    },
        //    error: function (jqXHR, textStatus, errorMessage) {
        //        console.log(errorMessage); // Optional
        //    }
        //});


    //    $.ajax({

    //        // Your server script to process the upload
    //        url: '/products/create_new',
    //        type: 'POST',

    //        // Form data
    //        data: formData, //new FormData($('#123456')),

    //        // Tell jQuery not to process data or worry about content-type
    //        // You *must* include these options!
    //        cache: false,
    //        contentType: false,
    //        processData: false,

    //        // Custom XMLHttpRequest
    //        xhr: function () {
    //            console.log(data);
    //            var myXhr = $.ajaxSettings.xhr();
    //            if (myXhr.upload) {
    //                // For handling the progress of the upload
    //                myXhr.upload.addEventListener('progress', function (e) {
    //                    if (e.lengthComputable) {
    //                        $('progress').attr({
    //                            value: e.loaded,
    //                            max: e.total,
    //                        });
    //                    }
    //                }, false);
    //            }
    //            return myXhr;
    //        },
    //    });
    //});

    $('#create-product').click(function () {
        //var imgData = JSON.stringify(getBase64Image(document.getElementById('myImg')));
        $.ajax({
            url: '/products/create_new',
            dataType: 'multipart/form-data',
            data: document.getElementById('file1').files[0],
            type: 'POST',
            success: function (data) {
                console.log(data);
            }
        });
    });

    //$('#create-product').click(function () {
    //    var element = document.getElementById('file1');
    //    var file = element.files[0];

    //    if (window.formData !== undefined) {
    //        var data = new FormData();
    //        data.append('file0', file);

    //        var xhr = new XMLHttpRequest();
    //        xhr.open("POST", "/products/create_new");

    //        xhr.send(data);

    //        xhr.onreadystatechange = function () {
    //            if (xhr.readyState == 4 && xhr.status == 200) {
    //                document.getElementById('status').innerHTML = xhr.responseText;
    //            }
    //        };

    //        xhr.onerror = function () {
    //            document.getElementById('status').innerHTML = "Error!";
    //        };
    //    };
    //});


    $('#edit-product').click(function () {
        $.post('/products/update', $('#edit-product-form').serialize(), function (answer) {
            if (answer.success) {
                window.location.href = '/products';
                return;
            }
            console.log(answer);
        });
    });

    $('#file1').on('change', handleFileSelect);

    //$('input[type=file]').on('change', prepareUpload);

    //// Grab the files and set them to our variable
    //function prepareUpload(event) {
    //    var files = event.target.files[0];
    //    var blobFile = files[0];
    //    console.log(blobFile);

    //    console.log(formData);
    //    formData.append("fileToUpload", blobFile, 'myImg.jpg');
    //    console.log(formData);
    //    return files;
    //}
});

function delete_p(id) {
    $.post('/products/delete/'+id, function () {
        window.location.href = '/products';
    })
}

function edit_p(id) {
    window.location.href = '/products/update/' + id;
}

function handleFileSelect(evt) {
    var file = evt.target.files; // FileList object
    var f = file[0];
    // Only process image files.
    if (!f.type.match('image.*')) {
        alert("Image only please....");
    }
    // Remove image if previously it been selected
    if (document.getElementById('myImg')) {
        document.getElementById('myImg').remove();
    }
    var reader = new FileReader();
    // Closure to capture the file information.
    reader.onload = (function (theFile) {
        return function (e) {
            // Render thumbnail.
            var span = document.createElement('span');
            span.innerHTML = ['<img id="myImg" class="thumb" title="', escape(theFile.name), '" src="', e.target.result, '" />'].join('');
            document.getElementById('output').insertBefore(span, null);
        };
    })(f);
    // Read in the image file as a data URL.
    reader.readAsDataURL(f);
}

function getBase64Image(imgElem) {
    // imgElem must be on the same server otherwise a cross-origin error will be thrown "SECURITY_ERR: DOM Exception 18"
    var canvas = document.createElement("canvas");
    canvas.width = imgElem.clientWidth;
    canvas.height = imgElem.clientHeight;
    var ctx = canvas.getContext("2d");
    ctx.drawImage(imgElem, 0, 0);
    var dataURL = canvas.toDataURL("image/png");
    return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
}