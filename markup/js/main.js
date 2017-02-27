$( document ).ready(function() {
    $('.main-page-carousel').slick({
           dots: true,
           slidesToShow: 4,
           slidesToScroll: 1,
           // autoplay: true,
           // autoplaySpeed: 2000,
    });

    $('.main-product-card-gall').slick({
        //dots: true,
        arrows: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        // autoplay: true,
        // autoplaySpeed: 2000,
    });


    $('.product-card-carousel').slick({
        //dots: true,
        arrows: true,
        slidesToShow: 3,
        slidesToScroll: 1,
        // autoplay: true,
        // autoplaySpeed: 2000,
    });

});