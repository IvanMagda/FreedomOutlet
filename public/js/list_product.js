$(document).ready(function () {
    pagination();

    NodeList.prototype.forEach = function (fn) {
        var list = this;
        for (var i = 0; i < list.length; i++) {
            fn.call(list[i], list[i], i, list);
        }
    };

    HTMLCollection.prototype.forEach = NodeList.prototype.forEach;

    var test = document.getElementsByClassName("active");
    test.forEach(function (e) {
        console.log(e.children[0].pathname);
    });
    console.log(test);

    console.log($('#filterSort .active a'));
});



function info_tile(node) {
    var parent = node.parentNode;
    var elt = findAncestor(parent, 'product-info');
    elt.childNodes[4].style.display = 'flex';
}

function findAncestor(el, sel) {
    while ((el = el.parentElement) && ((el.matches || el.matchesSelector).call(el, sel))) { console.log(el); };
    return el;
}

function close_info(node) {
    node.parentNode.parentNode.parentNode.style.display = 'none';
}

function pagination() {
    var num = parseInt($('#currentPage').val());
    var limit = parseInt($('#currentLimit').val());
    console.log(num); console.log(limit);
    console.log('paginator');
    range = 1;
    var arr = [];
    var html = "";

    if (num > 1) {
        var prev = num - 1;
        html += '<li class="back"><a href="#" onclick="pagingClick(this)" name="?page=' + prev + '"><img src="img/pagination-back.png" /></a></li>';
    } else {
        html += '<li class="back"><a href="#"><img src="img/pagination-back.png" /></a></li>';
    }

    for (var i = 1; i <= limit; i++) {
        if (i <= range || (i > num - range * 3 && i < num + range * 3) || i > limit - range) {
            if (arr[arr.length - 1] && i != arr[arr.length - 1] + 1) {
                arr.push('...');
                html += '<li>...</li>'
            }

            if (i == num) {
                arr.push(i);
                html += '<li class="active"><a href="#" onclick="pagingClick(this)" name="?page=' + i + '">' + i + '</a></li>';
            } else {
                arr.push(i);
                html += '<li><a href="#" onclick="pagingClick(this)" name="?page=' + i + '">' + i + '</a></li>';
            }
        }
    }

    if (num < limit) {
        var next = num + 1;
        html += '<li class="forward"><a href="#" onclick="pagingClick(this)" name="?page=' + next + '"><img src="img/pagination-forward.png" /></a></li>';
    } else {
        html += '<li class="forward"><a href="#"><img src="img/pagination-forward.png" /></a></li>';
    }

    console.log(arr);

    document.getElementById('paginationUl').innerHTML = html;
}

function active(node) {
    node.parentNode.parentNode.childNodes.forEach(function (e) {
        e.className = '';
    });
    node.parentNode.className = 'active';
    applayFilters();
}

function applayFilters() {
    var sort = document.getElementById("filterSort").getElementsByClassName("active")[0].childNodes[0].name;
    var number = document.getElementById("filterNumber").getElementsByClassName("active")[0].childNodes[0].name;
    console.log(sort);

    window.location.href = '?sort=' + sort + '&number=' + number;
}

function pagingClick(node) {
    var link = node.name;
    var sort = document.getElementById("filterSort").getElementsByClassName("active")[0].childNodes[0].name;
    var number = document.getElementById("filterNumber").getElementsByClassName("active")[0].childNodes[0].name;
    window.location.href = link + '&sort=' + sort + '&number=' + number;
}