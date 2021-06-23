// -*- coding: utf-8 -*-

CONVERT_TO_CITY_URL = 'https://api.bigdatacloud.net/data/reverse-geocode-client?';
UPDATE_DELAY = 4000;

const requester = new APIRequester({
    baseURL: 'https://api.maptiler.com/maps/',
});

const layers = {};
const circles = [];
const aircrafts = {};
const popups = {};

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

    radius: 100,    // * Circle radius
    initial: null,  // * Initial marker
    moved: false    // * If marker has been moved - true
};

const circle_style = {
    color: '#5643fd',
    fillColor: '#7649fe',
    fillOpacity: 0.3
};


// * Create leaflet map
var map = L.map('mapid').setView([defaults.map.lat, defaults.map.lon], defaults.map.zoom);


addLayersToMap();

// * Add initial marker
placeMarker({
    map: {
        lat: defaults.map.lat,
        lon: defaults.map.lon,
    },

    popup: {
        content: '<span class="leaflet-header">This is you!</span>',
        open: false
    },

    marker: {
        draggable: true
    },

    callback: function (marker) {
        marker.addTo(map);
        defaults.initial = marker;

        // * On end of marker dragging (moving with cursor)
        marker.on('dragend', function (event) {
            var marker = event.target;
            var position = marker.getLatLng();

            marker.setLatLng(new L.LatLng(position.lat, position.lng), {draggable: true});
            map.flyTo(new L.LatLng(position.lat, position.lng));

            defaults.map.lat = position.lat;
            defaults.map.lon = position.lng;

            defaults.moved = true;
        });
    }
});


// * Create custom airplane icon
const airplane_icon = L.icon({
    iconUrl: '/assets/markers/plane.png',
    iconSize: [45, 48],
    iconAnchor: [24, 48],
    popupAnchor: [-3, -76],

    shadowUrl: '/assets/markers/shadow.png',
    shadowSize: [45, 48],
    shadowAnchor: [15, 48]
});

const ground_airplane_icon = L.icon({
    iconUrl: '/assets/markers/ground_plane.png',
    iconSize: [45, 48],
    iconAnchor: [24, 48],
    popupAnchor: [-3, -76],

    shadowUrl: '/assets/markers/shadow.png',
    shadowSize: [45, 48],
    shadowAnchor: [15, 48]
});



// * ------ Geolocalization functions

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
    Debugger.log("Latitude: " + position.coords.latitude);
    Debugger.log("Longitude: " + position.coords.longitude);

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

    // * Remove latest scan data
    if (circles.length > 0) {
        if (Object.keys(aircrafts).length > 0) clearAircrafts();
        map.removeLayer(circles[0]);
    }

    /**
     * * map.flyTo() is smoother and animated - a little bit slow
     * * when moving from the other side of the world
     *
     * * map.panTo() is much faster but not animated at all
     *
     * ? Which one
     */
    map.flyTo([defaults.map.lat, defaults.map.lon], defaults.map.zoom);
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

        marker: {
            draggable: true
        },

        callback: function (marker) {
            marker.addTo(map);

            // * On end of marker dragging (moving with cursor)
            marker.on('dragend', function (event) {
                var marker = event.target;
                var position = marker.getLatLng();

                marker.setLatLng(new L.LatLng(position.lat, position.lng), {draggable: true});
                map.flyTo(new L.LatLng(position.lat, position.lng));

                defaults.map.lat = position.lat;
                defaults.map.lon = position.lng;

                defaults.moved = true;
            });
        }
    });

    // * Remove initial marker
    if (defaults.initial)  map.removeLayer(defaults.initial);
}

// * Leaflet map functions

// * Creates marker on the map
function placeMarker(settings) {

    if (settings) {
        let callback = settings.callback;

        let lat = settings.map.lat;
        let lon = settings.map.lon;

        var marker = null;
        let icon = null;
        let draggable = false;

        if (Object.keys(settings).includes('marker')) {
            if (Object.keys(settings.marker).includes('icon')) icon = settings.marker.icon;
            if (Object.keys(settings.marker).includes('draggable')) draggable = settings.marker.draggable;
        }

        if (icon) marker = L.marker([lat, lon], {icon: icon, draggable: draggable}, {'className': 'leaflet-popup-box'});
        else marker = L.marker([lat, lon], {draggable: draggable});

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

    // Settings vars
    let count = data.statesCount;

    let user_pos = defaults.map;
    let radius = defaults.radius;
    let degrees_r = parseFloat(getDegrees(radius).toFixed(2));

    // console.log(radius);

    let longitude = user_pos.lon;
    let latitude = user_pos.lat;

    let polygon = {
        left: parseFloat((longitude - degrees_r).toFixed(2)),
        bottom:parseFloat((latitude - degrees_r).toFixed(2)),
        right: parseFloat((longitude + degrees_r).toFixed(2)),
        top: parseFloat((latitude + degrees_r).toFixed(2)),
        center: {lat: user_pos.lat, lon: user_pos.lon},
        radius: radius * 100 * 5
    };

    // console.log(user_pos);
    // console.log(polygon.left, polygon.bottom, polygon.right, polygon.top);


    // Draw circle around the user marker
    var circle = drawCircle(polygon);
    circle.addTo(map);


    // Generate planes
    const planes = getPlanes(polygon, data);

    if (Object.keys(aircrafts).length > 0) clearAircrafts();
    let ground = [];

    planes.forEach(plane => {
        if (Number(plane.on_ground)) ground.push(plane);

        placeMarker({
            map: {
                lat: plane.latitude,
                lon: plane.longitude,
            },

            popup: {
                content: getCustomPopupContent(plane),
                open: false
            },

            marker: {
                icon: (Number(plane.on_ground) == 1) ? ground_airplane_icon : airplane_icon
            },

            callback: function (marker) {
                aircrafts[plane.icao_24bit] = marker;
                marker.addTo(map);
            }
        });
    });

    // console.log(ground.length);

    // * Update planes
    update();
}

// * Looks for all planes by a given polygon values
function getPlanes(polygon, data) {
    var planes = [];

    if (data) Object.keys(data).forEach(element => {
        let plane = data[element];

        let lat = plane.latitude;
        let lon = plane.longitude;

        if (inRange(lat, lon, polygon)) planes.push(plane);
    });

    return planes;
}

function inRange(lat, lon, polygon) {
    let lonrad = Math.max(lon, polygon.center.lon) == lon ? lon-polygon.center.lon : polygon.center.lon - lon;
    let latrad = Math.max(lat, polygon.center.lat) == lat ? lat-polygon.center.lat : polygon.center.lat - lat;

    if(lonrad < getDegrees(polygon.radius / 100 / 5) / 2.5 && latrad < getDegrees(polygon.radius / 100 / 5) / 2.5) return true;
    return false;
}

// * Aircrafts update function
async function update() {
    var getData = async () => {
        return await fetch('/api/opensky/get-data').then((res) => res.json()).then((res) => {return res});
    };

    var data = await getData();
    // console.log(data);

    // Settings vars
    let count = data.statesCount;

    let user_pos = defaults.map;
    let radius = defaults.radius;
    let degrees_r = parseFloat(getDegrees(radius).toFixed(2));

    // console.log(radius);

    let longitude = user_pos.lon;
    let latitude = user_pos.lat;

    let fetched_aircrafts = [];

    let polygon = {
        left: parseFloat((longitude - degrees_r).toFixed(2)),
        bottom:parseFloat((latitude - degrees_r).toFixed(2)),
        right: parseFloat((longitude + degrees_r).toFixed(2)),
        top: parseFloat((latitude + degrees_r).toFixed(2)),
        center: {lat: user_pos.lat, lon: user_pos.lon},
        radius: radius * 100 * 5
    };

    if (data) Object.keys(data).forEach(element => {
        let plane = data[element];

        let lat = plane.latitude;
        let lon = plane.longitude;

        if (inRange(lat, lon, polygon)) {
            fetched_aircrafts.push(plane);

            // * Update aricraft position if in range
            if (aircrafts[plane.icao_24bit]) {
                aircrafts[plane.icao_24bit].setLatLng([lat, lon]).update();

                // * Update plane marker popup
                aircrafts[plane.icao_24bit].setPopupContent(getCustomPopupContent(plane));

                // * Update marker icon
                if (Number(plane.on_ground) == 1) aircrafts[plane.icao_24bit].setIcon(ground_airplane_icon);
            }

        } else {
            // * Delete aircraft if not in range
            // if (aircrafts[plane.icao_24bit]) map.removeLayer(aircrafts[plane.icao_24bit]);
            // delete aircrafts[plane.icao_24bit];
        }
    });

    // console.log(fetched_aircrafts.length, Object.keys(aircrafts).length);
    if (fetched_aircrafts.length > Object.keys(aircrafts).length) {
        var fetched = transform(fetched_aircrafts);
        // console.log(aircrafts);

        var new_aircrafts = unmerge(fetched, aircrafts);
        // console.log(new_aircrafts);

        if (new_aircrafts) Object.keys(new_aircrafts).forEach(icao => {
            let plane = new_aircrafts[icao];
            // console.log(icao);

            placeMarker({
                map: {
                    lat: plane.latitude,
                    lon: plane.longitude,
                },

                popup: {
                    content: getCustomPopupContent(plane),
                    open: false
                },

                marker: {
                    icon: (Number(plane.on_ground) == 1) ? ground_airplane_icon : airplane_icon
                },

                callback: function (marker) {
                    aircrafts[plane.icao_24bit] = marker;
                    marker.addTo(map);
                }
            });
        });
    }

    if (defaults.moved == false) setTimeout(update, UPDATE_DELAY);
    else {
        // * Move circle to the new position
        moveCircle(defaults.map.lat, defaults.map.lon);

        polygon.left = parseFloat((defaults.map.lon - degrees_r).toFixed(2)),
        polygon.bottom = parseFloat((defaults.map.lat - degrees_r).toFixed(2)),
        polygon.right = parseFloat((defaults.map.lon + degrees_r).toFixed(2)),
        polygon.top = parseFloat((defaults.map.lat + degrees_r).toFixed(2)),
        polygon.center = {lat: defaults.map.lat, lon: defaults.map.lon},
        polygon.radius = radius * 100 * 5


        // * Marker has been moved -> remove all aircrafts
        // var outer_aircrafts = getOuterAircrafts(data, polygon);
        // var outer_aircrafts = getMarkerByICAO(outer_aircrafts);
        // console.log(outer_aircrafts);
        clearAircrafts();

        defaults.moved = false;
        update();
    }
}

// * Calculates kilometers into degrees
function getDegrees(kilometers) {
    // 1° = 111 km  (or 60 nautical miles)
    // 0.1° = 11.1 km
    // 0.01° = 1.11 km (2 decimals, km accuracy)
    // 0.001° =111 m
    // 0.0001° = 11.1 m
    // 0.00001° = 1.11 m
    // 0.000001° = 0.11 m (7 decimals, cm accuracy)
    // 1' = 1.85 km  (or 1 nautical mile)
    // 0.1' = 185 m
    // 0.01' = 18.5 m
    // 0.001' = 1.85 m
    // 30" = 900 m
    // 15" = 450 m
    // 3" = 90 m
    // 1" = 30 m
    // 1/3" = 10 m
    // 0.1" = 3 m
    // 1/9" = 3 m
    // 1/27" = 1 m
    // (7 decimals, cm accuracy)

    return kilometers / 111;
}

// * Draws a circle for a given radius and position
function drawCircle(data) {
    if (circles.length > 0)  for (var i = circles.length; i >= 0; i--) {
        let circle = circles[i];
        result = deleteOldCircle(circle);
        if (result) circles.pop();
    }

    var circle = L.circle([data.center.lat, data.center.lon], {
        color: circle_style.color,
        fillColor: circle_style.fillColor,
        fillOpacity: circle_style.fillOpacity,
        radius: data.radius
    });

    circles.push(circle);
    return circle;
}

// * Deletes old circle
function deleteOldCircle(circle) {

    if (circle) {
        let removed = map.removeLayer(circle);
        if (removed) return true;
        return false;
    }

    return false;
}

// * Customize popup content
function getCustomPopupContent(plane) {
    let lat = plane.latitude;
    let lon = plane.longitude;

    let icao = plane.icao_24bit;
    let callsign = plane.callsign;
    let alt = plane.altitude;

    let ground = plane.on_ground;

    let airport_from = (plane.origin_airport_iata != '') ? plane.origin_airport_iata : 'Unknown';
    let airport_to = (plane.destination_airport_iata != '') ? plane.destination_airport_iata : 'Unknown';

    let heading = plane.heading;
    let speed = plane.ground_speed;

    var content =   `<div class="leaflet-popup-box">` +
                        `<span class="leaflet-header">${icao}</span>` +

                        `<div class="leaflet-content">` +
                            `<div class="leaflet-row">` +
                                `<span class="lealfet-row-header bold">Longitude: </span>` +
                                `<label class="leaflet-row-content">${lon}°</label>` +
                            `</div>` +
                        `</div>` +

                        `<div class="leaflet-content">` +
                            `<div class="leaflet-row">` +
                                `<span class="lealfet-row-header bold">Latitude: </span>` +
                                `<label class="leaflet-row-content">${lat}°</label>` +
                            `</div>` +
                        `</div>` +

                        `<div class="leaflet-content">` +
                            `<div class="leaflet-row">` +
                                `<span class="lealfet-row-header bold">Altitude: </span>` +
                                `<label class="leaflet-row-content">${alt} meters</label>` +
                            `</div>` +
                        `</div>` +

                        `<div class="bar"></div>` +

                        `<div class="leaflet-content">` +
                            `<div class="leaflet-row">` +
                                `<span class="lealfet-row-header bold">From: </span>` +
                                `<label class="leaflet-row-content">${airport_from} airport</label>` +
                            `</div>` +
                        `</div>` +

                        `<div class="leaflet-content">` +
                            `<div class="leaflet-row">` +
                                `<span class="lealfet-row-header bold">To: </span>` +
                                `<label class="leaflet-row-content">${airport_to} airport</label>` +
                            `</div>` +
                        `</div>` +

                        `<div class="bar"></div>` +

                        `<div class="leaflet-content">` +
                            `<div class="leaflet-row">` +
                                `<span class="lealfet-row-header bold">Heading: </span>` +
                                `<label class="leaflet-row-content">${heading} - ${calcHeading(heading)} </label>` +
                            `</div>` +
                        `</div>` +

                        `<div class="leaflet-content">` +
                            `<div class="leaflet-row">` +
                                `<span class="lealfet-row-header bold">Speed: </span>` +
                                `<label class="leaflet-row-content">${speed} km/h</label>` +
                            `</div>` +
                        `</div>` +
                    `</div>`;

    return content;
}

// * Deletes all aircraft markers
function clearAircrafts(object) {
    let planes = {};

    if (object !== undefined) planes = object;
    else planes = aircrafts;

    // console.log(planes);

    Object.keys(planes).forEach(element => {
        let aircraft = planes[element];
        map.removeLayer(aircraft);
        delete planes[element];
    });
}

// * Moves circle to passed lat and lon
function moveCircle(lat, lon) {
    if (circles[0]) circles[0].setLatLng([lat, lon]);
}

// * Sets the icao_24bit as the key to its parent element
function transform(array, key) {
    var object = {};

    array.forEach(element => {
        // console.log(element);
        object[element.icao_24bit] = element;
    });

    return object;
}

// * Deletes the content from array1 that is set in array2
function unmerge(array1, array2) {
    let array2_keys = Object.keys(array2);

    if ((array1) && (array2)) Object.keys(array1).forEach(element => {
        if (array2_keys.includes(element)) delete array1[element];
    });

    return array1;
}

// * Gets all aircrafts not in circle range
function getOuterAircrafts(data, polygon) {
    var outer = [];

    if (data) Object.keys(data).forEach(element => {
        let plane = data[element];

        let lat = plane.latitude;
        let lon = plane.longitude;

        if (!inRange(lat, lon, polygon)) {
            // console.log(plane.icao_24bit);
            outer.push(plane);
        }
    });

    return outer;
}

// * Returns transformed object if plane with given ICAO is set in global aircrafts list
function getMarkerByICAO(planes) {
    let array = {};

    let getMatching = (planes, icao) => {
        for (let i=0; i<planes.length; i++) if (planes[i].icao_24bit == icao) return planes[i];
        return null
    };

    console.log(aircrafts);
    if (planes) Object.keys(aircrafts).forEach(aircraft => {
        console.log(planes, aircraft);
        let matching = getMatching(planes, aircraft);
        if (matching) array[aircraft] = matching;
    });

    return array;
}

// * Get the direction the NESW plane is heading
function calcHeading(heading) {
  const degreePerDirection = 360 / 8;
  const offsetAngle = heading + degreePerDirection / 2;

  return (offsetAngle >= 0 * degreePerDirection && offsetAngle < 1 * degreePerDirection) ? "N"
        : (offsetAngle >= 1 * degreePerDirection && offsetAngle < 2 * degreePerDirection) ? "NE"
            : (offsetAngle >= 2 * degreePerDirection && offsetAngle < 3 * degreePerDirection) ? "E"
                : (offsetAngle >= 3 * degreePerDirection && offsetAngle < 4 * degreePerDirection) ? "SE"
                    : (offsetAngle >= 4 * degreePerDirection && offsetAngle < 5 * degreePerDirection) ? "S"
                        : (offsetAngle >= 5 * degreePerDirection && offsetAngle < 6 * degreePerDirection) ? "SW"
                            : (offsetAngle >= 6 * degreePerDirection && offsetAngle < 7 * degreePerDirection) ? "W"
                                : "NW";
}