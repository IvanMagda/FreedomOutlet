var Product = GETSCHEMA('Product');

exports.install = function () {
    F.route('/');
    F.route('/products', view_products_list);
    F.route('/products/{product_id}', view_product);
    F.route('/products/create', view_product_add);
    F.route('/products/create', view_product_create, ['post']);
    F.route('/products/update/{product_id}', view_product_update, ['put']);
    F.route('/products/delete/{product_id}', view_product_delete, ['post']);
};

function view_products_list() {
	var self = this;
    self.view('/temp/products_list', {
        products : Product.list
    });
}

function view_product(product_id) {
    var product = Product.by_id[product_id];
    var self = this;
    self.view('/temp/product', {
        product: product
    });
}

function view_product_add() {
    var self = this;
    self.view('/temp/product_add');
}

function view_product_create() {
    var self = this;
    Product.create_new(this.body, function (result) {
        self.json(SUCCESS(result));
    });
    console.log("from server product");
    console.log(this.body);
}

function view_product_update() {

}

function view_product_delete(product_id) {
    var self = this;
    Product.delete_p(product_id, function (result) {
        self.json(SUCCESS(result));
    });
}