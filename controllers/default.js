var Product = GETSCHEMA('Product');
var fs = require('fs');
var shops = require('../definitions/shops.json')

exports.install = function () {
    F.route('/', main);
    F.route('/products/{category}', view_products_list);
    F.route('/admin', view_admin);
    F.route('/product/{product_id}', view_product);
    F.route('/admin/{product_id}', view_admin_product);
    F.route('/products/create', view_product_add);
    F.route('/products/create', product_create, ['upload'], { flags: ['upload'], length: 25 * 1024 * 1024, timeout: 30 * 60 * 1000 });
    F.route('/products/update/{product_id}', view_product_update);
    F.route('/products/update/', product_update, ['upload'], { flags: ['upload'], length: 25 * 1024 * 1024, timeout: 30 * 60 * 1000 });
    F.route('/products/delete/{product_id}', product_delete, ['post']);
    F.route('/products/delete_img/', product_delete_img, ['post']);

};

function main() {
    var self = this;

    var is_new = [];

    Product.list.forEach(function (e) {
        console.log(e);
        if (e.is_new == 1) {
            is_new.push(e);
        }
    });


    self.view('/main/main', {
        products: is_new
    });

}

function view_products_list(categ) {
    var self = this;
    var category = categ;
    var sort = self.query.sort || 'name'

    var page = (self.query.page || '1').parseInt();
    var perpage = (self.query.number || '15').parseInt();
    

    Product.pagination(page, perpage, sort, category, function (prod) {
        var pagination = new Builders.Pagination(prod.length, page, perpage, '?page={0}');
        self.view('/list_product/list-product', {
            breadcrumbs: category,
            sort:sort,
            items: perpage,
            products: prod,
            pagination: pagination
        });
    });

}

function view_product(product_id) {
    var product = Product.by_id[product_id];
    var img = [];
    var available = [];
    var i = 1;
    var self = this;

    var avl = product.available_in.split(',');
    avl.forEach(function (e) {
        available.push(shops[e]);
    })
    console.log(available);
    Product.imgs(product_id, function (result) {
        result.forEach(function (e) {
            if (e.name.indexOf('Galery') > -1) {
                e.size = i;
                img.push(e);
                i++;
            }
        })
        //var immages = JSON.stringify(img);
        self.view('/product_card/product-card', {
            product: product,
            immages: img,
            available: available
        });
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
    //console.log(self.File.path);
    Product.create_new(self.body, self.files, function (result) {
        self.view('/admin/product_add');
    });
}

function view_product_update(product_id) {
    var self = this;
    var product = Product.by_id[product_id];
    var immages;
    Product.imgs(product_id, function (result) {
        immages = JSON.stringify(result);
        console.log(immages);
        self.view('/admin/product_edit', {
            product: product,
            immages: immages
        });
    });
    console.log(immages);
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

function product_delete_img() {
    var self = this;
    console.log(self.body);
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