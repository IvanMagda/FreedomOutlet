$(document).ready(function () {
    $('#mail-send').click(function () {
        //console.log('click111');
        $.post('/mail/send', $('#mail-form').serialize(), function (answer) {
            if (answer.success) {
                //window.location.href = '/mail/?success=1';
                return;
            }
            console.log(answer);
        });
    });
});