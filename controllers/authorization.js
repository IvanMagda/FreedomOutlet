var User = GETSCHEMA('User');
var Reset_pass = GETSCHEMA('Reset_pass');
var Auth = MODULE('auth');
var passwordHash = require('password-hash');


exports.install = function () {
    F.route('/register', json_register, ['post']);
    F.route('/authorization', json_authorization, ['post']);
    F.route('/logout', json_logout);
    F.route('/user/{user_id}', view_user);
    F.route('/reset_pass/', view_reset_pass);
    F.route('/new_pass', register_change_pass, ['post']);
    F.route('/relogin/{login}', relogin);
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
    User.query({ email: self.body.email }, function (err, user) {
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

function view_reset_pass() {
    var self = this;

    self.view('/temp/reset_pass', {
        id: self.query.u_id,
        hash: self.query.pass
    });
}

function register_change_pass() {
    var self = this;
    console.log(self.body);
    var timeNow = new Date();
    var user = Reset_pass.by_user_id[self.body.id];

    if (timeNow > user.expiration) {
        self.redirect('/');
    } else {
        Reset_pass.operation('checkpasswordreset', self.body.pass, user.temp_pass, function (err, res) {
            if (res) {
                console.log("register change");
                console.log(res);
                var userChanged = User.by_id[self.body.id];
                userChanged.hash = passwordHash.generate(self.body.new_pass + "");
                console.log(userChanged);
                    User.update(userChanged, function (result) {
                        if (result) {
                            delete Reset_pass.by_user_id[self.body.id];
                            console.log(Reset_pass.by_user_id);
                            self.redirect('/relogin/' + userChanged.login);
                        }
                    });
            }
        });
    }
}

function relogin(login) {
    var self = this;
    self.view('/temp/relogin', {
        name: login
    });
}