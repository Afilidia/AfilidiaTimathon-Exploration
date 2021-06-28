// -*- coding: utf-8 -*-

// let flights = getFlights();
// console.log(flights);

"use strict";
var data = getFlights();

const search = new Search([], {

    // * IATA
    iata_from: {type: 'string'},
    iata_to: {type: 'string'},

    // * Currency
    currency: {type: 'string'},

    // * Datetime
    datetime_from: {type: 'string'},
    datetime_to: {type: 'string'},

    // * Price
    price_from: {type: 'float'},
    price_to: {type: 'float'},

    // * Checkboxes
    direct_flights: {type: 'boolean'},
});

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
                                const airports = await getData(endpoints['airports']);
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


                                // * Check & Update

                                // * from
                                from.addEventListener('change', (e) => {
                                    let code = e.target.value;
                                    let field = 'to';

                                    var new_codes = reduceRange(code, field);

                                    if (new_codes) {
                                        // * Delete old options
                                        to.innerHTML = '';

                                        // * Add new
                                        new_codes.forEach(code => {
                                            let HTML = `<option class="option" value="${code}">${code}</option>`;
                                            to.insertAdjacentHTML('beforeend', HTML);
                                        });
                                    }
                                });

                                // * to
                                to.addEventListener('change', (e) => {
                                    let code = e.target.value;
                                    let field = 'from';

                                    var new_codes = reduceRange(code, field);

                                    if (new_codes) {
                                        // * Delete old options
                                        from.innerHTML = '';

                                        // * Add new
                                        new_codes.forEach(code => {
                                            let HTML = `<option class="option" value="${code}">${code}</option>`;
                                            from.insertAdjacentHTML('beforeend', HTML);
                                        });
                                    }
                                });
                                
                            } break;
    
                            case 'currency': {
                                var icon = document.querySelector('.currency-icon');
                                var currency = document.getElementsByName(content[tag].curr)[0];

                                if (icon && currency) {

                                    const changeIconPath = (curr) => {
                                        let path = icon.getAttribute('src').split('/');

                                        if (path) {
                                            path.pop();
                                            path.push((curr).toLowerCase() + '.png');
                                            icon.setAttribute('src', path.join('/'));
                                        }
                                    };

                                    // * Change icon path
                                    changeIconPath(currency.value);

                                    // * Check & Update
                                    currency.addEventListener('change', (e) => {
                                        changeIconPath(e.target.value);
                                    });
                                    
                                }
                                
                            } break;
    
                            default: {
                                Debugger.warn('Unexpected key in init elements!');
                            };
                        }
    
                    });
    
                } break;
    
                case 'datetime': {
                    let {from, to} = content;

                    from = document.getElementsByName(from)[0];
                    to = document.getElementsByName(to)[0];

                    if (from && to) {
                        const date = new Date();
                        const week = 60 * 60 * 24 * 7;
                        let weekTimestamp = Date.now() + week * 1000;  // Add miliseconds

                        let todayPattern = getDatetimePattern(date, 'now');
                        let weekPattern = getDatetimePattern(new Date(weekTimestamp), 'end');

                        // console.log(todayPattern, weekPattern);

                        from.value = todayPattern;
                        from.min = todayPattern;

                        to.value = weekPattern;
                        

                        from.addEventListener('change', (e) => {
                            var fromDate = new Date(e.target.value);
                            var toDate = new Date(to.value);
                            var error = false;

                            if ((fromDate.getTime() / 1000) > (toDate.getTime() / 1000)) error = true;
                            else error = false;

                            // ! Do something with error
                        });
                    }

                } break;
    
                case 'numeric': {
                    Object.keys(content).forEach(tag => {
                        switch (tag) {
                            case 'price': {
                                let {from, to} = content[tag];

                                from = document.getElementsByName(from)[0];
                                to = document.getElementsByName(to)[0];
                                var currencySelect = document.getElementById('currency-select');
                                let currency = (currencySelect) ? currencySelect.value : 'usd';

                                if (from && to && currency) {
                                    let max = MAX_TICKET_PRICE[currency]
                                    to.max = max;

                                    from.addEventListener('change', (e) => {
                                        var error = false;

                                        if ((from.value < 1) || (from.value > to.max)) error = true;
                                        else error = false;

                                        console.log(error);
                                    });
                                }

                            } break;
                        }

                    });

                } break;
    
                case 'checkbox': {} break;

                default: {
                    Debugger.warn('Unexpected key in main init elements!');
                };
            };
        });
    }

    
}


// * Get flights information from API
async function getFlights() {
    return await fetch('/api/flights/kiwi/flights_multi/usd', { 
        method: 'POST',
        body: JSON.stringify({
            "fly_from": "KRK",
            "fly_to": "SVQ",
            "date_from": "06/07/2021",
            "date_to": "20/07/2021",
            "direct_flights": 0,
            "passengers": 1,
            "adults": 1,
            "infants": 0,
            "children": 0
        }),

        headers: {
            "Content-Type": "application/json; charset=UTF-8"
        }

    }).then((response) => response.json())
        .then((data) => {console.log(data); return data})
            .catch((error) => {console.log(error)});
}

// * Asynchro fetches the data from passed url
async function getData(url) {
    var data = await fetch(url)
                    .then((response) => response.json())
                        .then((data) => {return data})
                            .catch((error) => {console.log(error)});
    return data;
}

// * Gets airport codes from each
function exractCodesFromAirports(airports) {
    var codes = [];

    if (airports) airports.forEach(airport => {
        codes.push(airport.code);
    });

    return codes
}

// * Creates a datetime-local pattern from passed data
function getDatetimePattern(date, hourPosition) {
    if (date) {

        let datetime = {
            minute: ((date.getMinutes() + 1) < 10) ? '0' + date.getMinutes() : date.getMinutes(),
            hour: ((date.getHours() + 1) < 10) ? '0' + date.getHours() : date.getHours(),
            day: (date.getDate() < 10) ? '0' + date.getDate() : date.getDate(),
            month: ((date.getMonth() + 1) < 10) ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1),
            year: date.getFullYear()
        };

        let hourPattern = (hourPosition == 'now') ? `${datetime.hour}:${datetime.minute}`: '23:59';

        var pattern = `${datetime.year}-${datetime.month}-${datetime.day}T${hourPattern}`;
        return pattern;  
    }

    return 'YYYY-MM-DDThh:mm';
} 

// * Returns the airport codes where user can 
// * fly from chosen one in the first select 
function reduceRange(code, otherField) {
    // ! Code this after the api fix
    return null;
}