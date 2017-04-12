$(document).ready(function () {
    $(function () {
        $.mask.definitions['~'] = '[+-]';
        $("#tel").mask("+38(999) 999 99 99");
    });
});

function validateForm() {
    function validateField(fieldId) {
        document.getElementById(fieldId).style.visibility = "visible";
    }

    var form = document.forms["mailForm"];
    var name = form.name.value;
    var phone = form.phone.value;
    var message = form.message.value;

    if (name == "" || phone == "" || message == "") {
        validateField('validateGlobal');
        validateField('validatePhone');
        validateField('validateMessage');
        validateField('validateName');
        return false;
    } else {
        return true;
    }
}