function favoriteActions(product_id, local_element) {
    var user_id = $('#user_id').val();

    if (local_element.previousSibling.src.indexOf("heart-1.png") !== -1) {
        addToFavorites(product_id, local_element, user_id);
    } else {
        deleteFromFavorites(product_id, local_element, user_id);
    }
}

function addToFavorites(product_id, local_element, user_id) {
    local_element.previousSibling.src = "img/heart-2.png";

    if (user_id) {
        var favor = { 'user_id': user_id, 'product_id': product_id };
        console.log(favor);
        $.post('/favorites/add/', favor, function (answer) {
            if (answer) {
                console.log(answer);
                return;
            }
        });
    } else {
        if (localStorage.getItem("favorites")) {
            localStorage.setItem("favorites", safeAdd(product_id));
        } else {
            localStorage.setItem("favorites", product_id);
        }
    }
}

function deleteFromFavorites(product_id, local_element, user_id) {
    local_element.previousSibling.src = "img/heart-1.png";

    if (user_id) {

    } else {
        var favorites = localStorage.getItem("favorites").split(',');
        var index = favorites.indexOf(product_id.toString());
        favorites.splice(index, 1);
        localStorage.setItem("favorites", favorites);
    }
}

function viewMyFavorites() {
    var user_id = $('#user_id').val();

    if (user_id) {
        window.location.href = "/favorites/user/" + user_id;
    } else {
        window.location.href = "/favorites/local/" + localStorage.getItem("favorites").split(',');
    }
}

function markSelected(product_id, local_element) {
    var user_id = $('#user_id').val();
    var marked = false;
    
    if (user_id) {
        var result$.get("/favorites/" + user_id);

            result.forEach(function (e) {
                if (parseInt(e, 10) == parseInt(product_id, 10)) {
                    local_element.src = "img/heart-2.png";
                }
            });
    } else {
        var favorites = localStorage.getItem("favorites").split(',');
        if (favorites) {
            favorites.forEach(function (e) {
                if (parseInt(e, 10) == parseInt(product_id, 10)) {
                    local_element.src = "img/heart-2.png";
                }
            })
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