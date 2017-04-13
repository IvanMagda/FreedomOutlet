function addToFavorites(product_id) {
    var user_id = $('#user_id').val();

    if (user_id) {
        var favor = { 'user_id': user_id, 'product_id': product_id };
        $.post('/favorites/add/', favor, function () {
            console.log('add');
        });
    } else {
        if (localStorage.getItem("favorites")) {
            localStorage.setItem("favorites", safeAdd(product_id));
        } else {
            localStorage.setItem("favorites", product_id);
        }
    }
}

function safeAdd(product_id) {
    var favorites = localStorage.getItem("favorites");
    var favorArray = favorites.split(',');
    var rezult = favorites.concat(',' + product_id);

    favorArray.forEach(function (e) {
        if (parseInt(e, 10) == parseInt(product_id, 10)) {
            rezult = favorites;
        }
    });

    return rezult;
}