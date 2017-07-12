$(document).ready(function () {
    $("#search_box").on("change keyup paste click", function () {
        if ($("#search_box").val() != "") {
            $.ajax({
                url: "/search/" + $("#search_box").val(),
                method: 'get',
                dataType: "json",
                success: function (data) {
                    showSearchResult(data);
                },
                error: function(){
                    console.log('no data');
                }
            });
        }else{
            $(".search__result").css("display", "none");
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
        // ToDo fix display event
        if ($('#main-headr__user-actions') !== 'undefined' && window.innerWidth < 950) {
            $('#main-headr__user-actions').css("z-index", 1);
        }
    });
});

function showSearchResult(data) {
    var html_string = "";
    var search_data = $("#search_box").val();
    console.log(data);

    data.forEach(function (element) {
        console.log(element);
        var name = element.name.replace(new RegExp(search_data,'i'),'<span style="color:#f00">' + search_data + '</span>');
        var manufacturer = element.manufacturer.replace(new RegExp(search_data,'i'),'<span style="color:#f00">' + search_data + '</span>');
        var price = element.price.toString(10).replace(new RegExp(search_data,'i'),'<span style="color:#f00">' + search_data + '</span>');
        
        html_string += `<li class="search_result_item"><a href="/product/${element.id}"><div class="search__result-img"><img src="${element.title_img_src}"></div><div class="search__result-text"><h4>${name}</h4><h6>${manufacturer}</h6><h5>${price}</h5></div></a></li>`;
    }, this);

    if (data.length != 0) {
        $(".search__result").html(html_string);
        $(".search__result").css("display", "block");
        // ToDo fix display event
        if ($('#main-headr__user-actions') !== 'undefined' && window.innerWidth < 950) {
            $('#main-headr__user-actions').css("z-index", 0);
        }
    }else{
        html_string += `<li class="search_result_item"><h6 style="color:black">По вашему запросу ничего не найдено</h6></li>`;
        $(".search__result").html(html_string);
        $(".search__result").css("display", "block");
    };
};
