$(document).ready(function () {
    $('.heart').trigger("onload");
});

function favoriteActions(product_id, local_element) {
    var user_id = $('#user_id').val();
    if (!local_element.classList.contains("selected")) {
        addToFavorites(product_id, local_element, user_id);
    } else {
        deleteFromFavorites(product_id, local_element, user_id);
    }
}

function addToFavorites(product_id, local_element, user_id) {
    local_element.classList.add("selected");

    if (user_id) {
        var favor = { 'user_id': user_id, 'product_id': product_id };
        $.post('/favorites/add/', favor, function (answer) {
            if (answer) {
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
    local_element.classList.remove("selected");

    if (user_id) {
        var data = { 'user_id': user_id, 'product_id': product_id };
        $.post("/favorites/delete/", data);
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
        if (localStorage.getItem("favorites")) {
            window.location.href = "/favorites/local/" + localStorage.getItem("favorites").split(',');
        }
    }
}

function markSelected(product_id, local_element) {
    var user_id = $('#user_id').val();

    if (user_id) {
        $.get("/favorites/" + user_id, function (result) {
            result.forEach(function (e) {
                if (parseInt(e, 10) == parseInt(product_id, 10)) {
                    local_element.classList.add("selected");
                }
            });
        });
    } else {
        var favorites = localStorage.getItem("favorites");
        if (favorites) {
            favorites = favorites.split(',');
            favorites.forEach(function (e) {
                if (parseInt(e, 10) == parseInt(product_id, 10)) {
                    local_element.classList.add("selected");
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