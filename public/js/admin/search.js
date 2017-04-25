$(document).ready(function () {
    $("#search").autocomplete({
        minLength: 0,
        source: function (request, response) {
            $.ajax({
                url: "/search/" + $("#search").val(),
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
                .append("<a href='/products/update/" + item.id + "' >" + item.id + " " + item.name + "</a>")
                .appendTo(ul);
        };

    $("#search").keypress(function (e) {
        if (e.which == 13) {
            $.get("/admin/search/" + $("#search").val(), function () {
                window.location.href = "/admin/search/" + $("#search").val();
            })
        }
    });
});
