F.on('module#auth', function (type, name) {
    console.log('module auth catched');

    var auth = MODULE('auth');
    auth.onAuthorize = function (id, callback, flags) {

        // - this function is cached
        // - here you have to read user information from a database
        // - insert the user object into the callback (this object will be saved to session/cache)
        callback({ id: '1', alias: 'Peter Sirka' });

        // if user not exist then
        // callback(null);
    };
});