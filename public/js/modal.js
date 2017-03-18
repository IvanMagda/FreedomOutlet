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

    //$('#register-form').find('button').click(function () {
    //    $.post('/register', $('#reg-form').serialize(), function (answer) {
    //        if (answer.success) {
    //            window.location.href = '/';
    //            return;
    //        }
    //        console.log(answer);
    //    });
    //});

    $('#login-form-container').find('button').click(function () {
        $.post('/authorization', $('#login-form').serialize(), function (answer) {
            if (answer.success) {
                window.location.href = '/';
                return;
            }
            console.log(answer);
        });
    });

    $(function () {
        $.mask.definitions['~'] = '[+-]';
        $("#tel_register").mask("+38(999) 999 99 99");
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

function validate_register_Form() {
    var login = document.forms["register_Form"].login;
    var phone = document.forms["register_Form"].phone;
    var mail = document.forms["register_Form"].mail;
    var pass = document.forms["register_Form"].pass;

    var inputs = { login, phone, mail, pass };
    var validate_ids = ['validate_modal_Name', 'validate_modal_Phone', 'validate_modal_Mail', 'validate_modal_Pass', 'validate_modal_Global'];

    //console.log(inputs);

    if (login.value == "" || phone.value == "" || mail.value == "" || pass.value == "") {
        for (var key in inputs) {
            if (document.forms["register_Form"][key].value == "") {
                document.forms["register_Form"][key].style.border = "1px solid red";
            }
        };
        validate_ids.forEach(function (id) {
            console.log(id);
            document.getElementById(id).style.visibility = "visible";
        });
        return false;
    } else {
        return true;
    }
}