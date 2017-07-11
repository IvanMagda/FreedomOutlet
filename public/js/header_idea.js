$(window).resize(function () {
    var categories = $("#idea-header__middle-wrapper_bottom");
    var width = window.innerWidth;

    if (width < 950 || width > 1200) {
        categories.css("display", "flex");
    } else {
        if (width > 950 && width < 1201)
            categories.css("display", "none");
    }

    if (width > 950) {
        $("#idea-header__middle-wrapper").removeClass("display_flex");
        $("#idea-header__user-actions").removeClass("display_flex");
    }
});

$(document).ready(function () {
    $(".tablet_menu").click(function () {
        $("#idea-header__middle-wrapper_bottom").toggle();
    });

    $(".mobile_menu").click(function () {
        $("#idea-header__middle-wrapper").toggleClass("display_flex");
        $("#idea-header__user-actions").toggleClass("display_flex");
    });
});