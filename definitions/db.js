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

var config = {
    driver: 'msnodesqlv8',
    connectionString: F.config.DEVSQLSERVER
};

var sqlAgent = require('sqlagent/sqlserver').init(config, true);
F.emit('initdb');