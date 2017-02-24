var fs = require('fs');

var config;

switch (F.config.DBPROVIDER) {
    case "mysql":
        config = {
            host: 'localhost',
            user: 'root',
            password: 'root',
            database: 'outlet',
            multipleStatements: true
        };
        break;
    case "sqlserver":
        config = {
            driver: 'msnodesqlv8',
            connectionString: F.config.DEVSQLSERVER

        };
        break;
    default:
        throw "Provider not supported";
}

var sqlAgent = require('sqlagent/' + F.config.DBPROVIDER).init(config, true);

fs.readFile('./definitions/dbinit_' + F.config.DBPROVIDER + '.txt', 'utf8', function (err, data) {
    if (err) throw err;

    var sql_query = data;
    var sql = DATABASE();

    sql.query("init", sql_query).make(function (builder) { });
    sql.exec(function (err, response) {
        console.log('exec data');
        F.emit('initdb');
        console.log('initdb!');
    });
});