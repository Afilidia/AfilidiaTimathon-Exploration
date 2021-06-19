// -*- coding: utf-8 -*-

var map = L.map('mapid').setView([51.505, -0.09], 13);
let type = 'Basic';

var mapData = getMapData(type);

L.tileLayer(mapData.map, {
    attribution: mapData.attribution,
}).addTo(map);

