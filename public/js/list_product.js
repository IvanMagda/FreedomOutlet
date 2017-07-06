$(document).ready(function () {
    pagination();
});



function info_tile(node) {
    var parent = node.parentNode.parentNode;
    var elt = findAncestor(parent, 'product-info');
    console.log(elt.childNodes[2]);
    elt.childNodes[2].style.display = 'flex';
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
        html += '<li class="back"><a href="#" onmouseover="pagingClick(this)" name="?page=' + prev + '"><img src="/../img/pagination-back.png" /></a></li>';
    } else {
        html += '<li class="back"><a href="#"><img src="/../img/pagination-back.png" /></a></li>';
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
        html += '<li class="forward"><a href="#" onmouseover="pagingClick(this)" name="?page=' + next + '"><img src="/../img/pagination-forward.png" /></a></li>';
    } else {
        html += '<li class="forward"><a href="#"><img src="/../img/pagination-forward.png" /></a></li>';
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
    var sort = $("#filterSort li.active a[name]")[0].getAttribute('name');
    var number = $("#filterNumber li.active a[name]")[0].getAttribute('name');
    console.log(sort);

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
        var search_box = $("#search_box");
        var width = window.innerWidth;

        if (width > 1100) {
            $(".header__categories-nav").css("display", "flex");
        }else{
            $(".header__categories-nav").css("display", "none");
        }

        if (width > 560) {
            search_box.css("display", "flex");
        }else{
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
                $("#search_box").toggle();
            }
        });

        $(".filters__select_type-btn").click(function () {
            $(".filters__select_type ul").toggle();
        });

        $(".filters__select_quantity-btn").click(function () {
            $(".filters__select_quantity ul").toggle();
        });

        $("#search_box").focus(function () {
            $(".search__result").css("display", "block");
        });

        $("#search_box").focusout(function () {
            $(".search__result").css("display", "none");
        });

        $(".sub-dir_box").toggle();

        $(".header__categories-nav_list>li").click(function () {
            $(this).find(".sub-dir_box").toggle();
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