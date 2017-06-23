var fs = require('fs');

var changeSetting = function (admin_rate, type, callback) {
    fs.readFile(__dirname + '/../definitions/currency.json', 'utf8', function readFileCallback(err, data) {
        if (err) {
            console.log(err);
        } else {
            var currency = JSON.parse(data);
            currency.admin.rate = admin_rate;
            currency.config.type = type;
            json = JSON.stringify(currency);
            fs.writeFile(__dirname + '/../definitions/currency.json', json, 'utf8', callback);
        }
    });
};

var getActualCurrency = function(callback){
        fs.readFile(__dirname + '/../definitions/currency.json', 'utf8', function readFileCallback(err, data) {
        if (err) {
            console.log(err);
        } else {
            var currency = JSON.parse(data);
            var actualData = {};

            actualData.admin_rate = currency.admin.rate;
            actualData.type = currency.config.type;
            actualData.api_rate = currency.api.rate;
            callback(actualData);
        }
    });
};

module.exports.changeSetting = changeSetting;
module.exports.getActualCurrency = getActualCurrency;