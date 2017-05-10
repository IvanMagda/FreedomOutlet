$(window).on('load', function () {
    var auto_complete_data = [];

    $.ajax({
        url: "/js/vendors_autocomplite.json",
        method: 'get',
        dataType: "json",
        success: function (data) {
            auto_complete_data = data;
            $("input[name='manufacturer']").autocomplete({
                source: auto_complete_data
            });
        }
    });
});

function upperCaseF(a) {
    setTimeout(function () {
        a.value = a.value.toUpperCase();
    }, 1);
}