var User = GETSCHEMA('User');
var Auth = MODULE('auth');

exports.install = function() {
    F.route('/auth', view_auth);
    F.route('/register', json_register, ['post']);
    F.route('/authorization', json_authorization, ['post']);
    F.route('/logout', json_logout);
    F.route('/user/{user_id}', view_user);
};

function view_auth() {
    var self = this;
    self.view('/temp/auth');
}

function json_register() {
    var self = this;
    User.register(this.body, function(result) {
        self.redirect('/');
    });
    console.log("from server");
}

function json_authorization() {
    var self = this;
    User.query({ login: this.body.login }, function(err, user) {
        if (user) {
            User.operation('checkpassword', user, self.body.pass, function(err, res) {
                if (res) {
                    Auth.login(self, user.id, user);
                    if (user.role === 'admin') {
                        self.redirect('/admin');
                    } else {
                        self.redirect('/');
                    }
                } else
                    self.redirect('/');
            });
        } else
            self.json(SUCCESS(false));
    });
}

function json_logout() {
    Auth.logoff(this, this.user.id);
    this.json(SUCCESS(true));
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