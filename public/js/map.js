// -*- coding: utf-8 -*-

CONVERT_TO_CITY_URL = 'https://api.bigdatacloud.net/data/reverse-geocode-client?';

const requester = new APIRequester({
    baseURL: 'https://api.maptiler.com/maps/',
});

const layers = {};

// * Default map values (changeable)
var defaults = {
    map: {
        lat: 40.7,
        lon: -73.9,
        zoom: 13
    },

    styles: {
        standard: 'streets',
        current: 'streets',
        generated: false
    },

    radius: 5000
};


// * Create leaflet map
var map = L.map('mapid').setView([defaults.map.lat, defaults.map.lon], defaults.map.zoom);


addLayersToMap();


// * Create custom airplane icon
const airplane_icon = L.icon({
    iconUrl: '/assets/markers/plane.png',
    iconSize: [45, 48],
    iconAnchor: [22, 94],
    popupAnchor: [-3, -76],

    shadowUrl: '/assets/markers/shadow.png',
    shadowSize: [45, 48],
    shadowAnchor: [14, 94]
});

// tileLayer.addTo(map);

L.marker([40.7, -73.9], {icon: airplane_icon}).addTo(map)
        .bindPopup('A pretty CSS3 popup.<br> Easily customizable.');
        //.openPopup();


// * Geolocalization functions

// * Requests localization
function getLocation() {

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(savePosition);
        return true;

    } else {
        // Could not get access
        console.log("Geolocation is not supported by this browser");
        return false;
    }

}

// * Saves localization
async function savePosition(position) {
    console.log("Latitude: " + position.coords.latitude);
    console.log("Longitude: " + position.coords.longitude);

    defaults.map.lat = position.coords.latitude;
    defaults.map.lon = position.coords.longitude;

    // * Get the localization city
    let city = await convertToCity(
        defaults.map.lat,
        defaults.map.lon,
        getLang().split('-')[0]
    );

    // console.log(city);

    if (city) {

        // * Set the localization to current city
        let location_Settings = document.querySelector('.settings-value.location');
        if (location_Settings) location_Settings.textContent = city.continentCode + ', ' + city.locality;
    }

    // * Update map

    /**
     * * map.flyTo() is smoother and animated - a little bit slow
     * * when moving from the other side of the world
     *
     * * map.panTo() is much faster but not animated at all
     *
     * ? Which one
     */
    map.flyTo([defaults.map.lat, defaults.map.lon], defaults.map.zoom)
    // map.panTo([defaults.map.lat, defaults.map.lon], defaults.map.zoom)

    placeMarker({
        map: {
            lat: defaults.map.lat,
            lon: defaults.map.lon,
        },

        popup: {
            content: 'This is you!',
            open: false
        },

        callback: function (marker) {
            marker.addTo(map);
        }
    });
}

// * Leaflet map functions
function placeMarker(settings) {

    if (settings) {
        let callback = settings.callback;

        let lat = settings.map.lat;
        let lon = settings.map.lon;

        var marker = L.marker([lat, lon]);

        if (Object.keys(settings).includes('popup')) {

            let content = settings.popup.content;
            marker.bindPopup(content);

            if (Object.keys(settings.popup).includes('open')) {
                if (settings.popup.open) marker.openPopup();
            }
        }

        // Callback
        callback(marker);
        return true;
    }

    return false;
    // L.marker([40.7, -73.9]).addTo(map)
    //     .bindPopup('A pretty CSS3 popup.<br> Easily customizable.')
    //     .openPopup();
}

// * Get local lang
function getLang() {
    if (navigator.languages != undefined) return navigator.languages[0];
    return navigator.language;
}

// * Converts given lat, lon, locality to geo object containing city
async function convertToCity(lat, lon, locality_info) {

    let content = fetch(CONVERT_TO_CITY_URL + `latitude=${lat}&longitude=${lon}&localityLanguage=${locality_info}`)
        .then(res => res.json())
        .then((res) => {return res});


    return content;
}

// * Add all layers to the map
function addLayersToMap() {
    Object.keys(MAP_DATA).forEach(style => {
        var layer = addLayer(style);
        if (layer) layer.addTo(map);

        // Add layer to global layers
        layers[style] = layer;
    });

    let standard = defaults.styles.standard;
    Object.keys(layers).forEach(style => {

        if ((style != standard) && (layers[style] != null)) {
            layers[style].setZIndex(0);
        }
    })
}

// * Returns layer object
function addLayer(style) {
    let url = requester.getURL({
        style: style,
        key: getMapData(style).key,
        fileformat: getMapData(style).format,

        vector: {
            z: '{z}',
            x: '{x}',
            y: '{y}',
        },
    });

    var tileLayer = null;

    // console.log(style == defaults.styles.standard);
    if ((style == defaults.styles.standard) || (defaults.styles.generated)) {
        // * Create map tile layer (texture) and add to the map
        tileLayer = L.tileLayer(url, {
            attribution: APIRequester.ATTRIBUTION,

            // Map settings
            maxZoom: 20,
            minZoom: 3
        });
    }


    // if (style == 'hybrid') tileLayer.setZIndex(-1);
    return tileLayer;
}

// * Switches layer to passed in param
function switchLayer(to) {
    let current = defaults.styles.current;

    if (to == current) return;

    try {

        // Generate hybrid layer
        if ((to != defaults.styles.standard) || (defaults.styles.generated == false)) {
            defaults.styles.generated = true;
            let layer = addLayer(to);
            layer.addTo(map);
            layers[to] = layer;
        }

        // Hide current
        layers[current].setZIndex(0);

        // Show new
        layers[to].setZIndex(100);
        defaults.styles.current = to;

        // console.log(current, to);

    } catch (error) {
        console.log(error);
    }
}

// * Generate all markers in set radius
async function generatePlanes() {

    // Fetch data
    var data = await fetch('/api/opensky/get-data').then((res) => res.json()).then((res) => {return res});
    console.log(data);
}