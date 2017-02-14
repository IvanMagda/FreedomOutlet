$(document).ready(function () {
    $('#create-product').click(function () {
        $.post('/products/create', $('#create-product-form').serialize(), function (answer) {
            if (answer.success) {
                window.location.href = '/products';
                return;
            }
            console.log(answer);
        });
    });

    //$('#login-form-container').find('button').click(function () {
    //    $.post('/authorization', $('#login-form').serialize(), function (answer) {
    //        if (answer.success) {
    //            window.location.href = '/auth';
    //            return;
    //        }
    //        console.log(answer);
    //    });
    //});
});