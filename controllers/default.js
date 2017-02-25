var Product = GETSCHEMA('Product');
var fs = require('fs');

exports.install = function () {
    F.route('/', main);
    F.route('/products', view_products_list);
    F.route('/admin', view_admin);
    F.route('/products/{product_id}', view_product);
    F.route('/admin/{product_id}', view_admin_product);
    F.route('/products/create', view_product_add);
    F.route('/products/create', product_create, ['upload'], { flags: ['upload'], length: 25 * 1024 * 1024, timeout: 30 * 60 * 1000 });
    F.route('/products/update/{product_id}', view_product_update);
    F.route('/products/update/', product_update, ['upload'], { flags: ['upload'], length: 25 * 1024 * 1024, timeout: 30 * 60 * 1000 });
    F.route('/products/delete/{product_id}', product_delete, ['post']);

};

function main() {
    var self = this;

    var is_new = [];

    Product.list.forEach(function (e) {
        console.log(e);
        if (e.is_new = 1) {
            is_new.push(e);
        }
    });


    self.view('/main/main', {
        products: is_new
    });

}

function view_products_list() {
    var self = this;
    self.view('/list_product/list-product', {
        products: Product.list
    });
}

function view_product(product_id) {
    var product = Product.by_id[product_id];
    var self = this;
    self.view('/product_card/product-card', {
        product: product
    });
}

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
    var product = Product.by_id[product_id];
    var self = this;
    self.view('/admin/product_edit', {
        product: product
    });
}

function product_update() {
    var self = this;
    console.log(this.body);
    Product.update(this.body, function (result) {
        if (result) {
            self.view('/admin/admin', {
                products: Product.list
            });
        } else {
            self.view('/main/main');
        }
        
        //self.json(SUCCESS(result));
    });
}

function product_delete(product_id) {
    var self = this;
    Product.delete_p(product_id, function (result) {
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