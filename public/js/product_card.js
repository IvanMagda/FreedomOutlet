$(document).ready(function () {
    $('.main-gallery')[0].addEventListener("click", currentImg);

    var minSideH = 660;

    minSideH = $('.slick-track').height();

    $('.right-sidebar').css("min-height", minSideH);

    /*$('.main-gallery div.slick-slide img').on('bestfit', function () {
        var css;
        var ratio = $(this).width() / $(this).height();
        if (ratio < 1,3) css = { width: 'auto', height: '100%' };
        else css = { width: '100%', height: 'auto' };
        $(this).css(css);
    }).on('load', function () {
        $(this).trigger('bestfit');
    }).trigger('bestfit');*/
});

function currentImg() {
    if (document.getElementsByClassName('slick-active')[0].getAttribute("name")) {
        document.getElementById('current_img').innerHTML = document.getElementsByClassName('slick-active')[0].getAttribute("name");
    };
};

function info_tile(node) {
    var parent = node.parentNode.parentNode;
    parent.childNodes[4].style.display = 'flex';
}

