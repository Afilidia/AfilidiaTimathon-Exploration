// -*- coding: utf-8 -*-

"use strict";

class Filters {

    constructor (filters) {
        this.types = {};
        this.filters = filters;
    }

    applyFilters(filters) {
        if (filters) this.filters = filters;
    } 
    
    applyTypes(types) {
        if (this.types.length == 0) this.types = types;
    }

    prepare() {
        if ((this.filters.length > 0) && (this.types.length > 0)) {
            // * Preprocess and prepare variables
        }
    }

    // * Filter all datasets
    filterDatasets(datasets) {

        datasets[0].forEach(dataset => {
            let result = this.filter(dataset);
            console.log(result);

            // * If dataset is not in filters
            // * => remove dataset from the all data
            if (!result) datasets.splice(datasets.indexOf(dataset));
        });

        console.log(datasets.length);
        return datasets;
    }

    // * Save datasets that matches given filters
    filter(dataset) {

        let fields = {
            datetime: dataset.aTime,
            price: dataset.conversion,
            direct_flights: dataset.transfers.length
        };

        // ! Console.log all below;

        if ((this.checkDateTime(fields.datetime))  // * Check if date pattern is in range
            && (this.checkPriceRange(fields.price)) // * Check if price is in range
            && (this.checkPlaneTransfers(fields.direct_flights))) /* Check if transfers has been set as true */ return true;

        return false;
    }

    checkDateTime(datetime) {
        let fromDate = (new Date(this.filters.datetime.from).getTime()) / 1000;
        let toDate = (new Date(this.filters.datetime.to).getTime()) / 1000;

        if ((datetime >= fromDate) && (datetime <= toDate)) return true;
        return false;
    }

    checkPriceRange(price) {
        if ((this.filters.numeric.price.from == 0) && (this.filters.numeric.price.to == 0)) return true;

        if ((price > this.filters.numeric.price.from) && (price < this.filters.numeric.price.to)) return true;
        return false;
    }

    checkPlaneTransfers(transfers_amount) {
        if ((this.filters.checkbox.direct_flights) && (transfers_amount > 0)) return true;
        return false;
    }

}