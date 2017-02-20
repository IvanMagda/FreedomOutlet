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
    if (index > -1) {
        Product.list[index]=p;
        console.log('updated');
    }

    Product.by_id[product.id] = p;
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

Product.create_new = function (product, callback) {
    console.log('create product add to db', product);

    var sql = DATABASE();

    sql.insert('product_inserted', 'products').make(function (builder) {
        builder.set({
            name: product.name,
            manufacturer: product.manufacturer,
            price: product.price,
            description: product.description
        });
    });

    sql.query('new_product', 'SELECT * FROM products ORDER BY id DESC LIMIT 1').make(function (builder) { });
    sql.exec(function (err, response) {
        console.log(response.new_product);

        Product.add(response.new_product);

        callback(SUCCESS(true));
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
            description: product.description
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
        sql.query('allProducts', 'SELECT * FROM products').make(function (builder) {});
        sql.exec(function (err, response) {
            console.log(response.allProducts);
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