var User = GETSCHEMA('User');

exports.install = function () {
    F.route('/mail/send', redirect_mail, ['post']);
    F.route('/mail/reset_pass', reset_pass, ['post']);
};

function redirect_mail() {
    var self = this;

    // Function is reading view /temp/mail_template which is a template for mail
    // The first parameter specifies the address to which it is necessary to send
    // Mail sender is set in config file, located in root directory
    self.mail('iv.y.magda@gmail.com', 'Product Offer', '/temp/mail_template', { name: this.body.name, phone: this.body.phone, message: this.body.message });
    //self.json(SUCCESS(true));
    self.redirect('/');
}

function reset_pass() {
    var self = this;
    console.log(self.body);
    User.generate_new_pass(self.body.reset_mail, function (reset) {
        self.mail('iv.y.magda@gmail.com', 'Reset Pass', '/temp/mail_reset_pass', { reset: reset, host: F.config.HOST });
        self.redirect('/');
    });
}