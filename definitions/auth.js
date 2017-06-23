var User = GETSCHEMA('User');

F.on('module#auth', function (type, name) {
    console.log('module auth catched');

    var auth = MODULE('auth');
    auth.onAuthorize = function (id, callback, flags) {
        User.by_id(id, function (user) {
        if (user && user.auto_login) {
            return callback(user);
        } else
            return callback(null);
        });
    };
});

F.on('controller', function (self, name) {
    var user = self.user;
    if (name === 'admin' && user !== null) {
        var role = '@' + user.role;
        if (self.flags.indexOf(role) === -1) {

            // Cancels executing of the controller
            self.cancel();

            // Performs redirect
            self.redirect('/')
            return;
        } else { return; }
    } else { return; }
});