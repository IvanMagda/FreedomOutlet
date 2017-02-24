//$(document).ready(function () {
//    $('.gallery-icon-info-img').

//        click(function () {
//            $(this).parent('.item').css('display', 'none');
//        //$('.button1').toggle();
//        //$('.button2').toggle();
//    });
//});

function info_tile(parent) {
    parent.style.display = 'none';
    var elt = findAncestor(parent, 'product-info');
    console.log(elt);
    elt.childNodes[1].style.display = 'flex';
}

function findAncestor(el, sel) {
    while ((el = el.parentElement) && ((el.matches || el.matchesSelector).call(el, sel))) { console.log(el);};
    return el;
}
