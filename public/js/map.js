// -*- coding: utf-8 -*-


const requester = new APIRequester({
    baseURL: 'https://api.maptiler.com/maps/',
});

// * Create leaflet map
var map = L.map('mapid').setView([40.7, -73.9], 13);

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


L.tileLayer(url, {
    attribution: APIRequester.ATTRIBUTION
}).addTo(map);

L.marker([40.7, -73.9]).addTo(map)
    .bindPopup('A pretty CSS3 popup.<br> Easily customizable.')
    .openPopup();
