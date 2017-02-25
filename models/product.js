var fs = require('fs');

exports.id = 'Outlet';

var Product = NEWSCHEMA('Product');
Product.define('id', Number);
Product.define('name', String);
Product.define('manufacturer', String);
Product.define('price', Number);
Product.define('description', String);
Product.define('image_name', String);
Product.define('is_new', Boolean);
Product.define('title_img_src', String);

Product.add = function (product) {
    var p = Product.make(product);
    Product.list.push(p);
    Product.by_id[p.id] = p;
}

Product.upd = function (product) {
    var p = Product.make(product);
    var index = Product.list.indexOf(Product.by_id[product.id]);
    console.log(product.id);

    if (index > -1) {
        Product.list[index] = p;
        Product.by_id[product.id] = p;
        console.log('updated');
    } else {
        console.log('Update Error!');
    }
}

Product.dell = function (id) {
    var p = Product.by_id[id];
    var index = Product.list.indexOf(p);
    if (index > -1) {
        Product.list.splice(index, 1);
        console.log('removed!')
    }

    delete Product.by_id[p.id];
}

Product.create_new = function (product, files, callback) {
    var sql = DATABASE();
    var productDir = __dirname + '/../public/tmp/' + (Product.list[Product.list.length - 1].id + 1) + '/';

    if (product.is_new == "on") {
        product.is_new = true;
    } else {
        product.is_new = false;
    }

    if (files[0]) {
        product.image_name = files[0].filename;
        product.title_img_src = '/../public/tmp/' + (Product.list[Product.list.length - 1].id + 1) + '/' + files[0].filename;
    } else {
        console.log('Title img not selected!');
    };

    sql.insert('product_inserted', 'products').make(function (builder) {
        builder.set({
            name: product.name,
            manufacturer: product.manufacturer,
            price: product.price,
            description: product.description,
            image_name: product.image_name,
            is_new: product.is_new,
            title_img_src: product.title_img_src
        });
    });

    sql.exec(function (err, response) {
        if (err) throw err;
        sql.select('new_product', 'products').make(function (builder) {
            builder.where('id', '=', response.product_inserted.identity);
        });
        sql.exec(function (err, response) {
            if (err) throw err;
            console.log(response);
            fs.readFile(files[0].path, function (err, data) {
                if (err) throw err;
                fs.mkdir(productDir, function (err) {
                    fs.writeFile(productDir + files[0].filename, data, function (err) {
                        if (err) throw err;
                        console.log('Title img saved!');
                        Product.add(response.new_product[0]);
                        callback(SUCCESS(true));
                    });
                });
            });

        });
    });
}

Product.update = function (product, callback) {
    console.log('product update to db', product);
    var sql = DATABASE();

    sql.update('product_update', 'products').make(function (builder) {
        builder.set({
            name: product.name,
            manufacturer: product.manufacturer,
            price: product.price,
            description: product.description,
            image_name: product.image_name,
            is_new: product.is_new,
            title_img_src: product.title_img_src
        });
        builder.where('id', product.id);
    });
    sql.exec(function (err, response) {
        console.log(response.product_update)
        Product.upd(product);
        callback(SUCCESS(true));
    });
}

Product.delete_p = function (product_id, callback) {
    console.log('delete product from db', product_id);
    var sql = DATABASE();

    sql.remove('deleted', 'products').make(function (builder) {
        builder.where('id', product_id);
    });
    sql.exec(function (err, response) {
        console.log(response.deleted)
        Product.dell(product_id);
        callback(SUCCESS(true));
        console.log('product remove complete')
    });
}

exports.install = function () {
    F.on('initdb', function () {
        var sql = DATABASE();
        sql.query('allProducts', 'SELECT * FROM products').make(function (builder) { });
        sql.exec(function (err, response) {
            console.log('Outlet DB init.');

            Product.list = [];
            Product.by_id = {};
            response.allProducts.forEach(function (e) {
                Product.add(e);
            })

            console.log('products init complete')
        });
    })
};