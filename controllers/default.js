var Product = GETSCHEMA('Product');
var fs = require('fs');
var shops = require('../definitions/shops.json');
var breadcrumbs_mapping = require('../definitions/breadcrumbs_mapping.json');
var convertCurrency = require('../modules/priceConverter');

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
    var is_new = Product.list.filter(showOnMain).map(convertEURtoUAH);

    self.view('/main/main', {
        products: is_new
    });
}

function view_products_list(categ) {
    var self = this;
    var category = (categ != 'all') ? categ : '%';
    var sort = self.query.sort || 'name'
    var page = (self.query.page || '1').parseInt();
    var perpage = (self.query.number || '12').parseInt();
    

    Product.pagination(page, perpage, sort, category, function (prod, allLength) {
        prod = prod.map(convertEURtoUAH);
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
        product.price = Math.round(convertCurrency(product.price));
        product.discount = Math.round(convertCurrency(product.discount));
    var img = [];
    var available = [];
    var self = this;

    var avl = product.available_in.split(',');
    avl.forEach(function (e) {
        available.push(shops[e]);
    })
    Product.imgs(product_id, function (result) {
        img = result.imgs_arr.filter(galeryImgs).map(ImgOrderNumber) || 0;
        Product.get_by_manufacturer(product.manufacturer, function (from_manufacturer) {
            from_manufacturer = isLongArr(from_manufacturer) ? shuffleAndCut(from_manufacturer) : from_manufacturer;
            Product.pagination(1, 200, "name", product.category, function (see_also_prod, allLength) {
                see_also_prod = isLongArr(see_also_prod) ? shuffleAndCut(see_also_prod) : see_also_prod;
                self.view('/product_card/product-card', {
                    product: product,
                    breadcrumbs: breadcrumbs_mapping[product.category],
                    immages: img,
                    available: available,
                    products_from_manufacturer: from_manufacturer,
                    see_also: see_also_prod
                });
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
        result = result.map(convertEURtoUAH);
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
        result = result.map(convertEURtoUAH);
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
        result = result.map(convertEURtoUAH);
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
        result = result.map(convertEURtoUAH);
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

function favorites_add() {
    var self = this;
    Product.favorites_add(self.body.user_id, self.body.product_id, function (result) {
        self.json(SUCCESS(result));
    });
}

function view_favorites_user(user_id) {
    var self = this;
    var sort = self.query.sort || 'name';
    var page = (self.query.page || '1').parseInt();
    var perpage = (self.query.number || '12').parseInt();

    Product.favorites_by_user_id(user_id, function (result) {
        result = result || [];
        result = result.map(convertEURtoUAH);
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

function shuffleAndCut(arr) {
    arr = shuffle(arr);
    arr.length = 8;
    return arr;
};

function isLongArr(arr) {
    return arr.length > 8;
};

function galeryImgs(image) {
    return image.name.indexOf('Galery') > -1;
};

function ImgOrderNumber(image, i) {
    image.size = i + 1;
    return image;
};

function showOnMain(product) {
    return product.is_new == 1;
}

function convertEURtoUAH(product){
    product.price = Math.round(convertCurrency(product.price));
    product.discount = Math.round(convertCurrency(product.discount));
    return product;
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

function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}