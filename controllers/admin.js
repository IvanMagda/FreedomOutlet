var Product = GETSCHEMA('Product');
var fs = require('fs');

exports.install = function () {
    F.route('/admin', view_admin, ['authorize', '@admin']);
    F.route('/admin/{product_id}', view_admin_product, ['authorize', '@admin']);
    F.route('/products/create', view_product_add, ['authorize', '@admin']);
    F.route('/products/create', product_create, ['upload'], { flags: ['upload'], length: 25 * 1024 * 1024, timeout: 30 * 60 * 1000 }, ['authorize', '@admin']);
    F.route('/products/update/{product_id}', view_product_update, ['authorize', '@admin']);
    F.route('/products/update/', product_update, ['upload'], { flags: ['upload'], length: 25 * 1024 * 1024, timeout: 30 * 60 * 1000 }, ['authorize', '@admin']);
    F.route('/products/delete/{product_id}', product_delete, ['post'], ['authorize', '@admin']);
    F.route('/products/delete_img/', product_delete_img, ['post'], ['authorize', '@admin']);
    F.route('/admin', view_admin_login, ['unauthorize']);
};



function view_admin_product(product_id) {
    var product = Product.by_id[product_id];
    var self = this;
    self.view('/admin/product', {
        product: product
    });
}

function view_product_add() {
    var self = this;
    self.view('/admin/product_add');
}

function product_create() {
    var self = this;
    Product.create_new(self.body, self.files, function (result) {
        self.view('/admin/product_add');
    });
}

function view_product_update(product_id) {
    var self = this;
    var product = Product.by_id[product_id];
    var immages = [];
    Product.imgs(product_id, function (result) {
        immages = JSON.stringify(result.imgs_arr);
        self.view('/admin/product_edit', {
            product: product,
            immages: immages,
            cities: result.cities
        });
    });
}

function product_update() {
    var self = this;
    Product.update(self.body, actualFiles(self.files, self.body["fileuploader-list-files"]), function (result) {
        if (result) {
            self.view('/admin/admin', {
                products: Product.list
            });
        } else {
            self.view('/main/main');
        }
    });
}

function product_delete(product_id) {
    var self = this;
    Product.delete_p(product_id, function (result) {
        self.json(SUCCESS(result));
    });
}

function product_delete_img() {
    var self = this;
    Product.delete_img(self.body.src, function (result) {
        self.json(SUCCESS(result));
    });
}

function view_admin() {
    var self = this;
    var list = Product.list;
    self.view('/admin/admin', {
        products: list
    });
}

function view_admin_login() {
    var self = this;
    self.view('/admin/login');
}