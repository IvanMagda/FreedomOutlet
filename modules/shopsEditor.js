var fs = require('fs');

var editShops = function (newData, callback) {
    json = JSON.stringify(newData);
    fs.writeFile(__dirname + '/../definitions/shops.json', json, 'utf8', callback);
};

var readShops = function (callback) {
    fs.readFile(__dirname + '/../definitions/shops.json', 'utf8', function readFileCallback(err, data) {
        if (err) {
            console.log(err);
        } else {
            var shops = JSON.parse(data);
            callback(shops);
        }
    });
};

module.exports.editShops = editShops;
module.exports.readShops = readShops;