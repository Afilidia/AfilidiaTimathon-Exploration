// -*- coding: utf-8 -*-


console.log(getFlights());

async function getFlights() {
    return await fetch('/api/flights/kiwi/flights_multi/usd', {
        method: 'POST',
        body: JSON.stringify({
            "fly_from": "MAD",
            "fly_to": "DXB",
            "date_from": "06/08/2020",
            "date_to": "06/08/2020",
            "direct_flights": 0,
            "passengers": 2,
            "adults": 2,
            "infants": 0,
            "children": 0
        }),

        headers: {
            "Content-Type": "application/json; charset=UTF-8"
        }
    }).then((response) => {response.json()}).then((data) => {return data});
}