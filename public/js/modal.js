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

    $(function () {
        $.mask.definitions['~'] = '[+-]';
        $("#tel_register").mask("+38(999) 999 99 99");
    });

    $('#reset_password_modal').css('width', $("#login_modal").width());
    $('#reset_password_modal').css('height', $("#login_modal").height());
});

function logout() {
    $.get('/logout', function () {
        window.location.href = '/';
    })
}

function validate_modal_Form() {
    var mailModalForm = document.forms["mail_modal_Form"];
    var name = mailModalForm.name.value;
    var phone = mailModalForm.phone.value;
    var message = mailModalForm.message.value;

    if (name == "" || phone == "" || message == "") {
        validateField('validate_modal_Global');
        validateField('validate_modal_Phone');
        validateField('validate_modal_Message');
        validateField('validate_modal_Name');
        return false;
    } else {
        return true;
    }
}

function validate_login_Form() {
    var loginForm = document.forms["login_Form"];
    var login = loginForm.login;
    var pass = loginForm.pass;
    //ToDo validate stars
    if (login.value == "" || pass.value == "") {
        loginForm['pass'].style.border = "1px solid red";
        loginForm['login'].style.border = "1px solid red";
        return false;
    } else {
        return true;
    }
}

function validate_register_Form() {
    var registerForm = document.forms["register_Form"];
    var login = registerForm.login;
    var phone = registerForm.phone;
    var mail = registerForm.mail;
    var pass = registerForm.pass;

    var inputs = { login, phone, mail, pass };
    var validate_ids = ['validate_modal_Name', 'validate_modal_Phone', 'validate_modal_Mail', 'validate_modal_Pass', 'validate_modal_Global'];

    if (login.value == "" || phone.value == "" || mail.value == "" || pass.value == "") {
        for (var key in inputs) {
            if (registerForm[key].value == "") {
                registerForm[key].style.border = "1px solid red";
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

function validateField(fieldId) {
    document.getElementById(fieldId).style.visibility = "visible";
}