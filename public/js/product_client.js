$(document).ready(function () {
    $('#file1').on('change', handleFileSelect);
    if ($('#currentPage').val()) {
        pagination();
    };

    var product_form = document.getElementById('create-product-form');
    product_form.addEventListener("submit", deleteTitleSourseImgFromSubmiting, false);
});

function deleteTitleSourseImgFromSubmiting() {
    var titleImgInput = document.getElementById('file1');
    titleImgInput.remove();
    return true;
}

function delete_p(id) {
    $.post('/products/delete/' + id, function () {
        window.location.href = '/admin';
    })
}

function edit_p(id) {
    window.location.href = '/products/update/' + id;
}

function handleFileSelect(evt) {
    var file = evt.target.files; // FileList object
    var f = file[0];
    var img = document.createElement("img");
    var canvas = document.getElementById('canvas');
    var ctx = canvas.getContext("2d");
    var dataInput = document.getElementById('fileTitle');
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
            img.src = e.target.result;
            img.onload = function () {
                var SET_WIDTH = 340;
                var SET_HEIGHT = 220;
                var width = img.width;
                var height = img.height;
                var crop_X = 0;
                var crop_Y = 0;
                var offset_X = 0;
                var offset_Y = 0;

                if ((width / height) > (SET_WIDTH / SET_HEIGHT)) {
                    crop_Y = height;
                    crop_X = (height / 11) * 17;
                    offset_X = (width - crop_X) / 2;
                } else {
                    crop_X = width;
                    crop_Y = (width / 17) * 11;
                    offset_Y = (height - crop_Y) / 2;
                }
                canvas.width = crop_X;
                canvas.height = crop_Y;

                ctx.drawImage(img,
                    offset_X, offset_Y, // Start at 70/20 pixels from the left and the top of the image (crop),
                    crop_X, crop_Y, // "Get" a `crop_X * crop_Y` (w * h) area from the source image (crop),
                    0, 0, // Place the result at 0, 0 in the canvas,
                    crop_X, crop_Y); // With as width / height: SET_WIDTH * SET_HEIGHT (scale)

                var oc = document.createElement('canvas');
                var octx = oc.getContext('2d');
                var cur = {
                    width: Math.floor(crop_X),
                    height: Math.floor(crop_Y)
                }

                oc.width = cur.width;
                oc.height = cur.height;

                octx.drawImage(canvas, 0, 0, crop_X, crop_Y);

                while (cur.width * 0.5 > SET_WIDTH) {
                    cur = {
                        width: Math.floor(cur.width * 0.5),
                        height: Math.floor(cur.height * 0.5)
                    };
                    octx.drawImage(oc, 0, 0, cur.width * 2, cur.height * 2, 0, 0, cur.width, cur.height);
                }

                canvas.width = SET_WIDTH;
                canvas.height = SET_HEIGHT;
                ctx.drawImage(oc, 0, 0, cur.width, cur.height, 0, 0, SET_WIDTH, SET_HEIGHT);

                var dataurl = canvas.toDataURL("image/jpg");
                dataInput.value = dataurl;
            }
        };
    })(f);
    // Read in the image file as a data URL.
    reader.readAsDataURL(f);


}

function pagination() {
    var num = parseInt($('#currentPage').val());
    var limit = parseInt($('#currentLimit').val());
    range = 1;
    var arr = [];
    var html = "";

    if (num > 1) {
        var prev = num - 1;
        html += '<li class="back"><a href="#" onmouseover="pagingClick(this)" name="?page=' + prev + '"><</a></li>';
    } else {
        html += '';
    }

    for (var i = 1; i <= limit; i++) {
        if (i <= range || (i > num - range * 3 && i < num + range * 3) || i > limit - range) {
            if (arr[arr.length - 1] && i != arr[arr.length - 1] + 1) {
                arr.push('...');
                html += '<li>...</li>'
            }

            if (i == num) {
                arr.push(i);
                html += '<li class="active"><a href="#" onmouseover="pagingClick(this)" name="?page=' + i + '">' + i + '</a></li>';
            } else {
                arr.push(i);
                html += '<li><a href="#" onmouseover="pagingClick(this)" name="?page=' + i + '">' + i + '</a></li>';
            }
        }
    }

    if (num < limit) {
        var next = num + 1;
        html += '<li class="forward"><a href="#" onmouseover="pagingClick(this)" name="?page=' + next + '">></a></li>';
    } else {
        html += '';
    }
    document.getElementById('pagination').innerHTML = html;
}

function pagingClick(node) {
    var link = node.name;
    var sort = $("#sorting option:selected").val();
    var number = $("#pages option:selected").val();
    var locat = $("#location").val();
    node.href = link + '&sort=' + sort + '&number=' + number;
}