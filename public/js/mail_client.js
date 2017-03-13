$(document).ready(function () {
    //$('#mail-send').click(function () {
    //    //console.log('click111');
    //    if (validateForm()){
    //        $.post('/mail/send', $('#mail-form').serialize(), function (answer) {
    //            if (answer.success) {
    //                //window.location.href = '/mail/?success=1';
    //                return;
    //            }
    //            console.log(answer);
    //        });
    //    }
    //});

    $(function () {
        $.mask.definitions['~'] = '[+-]';
        $("#tel").mask("+38(999) 999 99 99");
    });
});

function validateForm() {
    var name = document.forms["mailForm"].name.value;
    var phone = document.forms["mailForm"].phone.value;
    var message = document.forms["mailForm"].message.value;

    if (name == "" || phone == "" || message == "") {
        document.getElementById('validateGlobal').style.visibility = "visible";
        document.getElementById('validatePhone').style.visibility = "visible";
        document.getElementById('validateMessage').style.visibility = "visible";
        document.getElementById('validateName').style.visibility = "visible";
        return false;
    } else {
        return true;
    }
}