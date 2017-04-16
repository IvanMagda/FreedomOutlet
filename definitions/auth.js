var User = GETSCHEMA('User');

F.on('module#auth', function (type, name) {
    console.log('module auth catched');

    var auth = MODULE('auth');
    auth.onAuthorize = function (id, callback, flags) {
        var user = User.by_id[id];
        if (user.auto_login) {
            return callback(user);
        } else
            return callback(null);
    };
});

F.on('controller', function (self, name) {
    var user = self.user;
    if (user === null || name !== 'admin')
        return;

    var role = '@' + user.role;
    if (self.flags.indexOf(role) === -1) {

        // Cancels executing of the controller
        self.cancel();

        // Performs redirect
        self.redirect('/')
        return;
    }
});