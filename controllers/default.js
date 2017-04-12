var Product = GETSCHEMA('Product');
var fs = require('fs');
var shops = require('../definitions/shops.json')

exports.install = function () {
    F.route('/', main);
    F.route('/products/{category}', view_products_list);
    F.route('/admin', view_admin);
    F.route('/product/{product_id}', view_product);
    F.route('/manufacturer/{manufacturer}', view_products_manufacturer);
    F.route('/admin/{product_id}', view_admin_product);
    F.route('/products/create', view_product_add);
    F.route('/products/create', product_create, ['upload'], { flags: ['upload'], length: 25 * 1024 * 1024, timeout: 30 * 60 * 1000 });
    F.route('/products/update/{product_id}', view_product_update);
    F.route('/products/update/', product_update, ['upload'], { flags: ['upload'], length: 25 * 1024 * 1024, timeout: 30 * 60 * 1000 });
    F.route('/products/delete/{product_id}', product_delete, ['post']);
    F.route('/products/delete_img/', product_delete_img, ['post']);
    F.route('/search/{search_text}', search, ['get']);
    F.route('/search_result/{search_text}', search_result, ['get']);
    F.route('/about', view_about);
    F.route('/contacts', view_contacts);
    F.route('/idea-for-home', view_idea_for_home_list);
    F.route('/idea-for-home/one', view_idea_for_home_one);
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
    if (categ == 'all') { category = '%' }
    var sort = self.query.sort || 'name'

    var page = (self.query.page || '1').parseInt();
    var perpage = (self.query.number || '12').parseInt();
    

    Product.pagination(page, perpage, sort, category, function (prod, allLength) {
        var pagination = new Builders.Pagination(allLength, page, perpage, '?page={0}');
        console.log(pagination);
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
        console.log(result);
        result.imgs_arr.forEach(function (e) {
            if (e.name.indexOf('Galery') > -1) {
                e.size = i;
                img.push(e);
                i++;
            }
        })
        if (img.length === 'undefined') { img = 0; };
        Product.get_by_manufacturer(product.manufacturer, function (from_manufacturer) {
            self.view('/product_card/product-card', {
                product: product,
                immages: img,
                available: available,
                products_from_manufacturer: from_manufacturer
            });
        });
    });
}

function view_products_manufacturer(manufacturer) {
    var self = this;
    var sort = self.query.sort || 'name'
    var page = (self.query.page || '1').parseInt();
    var perpage = (self.query.number || '12').parseInt();

    Product.get_by_manufacturer(manufacturer, function (result) {
        result.sort(dynamicSort(sort));
        console.log(result);
        var pagination = new Builders.Pagination(result.length, page, perpage, '?page={0}');
        self.view('/list_product/list-product', {
            breadcrumbs: 'manufacturer',
            sort: sort,
            items: perpage,
            products: result,
            pagination: pagination,
            manufacturer: manufacturer
        });
    })
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
    console.log(product);
    var immages = [];
    Product.imgs(product_id, function (result) {
        immages = JSON.stringify(result.imgs_arr);
        console.log(immages);
        self.view('/admin/product_edit', {
            product: product,
            immages: immages,
            cities: result.cities
        });
    });
    console.log(immages);
}

function product_update() {
    var self = this;
    console.log(this.body);
    Product.update(self.body, actualFiles(self.files, self.body["fileuploader-list-files"]), function (result) {
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

function search(search_text) {
    var self = this;
    console.log(search_text);
    Product.search(decodeURI(search_text), 5, "", function (result) {
        console.log(result);
        self.json(result);
    })
    
}

function search_result(search_text) {
    var self = this;
    var sort = self.query.sort || "";
    var page = (self.query.page || '1').parseInt();
    var perpage = (self.query.number || '12').parseInt();

    Product.search(decodeURI(search_text), 0, sort, function (result) {
        //result.sort(dynamicSort(sort));
        console.log(result);
        var pagination = new Builders.Pagination(result.length, page, perpage, '?page={0}');
        self.view('/list_product/list-product', {
            breadcrumbs: 'search',
            sort: sort,
            items: perpage,
            products: result,
            pagination: pagination
        });
    })
}

function view_about() {
    var self = this;
    self.view('/company/about-company');
}

function view_contacts() {
    var self = this;
    self.view('/contacts/contacts');
}

function view_idea_for_home_list() {
    var self = this;
    self.view('/idea-for-home-list/list');
}

function view_idea_for_home_one() {
    var self = this;
    self.view('/idea-for-home-one/one');
}

function dynamicSort(property) {
    var sortOrder = 1;
    if (property[0] === "-") {
        sortOrder = -1;
        property = property.substr(1);
    }
    return function (a, b) {
        var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
        return result * sortOrder;
    }
}

function actualFiles(incomingFilesArray, listToCheck) {
    var filesResult = [];
    listToCheck = listToCheck.split(',');
    incomingFilesArray.forEach(function (file) {
        listToCheck.forEach(function (listItem) {
            if (listItem.indexOf(file.filename) !== -1) {
                filesResult.push(file);
            }
        })
    })
    return filesResult;
}