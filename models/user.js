var passwordHash = require('password-hash');

var User = NEWSCHEMA('User');
User.define('id', Number);
User.define('login', String);
User.define('password_hash', String);
User.define('email', String);
User.define('created', Date);
User.define('role', String);
User.define('auto_login', Boolean);
User.addOperation('checkpassword', checkPassword);

var Reset_pass = NEWSCHEMA('Reset_pass');
Reset_pass.define('user_id', Number);
Reset_pass.define('temp_pass', String);
Reset_pass.define('password_hash', String);
Reset_pass.define('expiration', Date);
Reset_pass.addOperation('checkpasswordreset', checkPassReset);

Reset_pass.add = function (reset) {
    var r = Reset_pass.make(reset);
    Reset_pass.by_user_id[r.user_id] = r;
}

User.add = function (user) {
    var u = User.make(user);
    User.list.push(u);
    User.by_id[u.id] = u;
}

User.upd = function (user) {
    var u = User.make(user);
    var index = User.list.indexOf(User.by_id[user.id]);

    if (index > -1) {
        User.list[index] = u;
        User.by_id[user.id] = u;
        console.log('updated');
    } else {
        console.log('Update Error!');
    }
}

User.register = function (user, callback) {
    console.log('create user add to db', user);
    var hash = passwordHash.generate(user.pass);
    var sql = DATABASE();

    if (user.auto_login == "on") {
        user.auto_login = true;
    } else {
        user.auto_login = false;
    }

    sql.insert('user', 'users').make(function (builder) {
        builder.set({
            login: user.login,
            password_hash: hash,
            email: user.email,
            created: new Date(),
            role: user.role,
            auto_login: user.auto_login
        });
    });



    sql.exec(function (err, response) {
        sql.select('new_user', 'users').make(function (builder) {
            builder.where('id', response.user.identity);
        });

        sql.exec(function (err, response) {
            User.add(response.new_user[0]);
            callback(response.new_user[0]);
        });
    });
}

User.update = function (user, callback) {

    if (user.auto_login == "on") {
        user.auto_login = true;
    } else {
        user.auto_login = false;
    }

    var sql = DATABASE();

    sql.update('user_update', 'users').make(function (builder) {
        builder.set({
            login: user.login,
            password_hash: user.hash,
            email: user.email,
            created: user.created,
            role: user.role,
            auto_login: user.auto_login
        });
        builder.where('id', user.id);
    });
    sql.exec(function (err, response) {
        sql.select('use', 'users').make(function (builder) {
            builder.where('id', '=', user.id);
        });
        sql.exec(function (err, response) {
            User.upd(response.use[0]);
            callback(SUCCESS(true));
        });
    });
}

User.get_by_email = function (user_mail, callback) {
    var sql = DATABASE();
    sql.select('current_user', 'users').make(function (builder) {
        builder.where('email', '=', user_mail);
    });
    sql.exec(function (err, response) {
        callback(response.current_user);
    });
}

User.generate_new_pass = function (mail, callback) {
    var temp_pass = getRandomInt(1000, 10000);
    var date = new Date();
    date.setDate(date.getDate() + 1); //add 1 day
    var temp_pass_hash = passwordHash.generate(temp_pass + "");

    User.get_by_email(mail, function (user) {
        var reset = {};
        reset.user_id = user[0].id;
        reset.temp_pass = temp_pass;
        reset.password_hash = temp_pass_hash;
        reset.expiration = date;
        Reset_pass.add(reset);
        callback(reset);
    })
}

User.setQuery(function (err, options, callback) {
    var user = null;
    User.list.forEach(function (e) {
        if (e.email === options.email) {
            user = e;
            return true;
        };
    });
    callback(user);
});

function checkPassword(err, user, pass, callback) {
    callback(passwordHash.verify(pass + "", user.password_hash));
};

function checkPassReset(err, hash, pass, callback) {
    callback(passwordHash.verify(pass + "", hash));
};

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

exports.install = function () {
    F.on('initdb', function () {

        var sql = DATABASE();
        sql.query('allUsers', 'SELECT * FROM users').make(function (builder) { });
        sql.exec(function (err, response) {
            //console.log(response.allUsers);
            console.log('allUsers DB init.');
            console.log(response);

            User.list = [];
            User.by_id = {};

            Reset_pass.by_user_id = {};

            response.allUsers.forEach(function (e) {
                User.add(e);
            })


            console.log('users init complete');
        });
    });
}