$(document).ready(function () {
    window.addEventListener("click", func);
});

function func() {
    if (document.getElementsByClassName('slick-active')[0].firstChild.name) {
        document.getElementById('current_img').innerHTML = document.getElementsByClassName('slick-active')[0].firstChild.name;
    };
};