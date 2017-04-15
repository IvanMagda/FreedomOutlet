var User = GETSCHEMA('User');

F.on('module#auth', function (type, name) {
    console.log('module auth catched');

    var auth = MODULE('auth');
    auth.onAuthorize = function (id, callback, flags) {
        var user = User.by_id[id];
        flags.push('@' + user.role);
        return callback(user);
    };
});
