var Product = GETSCHEMA('Product');
var fs = require('fs');
var shops = require('../definitions/shops.json')
var breadcrumbs_mapping = require('../definitions/breadcrumbs_mapping.json')

exports.install = function () {
    F.route('/', main);
    F.route('/products/{category}', view_products_list);
    F.route('/product/{product_id}', view_product);
    F.route('/manufacturer/{manufacturer}', view_products_manufacturer);
    F.route('/search/{search_text}', search, ['get']);
    F.route('/search_result/{search_text}', search_result, ['get']);
    F.route('/about', view_about);
    F.route('/contacts', view_contacts);
    F.route('/idea-for-home', view_idea_for_home_list);
    F.route('/idea-for-home/one', view_idea_for_home_one);
    F.route('/favorites/local/{favor_id}', view_favorites_local, ['get']);
    F.route('/favorites/add/', favorites_add, ['post']);
    F.route('/favorites/user/{user_id}', view_favorites_user, ['get']);
    F.route('/favorites/{user_id}', favorites, ['get']);
    F.route('/favorites/delete/', favorites_delete, ['post']);
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
        self.view('/list_product/list-product', {
            breadcrumbs: breadcrumbs_mapping[category],
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
    Product.imgs(product_id, function (result) {
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
                breadcrumbs: breadcrumbs_mapping[product.category],
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
        var pagination = new Builders.Pagination(result.length, page, perpage, '?page={0}');
        self.view('/list_product/list-product', {
            breadcrumbs: result[0].manufacturer,
            sort: sort,
            items: perpage,
            products: result,
            pagination: pagination,
            manufacturer: manufacturer
        });
    })
}

function search(search_text) {
    var self = this;
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
        var pagination = new Builders.Pagination(result.length, page, perpage, '?page={0}');
        self.view('/list_product/list-product', {
            breadcrumbs: breadcrumbs_mapping['search'],
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

function view_favorites_local(favor_id) {
    var self = this;
    var sort = self.query.sort || 'name'
    var page = (self.query.page || '1').parseInt();
    var perpage = (self.query.number || '12').parseInt();

    Product.favorites_by_product_id(favor_id, function (result) {
        result.sort(dynamicSort(sort));
        console.log(result);
        var pagination = new Builders.Pagination(result.length, page, perpage, '?page={0}');
        self.view('/list_product/list-product', {
            breadcrumbs: breadcrumbs_mapping['favorites'],
            sort: sort,
            items: perpage,
            products: result,
            pagination: pagination
        });
    })
}

function favorites_add() {
    var self = this;
    Product.favorites_add(self.body.user_id, self.body.product_id, function (result) {
        self.json(SUCCESS(result));
    });
}

function view_favorites_user(user_id) {
    var self = this;
    var sort = self.query.sort || 'name'
    var page = (self.query.page || '1').parseInt();
    var perpage = (self.query.number || '12').parseInt();

    Product.favorites_by_user_id(user_id, function (result) {
        if (!result)
            result=[];

        result.sort(dynamicSort(sort));
        var pagination = new Builders.Pagination(result.length, page, perpage, '?page={0}');
        self.view('/list_product/list-product', {
            breadcrumbs: breadcrumbs_mapping['favorites'],
            sort: sort,
            items: perpage,
            products: result,
            pagination: pagination
        });
    })
}

function favorites(user_id) {
    var self = this;
    Product.favorites_list(user_id, function (result) {
        self.json(result);
    })
}

function favorites_delete() {
    var self = this;
    Product.favorites_delete(self.body.user_id, self.body.product_id, function (result) {
        self.json(SUCCESS(result));
    });
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