$(document).ready(function () {
    $('.main-gallery')[0].addEventListener("click", currentImg);
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