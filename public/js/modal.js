$(document).ready(function () {

    var overlay = $('#overlay');
    var open_modal = $('.open_modal');
    var close = $('.modal_close, #overlay');
    var modal = $('.modal_div');

    open_modal.click(function (event) {
        event.preventDefault();
        var div = $(this).attr('href');
        overlay.fadeIn(400,
            function () {
                $(div)
                    .css('display', 'block')
                    .animate({ opacity: 1, top: '50%' }, 200);
            });
    });

    close.click(function () {
        modal
            .animate({ opacity: 0, top: '45%' }, 200,
            function () {
                $(this).css('display', 'none');
                overlay.fadeOut(400);
            }
            );
    });

    $('#register-form').find('button').click(function () {
        $.post('/register', $('#reg-form').serialize(), function (answer) {
            if (answer.success) {
                window.location.href = '/';
                return;
            }
            console.log(answer);
        });
    });

    $('#login-form-container').find('button').click(function () {
        $.post('/authorization', $('#login-form').serialize(), function (answer) {
            if (answer.success) {
                window.location.href = '/';
                return;
            }
            console.log(answer);
        });
    });
});

function logout() {
    $.get('/logout', function () {
        window.location.href = '/';
    })
}