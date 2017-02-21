var User = GETSCHEMA('User');
var Auth = MODULE('auth');

exports.install = function () {
    F.route('/auth', view_auth);
    F.route('/register', json_register, ['post']);
    F.route('/authorization', json_authorization, ['post']);
    F.route('/logout', json_logout);
    //F.route('/admin', view_admin);
};

function view_auth() {
    var self = this;
    self.view('/temp/auth');
}

function json_register() {
    var self = this;
    User.register(this.body, function (result) {
        self.json(SUCCESS(result));
    });
    console.log("from server");
    //console.log(this.body);
}

function json_authorization() {
    //console.log(this.body);
    var self = this;
    User.query({ login: this.body.login }, function (err, user) {
        //console.log(user);
        if (user) {
            User.operation('checkpassword', user, self.body.pass, function (err, res) {
                if (res) {
                    Auth.login(self, user.id, user);
                }
                self.json(SUCCESS(res));
            });
        }
        else
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