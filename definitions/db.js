/*var mysql = require('mysql');

var pool = mysql.createPool({
    host                : 'localhost',
    user                : 'root',
    password            : 'root',
    database            : 'outlet',
    multipleStatements  :  true
});

F.database = function (callback) {
    return pool.getConnection(callback);
};

F.emit('initdb');*/
var fs = require('fs');

var config = {
    driver: 'msnodesqlv8',
    connectionString: F.config.DEVSQLSERVER
};

var sqlAgent = require('sqlagent/sqlserver').init(config, true);

fs.readFile('./definitions/db_script.sql', 'utf8', function (err, data) {
    if (err) throw err;
    //console.log(data);

    var sql_query = data;

    var sql = DATABASE(null);
    sql.query(sql_query).make(function (builder) { console.log('query data'); });
    sql.exec(function (err, response) {
        console.log('exec data');
        F.emit('initdb');
        //console.log(response.allProducts);
        console.log('initdb!');
    });
});

