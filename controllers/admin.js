var Product = GETSCHEMA('Product');
var User = GETSCHEMA('User');
var fs = require('fs');
var os = require('os');
var adminConv = require('../modules/adminPriceConverterSettings');
var shopsEditor = require('../modules/shopsEditor');
var imgSaver = require('../modules/imgSaver');
var shops = require('../definitions/shops.json');

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
    F.route('/admin/search/{search_text}', view_admin_search, ['get', 'authorize', '@admin']);
    F.route('/admin/currency', view_admin_currency, ['authorize', '@admin']);
    F.route('/admin/currency', admin_currency_save, ['post', 'authorize', '@admin']);
    F.route('/admin/shops', view_admin_shops, ['authorize', '@admin']);
    F.route('/admin/shops', admin_shops_save, ['post', 'authorize', '@admin']);
    F.route('/admin/img_edit', view_admin_img_edit, ['authorize', '@admin']);
    F.route('/admin/img_edit', admin_img_edit_save, ['upload', 'authorize', '@admin'], { flags: ['upload'], length: 25 * 1024 * 1024, timeout: 30 * 60 * 1000 });
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
    var shops_data = Object.keys(shops).map(getShopInfo).filter(removeEmptyShops).map(splitter);
    self.view('/admin/product_add', {
        shops_data: shops_data
    });
}

function product_create() {
    var self = this;
    Product.create_new(self.body, self.files, function (result) {
        self.redirect('/');
    });
}

function view_product_update(product_id) {
    var self = this;
    var product = Product.by_id[product_id];
    var immages = [];
    var shops_data = Object.keys(shops).map(getShopInfo).filter(removeEmptyShops).map(splitter);    
    Product.imgs(product_id, function (result) {
        immages = JSON.stringify(result.imgs_arr);
        self.view('/admin/product_edit', {
            product: product,
            immages: immages,
            cities: result.cities,
            shops_data: shops_data
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

    Product.pagination_admin(page, perpage, sort, category, function (prod, allLength) {
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
    adminConv.changeSetting(self.body.admin_rate, self.body.type, function () {
        self.redirect('/admin');
    });
};

function view_admin_shops() {
    var self = this;
    shopsEditor.readShops(function (shops) {
        self.view('/admin/shops', {
            shops: shops
        });
    });
}

function admin_shops_save() {
    var self = this;
    console.log(self.body);
    shopsEditor.editShops(self.body, function () {
        self.redirect('/admin');
    });
}

function view_admin_img_edit() {
    var self = this;
    self.view('/admin/img_edit');
}

function admin_img_edit_save() {
    var self = this;
    console.log(self.files);
    imgSaver.saveImg(self.files, function () {
        self.redirect('/admin');
    });
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

function getShopInfo(currentValue, index, array) {
    var cityMap = { Kyiv: 'Киев', Kharkiv: 'Харьков', Dnepr: 'Днепр' }
    var editedShop = { shop_id: '', name: '', city: '', split: false };
    editedShop.shop_id = currentValue;
    editedShop.name = shops[currentValue].split(os.EOL).slice(0, 1);
    editedShop.city = editedShop.shop_id.replace(/[0-9]/g, '');
    editedShop.city = editedShop.city[0].toUpperCase() + editedShop.city.slice(1);
    if (editedShop.city == 'Kyiv' && editedShop.name.toString().indexOf('HOUSE') !== -1) {
        if (shops[currentValue].indexOf(101) !== -1){
            editedShop.name = editedShop.name + ' 101';
        }else if (shops[currentValue].indexOf(17) !== -1){
            editedShop.name = editedShop.name + ' 17/2';
        }
    }

    editedShop.city = cityMap[editedShop.city];
    return editedShop;
}

function splitter(currentValue, index, array) {
    if(index>0 && index<array.length-1 && currentValue.city != array[index+1].city){
        currentValue.split = true;
    }

    return currentValue;
}

function removeEmptyShops(shop) {
    return shop.name != '';
}

/*{
    "kyiv1": "FREEDOM LUXURY HOME\r\nСтоличное шоссе, 101\r\nТЦ \"Домосфера\", 1 этаж\r\n+38 067 468 29 09\r\n+38 044 259 31 10\r\n\r\n",
    "kyiv2": "Visionnaire Showroom\r\nСтоличное шоссе, 101 \r\nТЦ \"Домосфера\", 1 этаж\r\n+38 067 571 85 90\r\n+38 044 259 31 10\r\n\r\n",
    "kyiv3": "FREEDOM HOUSE \r\nСтоличное шоссе, 101\r\nТЦ \"Домосфера\", 2 этаж \r\n+38 067 329 08 48\r\n\r\n",
    "kyiv4": "FREEDOM INTERIORS\r\nул. Драгомирова, 20\r\n+38 067 325 41 90",
    "kyiv5": "",
    "kyiv6": "FREEDOM INTERIOR\r\nпр. Победы, 7\r\n+38 044 238 01 81\r\n+38 067 325 41 80\r\n\r\n",
    "kyiv7": "FREEDOM HOUSE \r\nДнепровская наб., 17 д/2 \r\n(напротив яхт-клуба)\r\n+38 067 328 98 04\r\n\r\n",
    "kyiv8": "FREEDOM \r\nсантехника   плитка   двери\r\n\r\nДнепровская наб., 14 \r\nЖК River Stone \r\n+38 067 329 08 46",
    "kyiv9": "",
    "kyiv10": "",
    "kharkiv1": "FREEDOM LUXURY\r\nул. 23 Августа, 29\r\n+38 057 751 92 29\r\n+38 067 325 41 91\r\n\r\n",
    "kharkiv2": "FREEDOM\r\nул. Веснина, 5\r\nкухни   мебель   свет: 1 этаж \r\n+38 057 757 44 00 \r\n+38 067 571 75 66\r\n\r\nсантехника   плитка   двери:  2 этаж\r\n+38 057 751 92 28 \r\n+38 067 572 54 32\r\n\r\n",
    "kharkiv3": "DOMITALIA\r\nпр. Московский, 257\r\n+38 057 758 79 97\r\n+38 067 539 18 53",
    "kharkiv4": "",
    "kharkiv5": "",
    "dnepr1": "FREEDOM ГАЛЕРЕЯ ИНТЕРЬЕРОВ\r\nпр. Гагарина, 18\r\nкухни   мебель   свет \r\n+38 056 713 55 15 \r\n+38 067 560 06 82\r\n\r\nсантехника   плитка   двери\r\n+38 067 974 41 05",
    "dnepr2": "",
    "dnepr3": "",
    "dnepr4": "",
    "dnepr5": ""
}*/