$(document).ready(function () {
    $('.header__categories-nav_list>li').click(function (e) {
        $('.sub-dir_box').not($(this).find(".sub-dir_box")).removeClass('visible-sub');
        e.stopPropagation();
        $(this).find(".sub-dir_box").toggleClass("visible-sub");
    });
    $('.sub-dir_box').click(function (e) {
        e.stopPropagation();
    });

    $('body,html').click(function (e) {
        $('.sub-dir_box').removeClass('visible-sub');
    });
});