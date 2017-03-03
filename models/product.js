﻿var fs = require('fs');

exports.id = 'Outlet';

var Product = NEWSCHEMA('Product');
Product.define('id', Number);
Product.define('name', String);
Product.define('manufacturer', String);
Product.define('manufacturer_country', String);
Product.define('series', String);
Product.define('dimensions', String);
Product.define('price', Number);
Product.define('discount', Number);
Product.define('description', String);
Product.define('category', String);
Product.define('image_name', String);
Product.define('is_new', Boolean);
Product.define('title_img_src', String);
Product.define('virtual_model_src', String);
Product.define('available_in', String);

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
    console.log(product);
    console.log(product.available_in);

    files.forEach(function (e) {
        console.log(e)
    })

    var last_id;
    if (Product.list && Product.list[Product.list.length - 1]) {
        last_id = Product.list[Product.list.length - 1].id;
    } else {
        last_id = 0;
    }


    var sql = DATABASE();
    var productDir = __dirname + '/../public/tmp/' + (last_id + 1) + '/';

    if (product.is_new == "on") {
        product.is_new = true;
    } else {
        product.is_new = false;
    }

    if (files[0].name == 'title_file') {
        product.image_name = 'Title.';
        product.image_name += files[0].filename.split('.')[1];
        product.title_img_src = '/tmp/' + (last_id + 1) + '/' + product.image_name;
    } else {
        console.log('Title img not selected!');
    };

    files.forEach(function (e) {
        if (e.name == 'virtual_model') {
            product.virtual_model_src = '/tmp/' + (last_id + 1) + '/' + e.filename;
        }
    })

    sql.insert('product_inserted', 'products').make(function (builder) {
        builder.set({
            name: product.name,
            manufacturer: product.manufacturer,
            manufacturer_country: product.manufacturer_country,
            series: product.series,
            dimensions: product.dimensions,
            price: product.price,
            discount: product.discount,
            description: product.description,
            category: product.category,
            image_name: product.image_name,
            is_new: product.is_new,
            title_img_src: product.title_img_src,
            virtual_model_src: product.virtual_model_src,
            available_in: product.available_in.toString()
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
                    fs.writeFile(productDir + product.image_name, data, function (err) {
                        if (err) throw err;
                        console.log('Title img saved!');
                        files.forEach(function (element, index) {
                            if (index != 0 || element.name != 'virtual_model') {
                                var galery = 'Galery' + index + '.';
                                galery += element.filename.split('.')[1];
                                fs.readFile(element.path, function (err, data) {
                                    if (err) throw err;

                                    fs.writeFile(productDir + galery, data, function (err) {
                                        if (err) throw err;
                                        console.log('Galery img saved!');
                                    });
                                });
                            }

                            if (element.name == 'virtual_model') {
                                fs.readFile(element.path, function (err, data) {
                                    if (err) throw err;

                                    fs.writeFile(productDir + element.filename, data, function (err) {
                                        if (err) throw err;
                                        console.log('3D saved!');
                                    });
                                });
                            }
                        })
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

Product.delete_img = function (img_src, callback) {
    img_src = __dirname + img_src.replace("http://localhost:8000/", "\\").replace("/", "\\"); //associate with local dir
    img_src = img_src.replace("models", "public") //set outer dir for imsges
    console.log(img_src);

    fs.unlink(img_src, function (err) {
        if (err) throw err;

        callback(SUCCESS(true));
        console.log('successfully deleted' + img_src);
    });
}

Product.imgs = function (id, callback) {

    var index = 0;
    var imgs_arr = [];


    fs.readdir(__dirname + '/../public/tmp/' + id, function (err, files) {

        files.forEach(function (file) {
            var img = {
                name: "appended_file.jpg",
                size: 5453,
                type: "image/jpg",
                file: "/tmp/Products.jpg",
            };
            console.log('file in dir');
            console.log(file);
            var tmp = file.split('.');
            var type = tmp[tmp.length - 1];

            img.name = file;
            img.type = "image/" + type;
            img.file = "/tmp/" + id + "/" + file;

            console.log(img);

            imgs_arr[index] = img;
            index++;
        });
        console.log(imgs_arr);
        callback(imgs_arr);
    });

    //console.log(imgs_arr);
}

Product.pagination = function (page, items, sort, category, callback) {
    var sql = DATABASE();
    sql.select('prod', 'products').make(function (builder) {
        builder.where('category', category);
        builder.order(sort);
        builder.page(page, items);
    });
    sql.exec(function (err, response) {
        var list = [];

        if (response.prod) {
            response.prod.forEach(function (e) {
                var p = Product.make(e);
                list.push(p);
            })
        }

        callback(list);
    });
}

exports.install = function () {
    F.on('initdb', function () {


        //fs.readdir(__dirname + '/../public/tmp/', (err, files) => {
        //    files.forEach(file => {
        //        console.log(file);
        //    });
        //})


        var sql = DATABASE();
        sql.query('allProducts', 'SELECT * FROM products ORDER BY id').make(function (builder) { });
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