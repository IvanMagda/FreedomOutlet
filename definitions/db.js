var mysql = require('mysql');

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

F.emit('initdb');