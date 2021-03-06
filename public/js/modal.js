$(document).ready(function () {

    var overlay = $('#overlay');
    var open_modal = $('.open_modal');
    var close = $('.modal-container_close, #overlay');
    var modal = $('.modal-container');

    open_modal.click(function (event) {
        event.preventDefault();
        var div = $(this).attr('href');
        if(div == "#reset_password_modal"){modal.css('display', 'none');}
        overlay.fadeIn(400,
            function () {
                $(div)
                    .css('display', 'flex')
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
        $("#tel, #tel2,#tel_register").mask("+38(999) 999 99 99");
    });
});

function logout() {
    $.get('/logout', function () {
        window.location.href = '/';
    })
}

function validate_modal_Form() {
    var mailModalForm = document.forms["offer_modal_Form"];
    var name = mailModalForm.name;
    var phone = mailModalForm.phone;
    var message = mailModalForm.message;

    var inputs = { name, phone, message};

    if (name.value == "" || phone.value == "" || message.value == "") {
        $(".offer-form_inputs").addClass("invalid");
        for (var key in inputs) {
            if (mailModalForm[key].value == "") {
                mailModalForm[key].classList.add("invalid");
            }
        };
        return false;
    } else {
        return true;
    }
}

function validate_login_Form() {
    var loginForm = document.forms["login_Form"];
    var email = loginForm.email;
    var pass = loginForm.pass;

    var inputs = { email, pass};

    if (email.value == "" || pass.value == "") {
        $(".log-form_inputs").addClass("invalid");
        for (var key in inputs) {
            if (loginForm[key].value == "") {
                loginForm[key].classList.add("invalid");
            }
        };
        return false;
    } else {
        return true;
    }
}

function validate_register_Form() {
    var registerForm = document.forms["register_Form"];
    var login = registerForm.login;
    var phone = registerForm.phone;
    var email = registerForm.email;
    var pass = registerForm.pass;

    var inputs = { login, phone, email, pass };

    if (login.value == "" || phone.value == "" || email.value == "" || pass.value == "") {
        $(".reg-form_inputs").addClass("invalid");
        for (var key in inputs) {
            if (registerForm[key].value == "") {
                registerForm[key].classList.add("invalid");
            }
        };
        return false;
    } else {
        return true;
        
    }
}

function validate_contact_us_modal_Form() {
    var mailModalForm = document.forms["contact_us_modal_Form"];
    var name = mailModalForm.name;
    var phone = mailModalForm.phone;
    var message = mailModalForm.message;

    var inputs = { name, phone, message};

    if (name.value == "" || phone.value == "" || message.value == "") {
        $(".mail-form_inputs").addClass("invalid");
        for (var key in inputs) {
            if (mailModalForm[key].value == "") {
                mailModalForm[key].classList.add("invalid");
            }
        };
        return false;
    } else {
        return true;
    }
}