$(document).ready(function () {
    $('.main-gallery')[0].addEventListener("click", func);
});

function func() {
    if (document.getElementsByClassName('slick-active')[0].getAttribute("name")) {
        document.getElementById('current_img').innerHTML = document.getElementsByClassName('slick-active')[0].getAttribute("name");
    };
};

function info_tile(node) {
    var parent = node.parentNode.parentNode;
    //var elt = findAncestor(parent, 'product-info');
    console.log(parent);
    parent.childNodes[4].style.display = 'flex';
}