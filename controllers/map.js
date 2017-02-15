exports.install = function () {
    F.route('/map', view_map);
};

function view_map() {
    var self = this;
    self.view('/temp/map');
}