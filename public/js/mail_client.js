$(document).ready(function () {
    $(function () {
        $.mask.definitions['~'] = '[+-]';
        $("#tel").mask("+38(999) 999 99 99");
    });
});

function validate_mail_Form() {
    var mailForm = document.forms["mailForm"];
    var name = mailForm.name;
    var phone = mailForm.phone;
    var message = mailForm.message;

    var inputs = { name, phone, message};

    if (name.value == "" || phone.value == "" || message.value == "") {
        mailForm.classList.add("invalid");
        for (var key in inputs) {
            if (mailForm[key].value == "") {
                mailForm[key].classList.add("invalid");
            }
        };
        return false;
    } else {
        return true;
    }
}