$(window).resize(function () {
    var search_box = $(".search_box");
    var width = window.innerWidth;

    if (width > 1100) {
        $(".header__categories-nav").css("display", "flex");
    } else {
        $(".header__categories-nav").css("display", "none");
    };

    if (width > 560) {
        search_box.css("display", "flex");
    } else {
        search_box.css("display", "none");
        $(".header__categories-nav").css("display", "none");
    };

    if (width < 1280) {
        $(".product-card__parametrs").css('height', "");
    } else {
        setProductParametrsHeight();
    };

    if (width < 720) {
        setProductParametrsHeightOutline();
    };
});

$(document).ready(function () {
    var width = window.innerWidth;
    if (width < 1280) {
        $(".product-card__parametrs").css('height', "");
    } else {
        setProductParametrsHeight();
    };

    if (width < 720) {
        setProductParametrsHeightOutline();
    };

    $(".mobile_menu").click(function () {
        if (window.innerWidth > 560) {
            $(".header__categories-nav").toggle();
        } else {
            $(".header__categories-nav").toggle();
            $(".search_box").toggle();
        };
    });
});

function setProductParametrsHeight() {
    var result = 475;
    $(".product-card__parametrs p").each(function () {
        result += $(this).height();
        result += 10;
    }, this);
    $(".product-card__parametrs").css('height', result);
}

function setProductParametrsHeightOutline() {
    var result = $(".product-card__parametrs").height();
    result += 10;
    $(".product-card__parametrs").css('height', result);
}

function toggle_visibility(id) {
    var content = document.getElementById("content_" + id);
    var description = document.getElementById("description_" + id);
    if (content.style.display === 'block' || content.style.display === '') {
        content.style.display = 'none';
        description.style.display = 'block';
    } else {
        content.style.display = 'block';
        description.style.display = 'none';
    };
}


$(document).ready(function () {
    var status = $('.sliderInfo');
    var slickElement = $('.product-card__carousel');

    slickElement.on('init reInit afterChange', function (event, slick, currentSlide, nextSlide) {
        //currentSlide is undefined on init -- set it to 0 in this case (currentSlide is 0 based)
        var i = (currentSlide ? currentSlide : 0) + 1;
        status.text(i + ' из ' + slick.slideCount + ' изображений');
    });

    setTimeout(function () {
        if ($('.slick-active').width() == 0) {
            $('.product-card__carousel').slick('unslick');
            $('.product-card__carousel').slick({
                infinite: true,
                centerMode: true,
                slidesToShow: 1,
                slidesToScroll: 1,
                autoplay: false,
                fade: true,
                cssEase: 'linear',
                nextArrow: '<a href="#" class="angle-right"></a>',
                prevArrow: '<a href="#" class="angle-left"></a>',
                centerPadding: 0
            });
        };
    }, 500);


    $('.product-card__carousel').slick({
        infinite: true,
        centerMode: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: false,
        fade: true,
        cssEase: 'linear',
        nextArrow: '<a href="#" class="angle-right"></a>',
        prevArrow: '<a href="#" class="angle-left"></a>',
        centerPadding: 0
    });


    var sl_param = {
        infinite: true,
        centerMode: true,
        slidesToShow: 3,
        slidesToScroll: 3,
        autoplay: false,
        autoplaySpeed: 2000,
        dots: false,
        nextArrow: '<a href="#" class="angle-right"></a>',
        prevArrow: '<a href="#" class="angle-left"></a>',
        centerPadding: 0,
        responsive: [
            {
                breakpoint: 1380,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 3,
                    infinite: true,
                    dots: false
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
    };

    var carousel_check = $('.more-products__carousel_item');

    if(carousel_check[0].children.length>0 && carousel_check[0].children.length<4){
        sl_param.slidesToShow = carousel_check[0].children.length-1;
        sl_param.slidesToScroll = 1;
    }

    $('.more-products__carousel_item').slick(sl_param);
});