exports.id = 'Outlet';

var Product = NEWSCHEMA('Product');
Product.define('id', Number);
Product.define('name', String);
Product.define('manufacturer', String);
Product.define('price', Number);
Product.define('description', String);

exports.install = function () {
    F.on('initdb', function () {
        
        // create a DB connection
        DATABASE(function (err, connection) {
            console.log('Outlet DB init.');

            if (err != null) {
                console.log(err);
                //self.throw500(err);
                return;
            }

            connection.query('SELECT * FROM products', function (err, rows) {
                connection.release();

                if (err != null) {
                    console.log(err);
                    //self.view500(err);
                    return;
                }

                Product.list = [];
                Product.by_id = {};
                rows.forEach(function (e) {
                    var p = Product.make(e);
                    Product.list.push(p);
                    Product.by_id[p.id] = p;
                })


                //console.log(Product.list[0]);
                console.log('products init complete');
            });
        });
    })
};