var Product = GETSCHEMA('Product');
var User = GETSCHEMA('User');
var fs = require('fs');
var adminConv = require('../modules/adminPriceConverterSettings');
exports.install = function () {
    F.route('/admin', view_admin, ['authorize', '@admin']);
    F.route('/admin/{product_id}', view_admin_product, ['authorize', '@admin']);
    F.route('/products/create', view_product_add, ['authorize', '@admin']);
    F.route('/products/create', product_create, ['upload', 'authorize', '@admin'], { flags: ['upload'], length: 25 * 1024 * 1024, timeout: 30 * 60 * 1000 });
    F.route('/products/update/{product_id}', view_product_update, ['authorize', '@admin']);
    F.route('/products/update/', product_update, ['upload', 'authorize', '@admin'], { flags: ['upload'], length: 25 * 1024 * 1024, timeout: 30 * 60 * 1000 });
    F.route('/products/delete/{product_id}', product_delete, ['post', 'authorize', '@admin']);
    F.route('/products/delete_img/', product_delete_img, ['post', 'authorize', '@admin']);
    F.route('/admin', view_admin_login, ['unauthorize']);
    F.route('/admin/users', view_admin_users, ['authorize', '@admin']);
    F.route('/admin/search/{search_text}', view_admin_search, ['get','authorize', '@admin']);
    F.route('/admin/currency', view_admin_currency, ['authorize', '@admin']);
    F.route('/admin/currency', admin_currency_save, ['post','authorize', '@admin']);
    F.route('/admin/shops', view_admin_shops, ['authorize', '@admin']);
    F.route('/admin/shops/save', admin_shops_save, ['authorize', '@admin']);
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
            self.redirect('/admin');
        } else {
            self.redirect('/');
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
    var page = self.query.page || 1;
    var perpage = self.query.number || 20;
    var sort = self.query.sort || 'name'
    var category = '%';

    Product.pagination(page, perpage, sort, category, function (prod, allLength) {
        var pagination = new Builders.Pagination(allLength, page, perpage, '?page={0}');
        self.view('/admin/admin', {
            sort: sort,
            items: perpage,
            products: prod,
            pagination: pagination
        });
    });
}

function view_admin_login() {
    var self = this;
    self.view('/admin/login');
}

function view_admin_users() {
    var self = this;
    var page = self.query.page || 1;
    var perpage = self.query.number || 20;
    var sort = self.query.sort || 'id'

    User.pagination(page, perpage, sort, function (users, allLength) {
        var pagination = new Builders.Pagination(allLength, page, perpage, '?page={0}');
        self.view('/admin/admin', {
            sort: sort,
            items: perpage,
            users: users,
            pagination: pagination
        });
    });
}

function view_admin_search(search_text) {
    var self = this;
    var sort = self.query.sort || "";
    var page = (self.query.page || '1').parseInt();
    var perpage = (self.query.number || '12').parseInt();

    Product.search(decodeURI(search_text), 0, sort, function (result) {
        var pagination = new Builders.Pagination(result.length, page, perpage, '?page={0}');
        self.view('/admin/admin', {
            sort: sort,
            items: perpage,
            products: result,
            pagination: pagination
        });
    })
}

function view_admin_currency() {
    var self = this;
    adminConv.getActualCurrency(function (cur) {
        self.view('/admin/currency', {
            currency: cur
        });
    });
}

function admin_currency_save() {
    var self = this;
    console.log(self.body);
    adminConv.changeSetting(self.body.admin_rate, self.body.type, function(){
        self.redirect('/admin');
    });
};

function view_admin_shops() {
    var self = this;
    self.view('/admin/shops', {
    });
}

function admin_shops_save() {
    var self = this;

}

function actualFiles(incomingFilesArray, listToCheck) {
    var filesResult = [];
    listToCheck = listToCheck.split(',');
    incomingFilesArray.forEach(function (file) {
        listToCheck.forEach(function (listItem) {
            if (listItem.indexOf(file.filename) !== -1 | file.name == "title_file" | file.name == "virtual_model") {
                filesResult.push(file);
            }
        })
    })
    return filesResult;
}

