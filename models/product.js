var fs = require('fs');

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
Product.define('is_hidden', Boolean);
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
    product.price = product.price || 0;
    product.discount = product.discount || 0;
    product.available_in = product.available_in || '';
    product.is_new = (product.is_new == "on") ? true : false;
    product.is_hidden = (product.is_hidden == "on") ? true : false;

    var last_id = 0;
    if (Product.list && Product.list[Product.list.length - 1]) {
        last_id = Product.list[Product.list.length - 1].id;
    }

    var sql = DATABASE();
    var productDir = __dirname + '/../public/tmp/' + (last_id + 1) + '/';

    if (product.title_file) {
        product.title_img_src = '/tmp/' + (last_id + 1) + '/' + 'Title.jpg';
    }

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
            image_name: 'Title.jpg',
            is_new: product.is_new,
            is_hidden: product.is_hidden,
            title_img_src: product.title_img_src,
            virtual_model_src: product.virtual_model_src,
            available_in: product.available_in
        });
    });

    sql.exec(function (err, response) {
        if (err) throw err;
        sql.select('new_product', 'products').make(function (builder) {
            builder.where('id', '=', response.product_inserted.identity);
        });
        sql.exec(function (err, response) {
            if (err) throw err;
            var buffer = new Buffer(product.title_file.split(",")[1], 'base64');
            console.log(buffer);
            fs.mkdir(productDir, function (err) {
                fs.writeFile(productDir + 'Title.jpg', buffer, function (err) {
                    if (err) throw err;
                    console.log('Title img saved!');
                    files.forEach(function (element, index) {
                        if (element.name != 'virtual_model') {
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
}

Product.update = function (product, files, callback) {
    product.price = product.price || 0;
    product.discount = product.discount || 0;
    product.available_in = product.available_in || '';
    product.is_new = (product.is_new == "on") ? true : false;
    product.is_hidden = (product.is_hidden == "on") ? true : false;

    var productDir = __dirname + '/../public/tmp/' + product.id + '/';

    if (product.title_file) {
        fs.unlinkSync(productDir + 'Title.jpg');
        product.title_img_src = '/tmp/' + product.id + '/' + 'Title.jpg';
        var buffer = new Buffer(product.title_file.split(",")[1], 'base64');
        fs.writeFile(productDir + 'Title.jpg', buffer, function (err) {
            if (err) throw err;
            console.log('Title img saved!');
        });
    }

    console.log('product update to db', product);
    var sql = DATABASE();

    sql.update('product_update', 'products').make(function (builder) {
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
            image_name: 'Title.jpg',
            is_new: product.is_new,
            is_hidden: product.is_hidden,
            title_img_src: product.title_img_src,
            virtual_model_src: product.virtual_model_src,
            available_in: product.available_in.toString()
        });
        builder.where('id', product.id);
    });
    sql.exec(function (err, response) {
        var galery = [];
        var galery_num;
        fs.readdir(productDir, function (err, files) {
            files.forEach(function (file) {
                if (file.indexOf('Galery') > -1)
                    galery.push(file.replace('Galery', '').split('.')[0]);
            });

            galery_num = parseInt(galery.sort(compareNumbers)[galery.length - 1]) || 0;

            function compareNumbers(a, b) {
                return a - b;
            }
        });

        files.forEach(function (element, index) {
        if (element.name == 'virtual_model') {
                fs.readFile(element.path, function (err, data) {
                    if (err) throw err;

                    fs.writeFile(productDir + element.filename, data, function (err) {
                        if (err) throw err;
                        console.log('3D saved!');
                    });
                });
            } else {
                fs.readFile(element.path, function (err, data) {
                    if (err) throw err;
                    var num = galery_num + index + 1;
                    var gal = 'Galery' + num + '.';
                    gal += element.filename.split('.')[1];

                    fs.writeFile(productDir + gal, data, function (err) {
                        if (err) throw err;
                        console.log('Galery img saved!');
                    });
                });
            }
        });
        sql.select('prod', 'products').make(function (builder) {
            builder.where('id', '=', product.id);
        });
        sql.exec(function (err, response) {
            Product.upd(response.prod[0]);
            callback(SUCCESS(true));
        });
    });
}

Product.delete_p = function (product_id, callback) {
    console.log('delete product from db', product_id);
    var sql = DATABASE();
    var deleteFolderRecursive = function (path) {
        if (fs.existsSync(path)) {
            fs.readdirSync(path).forEach(function (file, index) {
                var curPath = path + "/" + file;
                if (fs.lstatSync(curPath).isDirectory()) { // recurse
                    deleteFolderRecursive(curPath);
                } else { // delete file
                    fs.unlinkSync(curPath);
                }
            });
            fs.rmdirSync(path);
        }
    };

    sql.remove('deleted', 'products').make(function (builder) {
        builder.where('id', product_id);
    });
    sql.exec(function (err, response) {
        Product.dell(product_id);
        deleteFolderRecursive(__dirname + '/../public/tmp/' + product_id);
        callback(SUCCESS(true));
        console.log('product remove complete')
    });
}

Product.delete_img = function (img_src, callback) {
    var img_file = __dirname + img_src; //.split("/").join("\\"); //associate with local dir
    img_file = img_file.replace("models", "public") //set outer dir for imsges

    fs.unlink(img_file, function (err) {
        if (err) throw err;

        callback(SUCCESS(true));
        console.log('successfully deleted' + img_file);
    });
}

Product.imgs = function (id, callback) {
    var response = {};
    response.imgs_arr = [];
    response.cities = {};

    fs.readdir(__dirname + '/../public/tmp/' + id, function (err, files) {

        if (files) {
            files.forEach(function (file, index) {
                var img = {
                    name: "appended_file.jpg",
                    size: 5453,
                    type: "image/jpg",
                    file: "/tmp/Products.jpg",
                };
                var tmp = file.split('.');
                var type = tmp[tmp.length - 1];

                img.name = file;
                img.type = "image/" + type;
                img.file = "/tmp/" + id + "/" + file;
		if (img.name.indexOf("Galery") != -1) {
                response.imgs_arr[index] = img;
		}
            });
        }

        Product.by_id[id].available_in.split(',').forEach(function (e) {
            response.cities[e] = true;
        });

        callback(response);
    });
}

Product.pagination = function (page, items, sort, category, callback) {
    var sql = DATABASE();
    sql.select('prod', 'products').make(function (builder) {
        builder.like('category', '%' + category + '%');
        builder.where('is_hidden', 0);
        builder.order(sort);
        builder.page(page, items);
    });
    sql.select('allCategory', 'products').make(function (builder) {
        builder.like('category', '%' + category + '%');
        builder.where('is_hidden', 0);
    });
    sql.exec(function (err, response) {
        var list = [];
        var allLength = response.allCategory.length;

        if (response.prod) {
            response.prod.forEach(function (e) {
                var p = Product.make(e);
                list.push(p);
            })
        }

        callback(list, allLength);
    });
}

Product.pagination_admin = function (page, items, sort, category, callback) {
    var sql = DATABASE();
    sql.select('prod', 'products').make(function (builder) {
        builder.like('category', '%' + category + '%');
        builder.order(sort);
        builder.page(page, items);
    });
    sql.select('allCategory', 'products').make(function (builder) {
        builder.like('category', '%' + category + '%');
    });
    sql.exec(function (err, response) {
        var list = [];
        var allLength = response.allCategory.length;

        if (response.prod) {
            response.prod.forEach(function (e) {
                var p = Product.make(e);
                list.push(p);
            })
        }

        callback(list, allLength);
    });
}

Product.search = function (search_text, limit, sort, callback) {
    var sql = DATABASE();
    sql.select('search_result', 'products').make(function (builder) {
        builder.like('name', search_text + '%');
        builder.or();
        builder.like('name', '%' + search_text);
        builder.or();
        builder.like('manufacturer', search_text + '%');
        builder.or();
        builder.like('manufacturer', '%' + search_text);
        builder.or();
        builder.like('category', search_text + '%');
        builder.or();
        builder.like('category', '%' + search_text);
        builder.or();
        builder.like('description', search_text + '%');
        builder.or();
        builder.like('description', '%' + search_text);
        builder.where('is_hidden', 0);
        if (sort != "") {
            builder.order(sort);
        }
        if (limit > 0) {
            builder.take(limit);
        }
    });
    sql.exec(function (err, response) {
        callback(response.search_result);
    });
}

Product.get_by_manufacturer = function (manufacturer, callback) {
    var sql = DATABASE();
    sql.select('search_result', 'products').make(function (builder) {
        builder.where('manufacturer', manufacturer);
        builder.where('is_hidden', 0);
    });
    sql.exec(function (err, response) {
        callback(response.search_result);
    });
};

Product.favorites_by_product_id = function (product_id, callback) {
    var sql = DATABASE();
    sql.select('favorites', 'products').make(function (builder) {
        builder.query('id in (' + product_id + ')');
    });
    sql.exec(function (err, response) {
        callback(response.favorites);
    });
}

Product.favorites_add = function (user_id, product_id, callback) {
    var sql = DATABASE();
    sql.insert('favorite_added', 'favorites').make(function (builder) {
        builder.set('user_id', user_id);
        builder.set('favorite_id', product_id);
    });
    sql.exec(function (err, response) {
        callback(SUCCESS(true));
    });
}

Product.favorites_delete = function (user_id, product_id, callback) {
    var sql = DATABASE();
    sql.query("DELETE FROM favorites WHERE user_id=" + user_id + " AND favorite_id=" + product_id);
    sql.exec(function (err, response) {
        callback(SUCCESS(true));
    });
}

Product.favorites_by_user_id = function (user_id, callback) {
    var sql = DATABASE();
    var favorite_products = [];
    sql.select('user_favor', 'favorites').make(function (builder) {
        builder.where('user_id', user_id);
    });
    sql.exec(function (err, response) {
        response.user_favor.forEach(function (e) {
            favorite_products.push(e.favorite_id);
        })
        Product.favorites_by_product_id(favorite_products, function (result) {
            callback(result);
        });
    });
}

Product.favorites_list = function (user_id, callback) {
    var sql = DATABASE();
    var favorite_products = [];
    sql.select('user_favor', 'favorites').make(function (builder) {
        builder.where('user_id', user_id);
    });
    sql.exec(function (err, response) {
        if (Object.keys(response).length !== 0 && response.constructor === Object) {
            response.user_favor.forEach(function (e) {
                favorite_products.push(e.favorite_id);
            });
        };
        callback(favorite_products);
    });
}

exports.install = function () {
    F.on('initdb', function () {
        var sql = DATABASE();
        sql.query('allProducts', 'SELECT * FROM products').make(function (builder) {
            builder.order('id');
        });
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