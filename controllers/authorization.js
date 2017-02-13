var User = GETSCHEMA('User');

exports.install = function () {
    F.route('/auth', view_auth);
    F.route('/register', json_register, ['post']);
};

function view_auth() {
    var self = this;
    self.view('/temp/auth');
}

function json_register() {
    var self = this;
    User.register(this.body, function (result) {
        self.json(result);
    });
    console.log("from server");
    console.log(this.body);
}