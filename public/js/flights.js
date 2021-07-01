// -*- coding: utf-8 -*-


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
                    console.log(input);
                }
            });
        }
            
    }

    // * Get data from user input fields
    getInputData() {
        return {};
    }
}