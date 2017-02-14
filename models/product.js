exports.id = 'Outlet';

var Product = NEWSCHEMA('Product');
Product.define('id', Number);
Product.define('name', String);
Product.define('manufacturer', String);
Product.define('price', Number);
Product.define('description', String);

Product.add = function (product) {
    var p = Product.make(product);
    Product.list.push(p);
    Product.by_id[p.id] = p;
}

Product.create_new = function (product, callback) {
    console.log('create product add to db', product);

    DATABASE(function (err, connection) {
        if (err != null) {
            console.log(err);
            return;
        }

        connection.query('INSERT INTO products (name, manufacturer, price, description) VALUES (?, ?, ?, ?); SELECT * FROM products ORDER BY id DESC LIMIT 1', [product.name, product.manufacturer, product.price, product.description], function (err, result) {

            if (err != null) {
                console.log(err);
                return;
            }

            result[1].forEach(function (e) {
                Product.add(e);
            })

            callback(SUCCESS(true));
        });
    });
}

exports.install = function () {
    F.on('initdb', function () {
        
        DATABASE(function (err, connection) {
            console.log('Outlet DB init.');

            if (err != null) {
                console.log(err);
                return;
            }

            connection.query('SELECT * FROM products', function (err, rows) {
                connection.release();

                if (err != null) {
                    console.log(err);
                    return;
                }

                Product.list = [];
                Product.by_id = {};
                rows.forEach(function (e) {
                    Product.add(e);
                })

                console.log('products init complete');
            });
        });
    })
};