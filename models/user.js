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
    var hash = passwordHash.generate(user.pass);
    var sql = DATABASE();

    sql.insert('user', 'users').make(function (builder) {
        builder.set({
            login: user.login,
            password_hash: hash,
            email: user.email,
            created: new Date(),
            role: user.role
        });
    });

    sql.select('new_user', 'users').make(function (builder) {
        builder.where('login', '=', user.login);
    });

    sql.exec(function (err, response) {
        //console.log(response.allUsers);
        console.log('allUsers DB init.');

        response.new_user.forEach(function (e) {
            User.add(e);
        })

        callback(SUCCESS(true));
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

        var sql = DATABASE();
        sql.query('allUsers', 'SELECT * FROM users').make(function (builder) { });
        sql.exec(function (err, response) {
            //console.log(response.allUsers);
            console.log('allUsers DB init.');

            User.list = [];
            User.by_id = {};
            response.allUsers.forEach(function (e) {
                User.add(e);
            })

            console.log('users init complete');
        });
    });
}