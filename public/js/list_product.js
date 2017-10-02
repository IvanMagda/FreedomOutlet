$(document).ready(function () {
    if(window.location.pathname !== '/'){
    pagination();
    }
});

function pagination() {
    var num = parseInt($('#currentPage').val());
    var limit = parseInt($('#currentLimit').val());
    range = 1;
    var arr = [];
    var html = "";

    if (num > 1) {
        var prev = num - 1;
        html += '<li><a href="#" id="paging__backward" onmouseover="pagingClick(this)" name="?page=' + prev + '"></a></li>';
    } else {
        html += '<li><a href="#" id="paging__backward"></a></li>';
    }

    for (var i = 1; i <= limit; i++) {
        if (i <= range || (i > num - range * 3 && i < num + range * 3) || i > limit - range) {
            if (arr[arr.length - 1] && i != arr[arr.length - 1] + 1) {
                arr.push('...');
                html += '<li>...</li>'
            }

            if (i == num) {
                arr.push(i);
                html += '<li><a href="#" class="active" onmouseover="pagingClick(this)" name="?page=' + i + '">' + i + '</a></li>';
            } else {
                arr.push(i);
                html += '<li><a href="#" onmouseover="pagingClick(this)" name="?page=' + i + '">' + i + '</a></li>';
            }
        }
    }

    if (num < limit) {
        var next = num + 1;
        html += '<li><a href="#" id="paging__forward" onmouseover="pagingClick(this)" name="?page=' + next + '"></a></li>';
    } else {
        html += '<li><a href="#" id="paging__forward"></a></li>';
    }

    document.getElementById('paging_ul').innerHTML = html;
}

function active(node) {
    node.parentNode.parentNode.childNodes.forEach(function (e) {
        e.className = '';
    });
    node.parentNode.className = 'active';
    applayFilters();
}

function applayFilters() {
    var sort = $("#filterSort li.active a[name]")[0].getAttribute('name');
    var number = $("#filterNumber li.active a[name]")[0].getAttribute('name');

    window.location.href = '?sort=' + sort + '&number=' + number;
}

function pagingClick(node) {
    var link = node.name;
    var sort = $("#filterSort li.active a[name]")[0].getAttribute('name');
    var number = $("#filterNumber li.active a[name]")[0].getAttribute('name');
    node.href = link + '&sort=' + sort + '&number=' + number;
}

NodeList.prototype.forEach = function (fn) {
    var list = this;
    for (var i = 0; i < list.length; i++) {
        fn.call(list[i], list[i], i, list);
    }
};

HTMLCollection.prototype.forEach = NodeList.prototype.forEach;









$(window).resize(function () {
    var search_box = $(".search_box");
    var width = window.innerWidth;

    if (width > 1100) {
        $(".header__categories-nav").css("display", "flex");
    } else {
        $(".header__categories-nav").css("display", "none");
    }

    if (width > 560) {
        search_box.css("display", "flex");
    } else {
        search_box.css("display", "none");
        $(".header__categories-nav").css("display", "none");
    }
});

$(document).ready(function () {
    $(".mobile_menu").click(function () {
        if (window.innerWidth > 560) {
            $(".header__categories-nav").toggle();
        } else {
            $(".header__categories-nav").toggle();
            $(".search_box").toggle();
        }
    });

    $('.filters__select_type-btn').click(function (e) {
        $('.filters__select_quantity ul').css("display", "none");
        e.stopPropagation();
        $(".filters__select_type ul").toggle();
    });
    $('.filters__select_type ul').click(function (e) {
        e.stopPropagation();
    });

    $('.filters__select_quantity-btn').click(function (e) {
        $('.filters__select_type ul').css("display", "none");
        e.stopPropagation();
        $(".filters__select_quantity ul").toggle();
    });
    $('.filters__select_quantity ul').click(function (e) {
        e.stopPropagation();
    });


    $('body,html').click(function (e) {
        $('.filters__select_quantity ul').css("display", "none");
        $('.filters__select_type ul').css("display", "none");
    });
});

function toggle_visibility(id) {
    var content = document.getElementById("content_" + id);
    var description = document.getElementById("description_" + id);
    if (content.style.display === 'block' || content.style.display === '') {
        content.style.display = 'none';
        description.style.display = 'block';
    }
    else {
        content.style.display = 'block';
        description.style.display = 'none';
    }
}