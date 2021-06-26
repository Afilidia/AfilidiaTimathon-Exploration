// -*- coding: utf-8 -*-

// let flights = getFlights();
// console.log(flights);

// * Initialize all input fields 
init({
    select: {
        iata: {
            from: 'iata-from-select',
            to: 'iata-to-select'
        },

        currency: {
            curr: 'currency-select'
        }
    },

    datetime: {
        from: 'datetime-from',
        to: 'datetime-to'
    },

    numeric: {
        price: {
            from: 'price-from',
            to: 'price-to'
        }
    },

    checkbox: {
        direct_flights: 'direct-flights'
    }
});

// * Inits (prepares) all page input fields
async function init(elements) {

    if (elements) {
        const types = Object.keys(elements);

        types.forEach(type => {
            const content = elements[type];
    
            switch (type) {
                case 'select': {
                    // * Iterate through all selects in 'select' tag
                    Object.keys(content).forEach(async tag => {
                        
                        switch (tag) {
    
                            case 'iata': {
                                let {from, to} = content[tag];

                                from = document.getElementsByName(from)[0];
                                to = document.getElementsByName(to)[0];

                                // * Request all airports
                                const airports = await getData('https://gist.githubusercontent.com/tdreyno/4278655/raw/7b0762c09b519f40397e4c3e100b097d861f5588/airports.json');
                                const codes = exractCodesFromAirports(airports);


                                // ! Modify this later
                                // ! So when user have chosen the 
                                // ! IATA from for ex. the range of airport
                                // ! codes on the second select is smaller 
                                // ! (only airports that are connected to the one on the first select)

                                if (codes) codes.forEach(code => {
                                    let HTML = `<option class="option" value="${code}">${code}</option>`;

                                    // * Add all airport codes to the selects
                                    from.insertAdjacentHTML('beforeend', HTML);
                                    to.insertAdjacentHTML('beforeend', HTML);

                                }); else Debugger.error('Codes are empty! When initializing the iata selects');
                                
                            } break;
    
                            case 'currency': {
                                var icon = document.querySelector('.currency-icon');
                                var currency = document.getElementsByName(content[tag].curr)[0];

                                if (icon && currency) {
                                    let path = icon.getAttribute('src').split('/');

                                    if (path) {
                                        path.pop();
                                        path.push((currency.value).toLowerCase() + '.png');
                                        icon.setAttribute('src', path.join('/'));
                                    }
                                    
                                }
                                
                            } break;
    
                            default: {
                                Debugger.warn('Unexpected key in init elements!');
                            };
                        }
    
                    });
    
                } break;
    
                case 'datetime': {} break;
    
                case 'numeric': {} break;
    
                case 'checkbox': {} break;
            };
        });
    }

    
}


// * Get flights information from API
async function getFlights() {
    return await fetch('/api/flights/kiwi/flights_multi/usd', { 
        method: 'POST',
        body: JSON.stringify({
            fly_from: "KRK",
            fly_to: "SVQ",
            // "date_from": "06/08/2020",
            // "date_to": "06/08/2020",
            // "direct_flights": 0,
            // "passengers": 2,
            // "adults": 2,
            // "infants": 0,
            // "children": 0
        }),

        headers: {
            "Content-Type": "application/json; charset=UTF-8"
        }

    }).then((response) => response.json())
        .then((data) => {console.log(data); return data})
            .catch((error) => {console.log(error)});
}

async function getData(url) {
    var data = await fetch(url)
                    .then((response) => response.json())
                        .then((data) => {return data})
                            .catch((error) => {console.log(error)});
    return data;
}

function exractCodesFromAirports(airports) {
    var codes = [];

    if (airports) airports.forEach(airport => {
        codes.push(airport.code);
    });

    return codes
}