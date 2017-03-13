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

function validate_modal_Form() {
    var name = document.forms["mail_modal_Form"].name.value;
    var phone = document.forms["mail_modal_Form"].phone.value;
    var message = document.forms["mail_modal_Form"].message.value;

    if (name == "" || phone == "" || message == "") {
        document.getElementById('validate_modal_Global').style.visibility = "visible";
        document.getElementById('validate_modal_Phone').style.visibility = "visible";
        document.getElementById('validate_modal_Message').style.visibility = "visible";
        document.getElementById('validate_modal_Name').style.visibility = "visible";
        return false;
    } else {
        return true;
    }
}