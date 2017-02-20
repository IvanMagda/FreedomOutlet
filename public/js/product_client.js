$(document).ready(function () {
    //$("#create-product").click(function () {
    //    xhr = new XMLHttpRequest();

    //    myXhr.upload.addEventListener('#progr', function (e) {
    //        console.log(e.lengthComputable);
    //        if (e.lengthComputable) {
    //            var progressPercent = (e.loaded / e.total) * 100;
    //            $('#progr').attr({
    //                value: e.loaded,
    //                max: e.total,
    //            });
    //        }
    //    }, false);
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