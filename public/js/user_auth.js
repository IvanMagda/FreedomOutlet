$(document).ready(function () {
    $('#register-form').find('button').click(function () {
        //event.preventDefault();
        console.log('sending');
        $.post('/register', $('#reg-form').serialize(), function (answer) {
            console.log("from jquery");
            console.log(answer);
            //return false;
        });
    });
});

function register() {
    $('#register-form').show();
}