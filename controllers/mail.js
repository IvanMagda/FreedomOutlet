exports.install = function () {
    //F.route('/mail', view_mail);
    F.route('/mail/send', redirect_mail, ['post']);
};

function view_mail() {
    var self = this;
    self.view('/temp/mail');
}

function redirect_mail() {
    var self = this;

    // Function is reading view /temp/mail_template which is a template for mail
    // The first parameter specifies the address to which it is necessary to send
    // Mail sender is set in config file, located in root directory
    self.mail('iv.y.magda@gmail.com', 'Product Offer', '/temp/mail_template', { name: this.body.name, phone: this.body.phone, message: this.body.message });
    self.json(SUCCESS(true));
}