$(document).ready(function () {
    var hidden = true;

    window.addEventListener("scroll", function (event) {
        if (this.scrollY < 185) {
            $('header.minified-header').animate({
                height: "hide",
            }, 500, function () {
                hidden = true;
            });
        } else {
            if (this.scrollY > 125) {
                if (hidden) {
                    hidden = false;
                    $('header.minified-header').animate({
                        height: "show",
                    }, 1000, function () {
                        hidden = false;
                    });
                };
            } else if (this.scrollY < 185) {
                if (!hidden) {
                    hidden = true;
                    $('header.minified-header').animate({
                        height: "hide",
                    }, 500, function () {
                        hidden = true;
                    });
                };
            };
        };
    }, false);
});