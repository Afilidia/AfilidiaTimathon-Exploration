// -*- coding: utf-8 -*-

"use strict";

class Flights {

    constructor (data, elements, filters) {
        this.data = data;
        this.elements = elements;
        this.filters = filters;

        console.log(elements);

        this.search = new Search(this.data, {

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
            lowest_price: {type: 'boolean'},
            biggest_price: {type: 'boolean'},

        });

        // * Get button clicked
        this.waitForButtonClicked();
    }

    // * Handle the find button click
    waitForButtonClicked() {
        if (this.elements.button) {
            document.querySelector('.' + this.elements.button).addEventListener('click', () => {

                // * Get all data from the fields
                var input = this.getInputData();

                if (input) {
                    var filtered = this.search.searchByFilters(input);

                    // * Show filtered datasets
                    if (filtered) {}
                }
            });
        }
            
    }

    // * Get data from user input fields
    getInputData() {
        var data = {};

        Object.keys(this.elements).forEach(key => {
            let content = this.elements[key];
            data[key] = {};

            // * If given section contains only one input dataset
            // * (contains only from & to keys)
            if (Object.keys(content).includes('from')) {
                
                let {from, to} = content;

                switch (key) {
                    case 'datetime': {
                        data[key].from = from.value;
                        data[key].to = to.value;
                    } break;
                }
                
            } else {  // * Contains more datsets splited into own dicts
                Object.keys(content).forEach(section_key => {
                    if (content != "search-flights") {

                        data[key][section_key] = {};
                        let element = content[section_key];

                        switch (section_key) {

                            case 'currency': {
                                data[key][section_key].curr = (element.curr).value;
                            } break;

                            case 'price': {
                                data[key][section_key].from = Number((element.from).value);
                                data[key][section_key].to = Number((element.to).value);
                            } break;

                            case 'iata': {
                                data[key][section_key].from = (element.from).value;
                                data[key][section_key].to = (element.from).value;
                            } break;

                            // * Checkboxes
                            case 'direct_flights': {
                                data[key][section_key] = element.checked;
                            } break;

                            case 'lowest_price': {
                                data[key][section_key] = element.checked;
                            } break;

                            case 'biggest_price': {
                                data[key][section_key] = element.checked;
                            } break;
                        }
                    }
                }); 
            }
        });

        return data;
    }
}