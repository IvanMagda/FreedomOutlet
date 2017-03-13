$(document).ready(function() {
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
        // infinite: false,
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

function info_tile(node) {
    var parent = node.parentNode.parentNode;
    //var elt = findAncestor(parent, 'product-info');
    console.log(parent);
    parent.childNodes[4].style.display = 'flex';
}

function findAncestor(el, sel) {
    while ((el = el.parentElement) && ((el.matches || el.matchesSelector).call(el, sel))) { console.log(el); };
    return el;
}

function close_info(node) {
    node.parentNode.parentNode.parentNode.style.display = 'none';
}