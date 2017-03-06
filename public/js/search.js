$(document).ready(function () {
    //var projects = [];
    $("#search_box").autocomplete({
        minLength: 0,
        source: function (request, response) {
            $.ajax({
                url: "/search/" + $("#search_box").val(),
                method:'get',
                dataType: "json",
                data: {
                    q: request.term
                },
                success: function (data) {
                    response(data);
                }
            });
        },
        //focus: function (event, ui) {
        //    $("#search_box").val(ui.item.name);
        //    return false;
        //},
        //select: function (event, ui) {
        //    $("#search_box").val(ui.item.name);

        //    return false;
        //}
    })
        .autocomplete("instance")._renderItem = function (ul, item) {
            console.log(item);
            return $("<li>")
                .append("<div style='display: inline-flex'>" + "<div style='width:60px; height:42px; padding-right: 5px; margin: auto'><a href='/product/"+ item.id +"'><img src=" + item.title_img_src + " alt='Smiley face'  style='width:100%; max-height:42px' align='left' ></a></div><div>" + item.name + "<br>" + item.description + "<hr></div></div>")
                .appendTo(ul);
        };
    //$("#search_box").keyup(function () {

    //    $.get("/search/" + $("#search_box").val(), function (data) {
    //        //console.log(data);
    //        projects = data;
    //        console.log(projects);

    //    });

        //var projects = [
        //    {
        //        value: "jquery",
        //        label: "jQuery",
        //        desc: "the write less, do more, JavaScript library",
        //        icon: "img/categories/chandeliers.png"
        //    },
        //    {
        //        value: "jquery-ui",
        //        label: "jQuery UI",
        //        desc: "the official user interface library for jQuery",
        //        icon: "img/categories/chandeliers.png"
        //    },
        //    {
        //        value: "sizzlejs",
        //        label: "Sizzle JS",
        //        desc: "a pure-JavaScript CSS selector engine",
        //        icon: "img/categories/chandeliers.png"
        //    }
        //];

        //$("#search_box").autocomplete({
        //    minLength: 0,
        //    source: projects,
        //    focus: function (event, ui) {
        //        $("#search_box").val(ui.item.label);
        //        return false;
        //    },
        //    select: function (event, ui) {
        //        $("#search_box").val(ui.item.label);

        //        return false;
        //    }
        //})
        //    .autocomplete("instance")._renderItem = function (ul, item) {
        //        return $("<li>")
        //            .append("<div style='display: inline-flex'>" + "<div style='width:60px; height:42px; padding-right: 5px; margin: auto'><img src=" + item.icon + " alt='Smiley face'  style='width:100%' align='left' ></div><div>" + item.label + "<br>" + item.desc + "<hr></div></div>")
        //            .appendTo(ul);
        //    };
    });
//});