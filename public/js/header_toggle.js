$(document).ready(function () {
    var hidden = true;

    window.addEventListener("scroll", function (event) {
        var top = this.scrollY;
        if (top > 125) {
            if (hidden) {
                $('header.minified-header').animate({
                    height: "show",
                }, 1000, function () {
                    hidden = false;
                });
            };
        } else if(top<185){
            if (!hidden) {
                $('header.minified-header').animate({
                    height: "hide",
                }, 500, function () {
                    hidden = true;
                });
            };
        };
    }, false);
});