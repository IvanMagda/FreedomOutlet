$(document).ready(function () {
    $('#file1').on('change', handleFileSelect);
    pagination();
});

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

    console.log(arr);

    document.getElementById('pagination').innerHTML = html;
}

function pagingClick(node) {
    var link = node.name;
    var sort = $("#sorting option:selected").val();
    var number = $("#pages option:selected").val();
    var locat = $("#location").val();
    node.href = link + '&sort=' + sort + '&number=' + number;
}