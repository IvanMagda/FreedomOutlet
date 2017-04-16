var User = GETSCHEMA('User');
var Auth = MODULE('auth');

exports.install = function () {
    F.route('/register', json_register, ['post']);
    F.route('/authorization', json_authorization, ['post']);
    F.route('/logout', json_logout);
    F.route('/user/{user_id}', view_user);
};

function json_register() {
    var self = this;
    User.register(this.body, function (result) {
        var user = result;
        Auth.login(self, user.id, user);
        self.redirect('/');
    });
}

function json_authorization() {
    var self = this;
    console.log(self.body);
    User.query({ login: self.body.login }, function (err, user) {
        if (user) {
            User.operation('checkpassword', user, self.body.pass, function (err, res) {
                if (res) {
                    user.auto_login = self.body.auto_login;
                    console.log(user);

                    User.update(user, function (rezult) {
                        Auth.login(self, user.id, user);
                        if (user.role === 'admin') {
                            self.redirect('/admin');
                        } else {
                            self.redirect('/');
                        }
                    });
                } else
                    self.redirect('/');
            });
        } else
            self.json(SUCCESS(false));
    });
}

function json_logout() {
    var self = this;
    self.user.auto_login = false;
    User.update(self.user, function (rezult) {
        Auth.logoff(self, self.user.id);
        self.json(rezult);
    });
}

function view_admin() {
    var self = this;
    self.view('/admin/admin');
}

function view_user(id) {
    var user = User.by_id[id];
    var self = this;
    self.view('/user/user_cabinet', {
        user: user
    });
}