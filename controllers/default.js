var Product = GETSCHEMA('Product');

exports.install = function () {
    F.route('/');
    F.route('/products', view_products_list);
    F.route('/products/{product_id}', view_product);
	// or
	// F.route('/');
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