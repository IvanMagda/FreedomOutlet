var fs = require('fs');

var saveImg = function (imgList, callback) {
    imgList.map(function (img) {
        fs.readFile(img.path, function (err, data) {
            fs.writeFile(__dirname + '/../public/img/categories/' + img.name + '.png', data, function (err) {
                if (err) throw err;
                console.log('Main page img ' + img.name + ' saved!');
                
            });
        });
    });

    callback();
};

module.exports.saveImg = saveImg;