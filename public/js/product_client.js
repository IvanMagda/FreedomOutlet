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

    $('#edit-product').click(function () {
        $.post('/products/update', $('#edit-product-form').serialize(), function (answer) {
            if (answer.success) {
                window.location.href = '/products';
                return;
            }
            console.log(answer);
        });
    });
});

function delete_p(id) {
    $.post('/products/delete/'+id, function () {
        window.location.href = '/products';
    })
}