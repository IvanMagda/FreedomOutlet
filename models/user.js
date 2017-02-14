var passwordHash = require('password-hash');

var User = NEWSCHEMA('User');
User.define('id', Number);
User.define('login', String);
User.define('password_hash', String);
User.define('email', String);
User.define('created', Date);
User.define('role', String);
User.addOperation('checkpassword', checkPassword);

User.add = function (user) {
    var u = User.make(user);
    User.list.push(u);
    User.by_id[u.id] = u;
}

User.register = function (user, callback) {
    console.log('create user add to db', user);

    DATABASE(function (err, connection) {
        if (err != null) {
            console.log(err);
            return;
        }
        var hash = passwordHash.generate(user.pass);
        connection.query('INSERT INTO users (login, password_hash, email, role) VALUES (?, ?, ?, ?); SELECT * FROM users WHERE login=?', [user.login, hash, user.email, user.role, user.login], function (err, result) {

            if (err != null) {
                console.log(err);
                return;
            }

            result[1].forEach(function (e) {
                User.add(e);
            })

            callback(SUCCESS(true));
        });
    });
}

User.setQuery(function (err, options, callback) {
    var user = null;
    User.list.forEach(function (e) {
        if (e.login === options.login) {
            user = e;
            return true;
        };
    });
    callback(user);
});

function checkPassword(err, user, pass, callback) {
    callback(passwordHash.verify(pass, user.password_hash));
};

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
                    User.add(e);
                })
                console.log('users init complete');
            });
        });
    });
}