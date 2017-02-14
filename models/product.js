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

Product.dell = function (id) {
    var p = Product.by_id[id];
    console.log(p);

    var index = Product.list.indexOf(p);
    console.log(index);

    if (index > -1) {
        Product.list.splice(index, 1);
        console.log('removed!')
    }

    delete Product.by_id[p.id];
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

Product.delete_p = function (product_id, callback) {
    console.log('delete product from db', product_id);



    DATABASE(function (err, connection) {
        if (err != null) {
            console.log(err);
            return;
        }

        connection.query('DELETE FROM products WHERE id=?', [product_id], function (err) {

            if (err != null) {
                console.log(err);
                return;
            }

            Product.dell(product_id);

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