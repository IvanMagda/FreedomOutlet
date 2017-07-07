$(document).ready(function () {
    $("#search_box").on("change keyup paste click", function () {
        if ($("#search_box").val() != "") {
            $.ajax({
                url: "/search/" + $("#search_box").val(),
                method: 'get',
                dataType: "json",
                success: function (data) {
                    showSearchResult(data);
                }
            });
        };
    });

    $("#search_box").keypress(function (e) {
        if (e.which == 13) {
            $.get("/search_result/" + $("#search_box").val(), function () {
                window.location.href = "/search_result/" + $("#search_box").val();
            })
        };
    });

    $('.search__result').click(function (e) {
        e.stopPropagation();
    });
    $('body,html').click(function (e) {
        $(".search__result").css("display", "none");
    });
});

function showSearchResult(data) {
    var html_string = "";

    data.forEach(function (element) {
        html_string += `<li class="search_result_item"><a href="/product/${element.id}"><div class="search__result-img"><img src="${element.title_img_src}"></div><div class="search__result-text"><h4>${element.name}</h4><h6>${element.manufacturer}</h6><h5>${element.price}</h5></div></a></li>`;
    }, this);

    if (data.length != 0) {
        $(".search__result").html(html_string);
        $(".search__result").css("display", "block");
    };
};
