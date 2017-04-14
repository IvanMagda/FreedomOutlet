$(document).ready(function () {
    $("#search_box").autocomplete({
        minLength: 0,
        source: function (request, response) {
            $.ajax({
                url: "/search/" + $("#search_box").val(),
                method: 'get',
                dataType: "json",
                data: {
                    q: request.term
                },
                success: function (data) {
                    response(data);
                }
            });
        },
    })
        .autocomplete("instance")._renderItem = function (ul, item) {
            console.log(item);
            return $("<li>")
                .append("<div style='display: inline-flex;'>" + "<div style='width:60px; height:42px; padding-right: 5px; margin: auto'><a href='/product/" + item.id + "'><img src=" + item.title_img_src + " alt='Smiley face'  style='width:100%; max-height:42px' align='left' ></a></div><div>" + item.name + "<br>" + item.description + "<hr></div></div>")
                .appendTo(ul);
        };

    $("#search_box").keypress(function (e) {
        if (e.which == 13) {
            $.get("/search_result/" + $("#search_box").val(), function () {
                window.location.href = "/search_result/" + $("#search_box").val();
            })
        }
    });
});
