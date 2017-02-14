var Product = GETSCHEMA('User');

F.on('module#auth', function (type, name) {
    console.log('module auth catched');

    var auth = MODULE('auth');
    auth.onAuthorize = function (id, callback, flags) {
        console.log('find user id', id);

        var user = Product.by_id[id];
        return callback(user);
    };
});