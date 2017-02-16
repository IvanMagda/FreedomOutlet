var fs = require('fs');

/*var config = {
    driver: 'msnodesqlv8',
    connectionString: F.config.DEVSQLSERVER

};*/

var config = {
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'outlet',
    multipleStatements: true
};

var sqlAgent = require('sqlagent/mysql').init(config, true);

fs.readFile('./definitions/mysql_sript.txt', 'utf8', function (err, data) {
    if (err) throw err;

    var sql_query = data;
    var sql = DATABASE();

    sql.query(sql_query);
    sql.exec(function (err, response) {
        console.log('exec data');
        F.emit('initdb');
        console.log('initdb!');
    });
});