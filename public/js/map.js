// -*- coding: utf-8 -*-

CONVERT_TO_CITY_URL = 'https://api.bigdatacloud.net/data/reverse-geocode-client?';

const requester = new APIRequester({
    baseURL: 'https://api.maptiler.com/maps/',
});

// * Default map values (changeable)
var defaults = {
    map: {
        lat: 40.7,
        lon: -73.9,
        zoom: 13
    },

    radius: 5000
};

// * Create leaflet map
var map = L.map('mapid').setView([defaults.map.lat, defaults.map.lon], defaults.map.zoom);

let style = 'streets';
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

// * Create map tile layer (texture) and add to the map
const tileLayer = L.tileLayer(url, {
    attribution: APIRequester.ATTRIBUTION,

    // Map settings
    maxZoom: 20,
    minZoom: 3
})

tileLayer.addTo(map);


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

async function convertToCity(lat, lon, locality_info) {

    let content = fetch(CONVERT_TO_CITY_URL + `latitude=${lat}&longitude=${lon}&localityLanguage=${locality_info}`)
        .then(res => res.json())
        .then((res) => {return res});


    return content;
}