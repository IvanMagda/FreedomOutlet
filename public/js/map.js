$(document).ready(function () {
    $('#map').css('width', $('#img_map').width());
    $('#map').css('height', $('#img_map').width()/2);
    $('#map').css('visibility', 'hidden');
    init();

    $('#img_map').click(function () {
        $('#map').css('visibility', '');
        $('#map_c').css('position', 'relative');
        $(this).css('display', 'none');
    });
});
// When the window has finished loading create our google map below
//google.maps.event.addDomListener(window, 'load', init);

function init() {
    // Basic options for a simple Google Map
    // For more options see: https://developers.google.com/maps/documentation/javascript/reference#MapOptions
    var mapOptions = {

        // How zoomed in you want the map to start at (always required)
        zoom: 8,

        // The latitude and longitude to center the map (always required)
        center: new google.maps.LatLng(49.6876186, 33.2700885), // Ukraine village Yenky

        scrollwheel: false, //Disable mouse wheel

        // How you would like to style the map.
        // This is where you would paste any style found on Snazzy Maps.
        styles: [{ "featureType": "all", "elementType": "labels.text.fill", "stylers": [{ "saturation": 36 }, { "color": "#000000" }, { "lightness": 40 }] }, { "featureType": "all", "elementType": "labels.text.stroke", "stylers": [{ "visibility": "on" }, { "color": "#000000" }, { "lightness": 16 }] }, { "featureType": "all", "elementType": "labels.icon", "stylers": [{ "visibility": "off" }] }, { "featureType": "administrative", "elementType": "geometry.fill", "stylers": [{ "color": "#000000" }, { "lightness": 20 }] }, { "featureType": "administrative", "elementType": "geometry.stroke", "stylers": [{ "color": "#000000" }, { "lightness": 17 }, { "weight": 1.2 }] }, { "featureType": "landscape", "elementType": "all", "stylers": [{ "visibility": "on" }] }, { "featureType": "landscape", "elementType": "geometry", "stylers": [{ "color": "#000000" }, { "lightness": 20 }] }, { "featureType": "landscape", "elementType": "labels.icon", "stylers": [{ "saturation": "-100" }, { "lightness": "-54" }] }, { "featureType": "poi", "elementType": "all", "stylers": [{ "visibility": "on" }, { "lightness": "0" }] }, { "featureType": "poi", "elementType": "geometry", "stylers": [{ "color": "#000000" }, { "lightness": 21 }] }, { "featureType": "poi", "elementType": "labels.icon", "stylers": [{ "saturation": "-89" }, { "lightness": "-55" }] }, { "featureType": "road", "elementType": "labels.icon", "stylers": [{ "visibility": "off" }] }, { "featureType": "road.highway", "elementType": "geometry.fill", "stylers": [{ "color": "#000000" }, { "lightness": 17 }] }, { "featureType": "road.highway", "elementType": "geometry.stroke", "stylers": [{ "color": "#000000" }, { "lightness": 29 }, { "weight": 0.2 }] }, { "featureType": "road.arterial", "elementType": "geometry", "stylers": [{ "color": "#000000" }, { "lightness": 18 }] }, { "featureType": "road.local", "elementType": "geometry", "stylers": [{ "color": "#000000" }, { "lightness": 16 }] }, { "featureType": "transit", "elementType": "geometry", "stylers": [{ "color": "#000000" }, { "lightness": 19 }] }, { "featureType": "transit.station", "elementType": "labels.icon", "stylers": [{ "visibility": "on" }, { "saturation": "-100" }, { "lightness": "-51" }] }, { "featureType": "water", "elementType": "geometry", "stylers": [{ "color": "#000000" }, { "lightness": 17 }] }]
    };

    // Get the HTML DOM element that will contain your map
    // We are using a div with id="map" seen below in the <body>
    var mapElement = document.getElementById('map');

    // Create the Google Map using our element and options defined above
    var map = new google.maps.Map(mapElement, mapOptions);

    // Let's also add a marker while we're at it
    var Kyiv_shop1 = new google.maps.Marker({
        position: new google.maps.LatLng(50.4475675, 30.485456),
        icon: '/img/Lable.png',
        map: map,
        title: 'FREEDOM'
    });

    var Kyiv_shop2 = new google.maps.Marker({
        position: new google.maps.LatLng(50.3435039, 30.5522126),
        icon: '/img/Lable.png',
        map: map,
        title: 'FREEDOM'
    });

    var Kyiv_shop3 = new google.maps.Marker({
        position: new google.maps.LatLng(50.40819273, 30.60642954),
        icon: '/img/Lable.png',
        map: map,
        title: 'FREEDOM'
    });

    var Kyiv_shop4 = new google.maps.Marker({
        position: new google.maps.LatLng(50.401871, 30.6142429),
        icon: '/img/Lable.png',
        map: map,
        title: 'FREEDOM'
    });

    var Kharkiv_shop1 = new google.maps.Marker({
        position: new google.maps.LatLng(50.034248, 36.215961),
        icon: '/img/Lable.png',
        map: map,
        title: 'FREEDOM'
    });

    var Kharkiv_shop2 = new google.maps.Marker({
        position: new google.maps.LatLng(50.01316663, 36.25000368),
        icon: '/img/Lable.png',
        map: map,
        title: 'FREEDOM'
    });

    var Kharkiv_shop3 = new google.maps.Marker({
        position: new google.maps.LatLng(49.96630918, 36.32341565),
        icon: '/img/Lable.png',
        map: map,
        title: 'FREEDOM'
    });

    var Dnepr_shop1 = new google.maps.Marker({
        position: new google.maps.LatLng(48.44854027, 35.05772931),
        icon: '/img/Lable.png',
        map: map,
        title: 'FREEDOM'
    });

}
