// -*- coding: utf-8 -*-

var map = L.map('mapid').setView([51.505, -0.09], 13);
let type = 'Basic';

const requester = new APIRequester({
    accessToken: 'pk.eyJ1IjoiYWZpbGlkaWFncm91cCIsImEiOiJja3E0MTU1Z2EwcmFoMm5rYWNmaXVzcTVjIn0.2DoSw8QQ0rZ8KwisZOi1sA',
    baseURL: 'https://api.mapbox.com/'
});

var mapData = getMapData(type);
let url = requester.getURL();

console.log(url.message);

L.tileLayer(url, {
    attribution: mapData.attribution,
}).addTo(map);

