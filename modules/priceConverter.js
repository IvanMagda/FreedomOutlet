var fs = require('fs');
var request = require("request")
var curr = require('../definitions/currency.json');
var type = curr['config']['type'];
var https = require('https');
var options = {
    host: 'bank.gov.ua',
    path: 'NBUStatService/v1/statdirectory/exchange?valcode=EUR&json',
    headers: { 'User-Agent': 'request' }
};

function RequestActualData(callback) {
    https.get(options, function (res) {
        var json = '';
        res.on('data', function (chunk) {
            json += chunk;
        });
        res.on('end', function () {
            if (res.statusCode === 200) {
                try {
                    var data = JSON.parse(json);
                    console.log(data);
                    callback(data);
                    // data is available here:
                    //console.log(data.html_url);
                } catch (e) {
                    console.log('Error parsing JSON!');
                }
            } else {
                console.log('Status:', res.statusCode);
            }
        });
    }).on('error', function (err) {
        console.log('Error:', err);
    });
}

function UpdateConverterValues(actualCurrency) {
    fs.readFile(__dirname + '/../definitions/currency.json', 'utf8', function readFileCallback(err, data) {
        if (err) {
            console.log(err);
        } else {
            var currency = JSON.parse(data);
            currency.api.rate = actualCurrency[0].rate;
            json = JSON.stringify(currency);
            fs.writeFile(__dirname + '/../definitions/currency.json', json, 'utf8', function (json) {
                curr = json;
                type = curr['config']['type'];
            });
        }
    });
}

function resetAtMidnight() {
    var now = new Date();
    var night = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() + 1, // the next day, ...
        0, 0, 0 // ...at 00:00:00 hours
    );
    var msToMidnight = night.getTime() - now.getTime();

    console.log("active midnight updater");
    console.log(msToMidnight);

    setTimeout(function () {
        RequestActualData(function (data) {
            UpdateConverterValues(data);   //      <-- This is the function being called at midnight.
        });
        resetAtMidnight();    //      Then, reset again next midnight.
    }, msToMidnight);
}

resetAtMidnight();

var converter = function (value) {
    return value * curr[type]["rate"];
}

module.exports = converter;