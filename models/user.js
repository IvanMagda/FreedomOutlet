var passwordHash = require('password-hash');

var User = NEWSCHEMA('User');
User.define('id', Number);
User.define('password_hash', String);
User.define('email', String);
User.define('created', Date);
User.define('role', String);

User.register = function (user, callback) {
    console.log('create user add to db', user);

    DATABASE(function (err, connection) {
        if (err != null) {
            console.log(err);
            return;
        }

        connection.query('INSERT INTO users (login, password_hash, email, role) VALUES (?, ?, ?, ?)', [user.login, passwordHash.generate(user.pass), user.email, user.role], function (err, rows) {

            if (err != null) {
                console.log(err);
                return;
            }

            callback(SUCCESS(true));
        });
    });
}

exports.install = function () {
    F.on('initdb', function () {

        DATABASE(function (err, connection) {
            console.log('Outlet user init.');

            if (err != null) {
                console.log(err);
                return;
            }

            connection.query('SELECT * FROM users', function (err, rows) {
                connection.release();

                if (err != null) {
                    console.log(err);
                    return;
                }

                User.list = [];
                User.by_id = {};
                rows.forEach(function (e) {
                    var u = User.make(e);
                    User.list.push(u);
                    User.by_id[u.id] = u;
                })
                console.log('users init complete');
            });
        });
    });
}