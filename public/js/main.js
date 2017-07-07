$(document).ready(function () {
    $('.new-products__carousel_item').slick({
        infinite: true,
        // centerMode: true,
        slidesToShow: 4,
        slidesToScroll: 4,
        autoplay: false,
        autoplaySpeed: 2000,
        dots: true,
        arrows: false,
        centerPadding: 0,
        responsive: [
            {
                breakpoint: 1380,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 3,
                    infinite: true,
                    dots: true
                }
            },
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2
                }
            },
            {
                breakpoint: 720,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2,
                    dots: false
                }
            }
            // You can unslick at a given breakpoint now by adding:
            // settings: "unslick"
            // instead of a settings object
        ]
    });
});

$(window).resize(function () {
    var categories = $("#main-header__middle-wrapper_bottom");
    var width = window.innerWidth;

    if (width < 950 || width > 1120) {
        categories.css("display", "flex");
    } else {
        if (width > 950 && width < 1121)
            categories.css("display", "none");
    }

    if (width > 950) {
        $("#main-header__middle-wrapper").removeClass("display_flex");
        $("#main-headr__user-actions").removeClass("display_flex");
    }
});

$(document).ready(function () {
    $(".tablet_menu").click(function () {
        $("#main-header__middle-wrapper_bottom").toggle();
    });

    $(".mobile_menu").click(function () {
        $("#main-header__middle-wrapper").toggleClass("display_flex");
        $("#main-headr__user-actions").toggleClass("display_flex");
    });

    var categories = $("#main-header__middle-wrapper_bottom");
    var width = window.innerWidth;

    if (width < 950 || width > 1120) {
        categories.css("display", "flex");
    } else {
        if (width > 950 && width < 1121)
            categories.css("display", "none");
    }

    if (width > 950) {
        $("#main-header__middle-wrapper").removeClass("display_flex");
        $("#main-headr__user-actions").removeClass("display_flex");
    }
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