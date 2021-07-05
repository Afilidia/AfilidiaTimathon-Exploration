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
            // console.log(result);

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

        console.log(this.checkDateTime(fields.datetime));
        console.log(this.checkPriceRange(fields.price[(this.filters.select.currency.curr).toUpperCase()]));
        console.log(this.checkPlaneTransfers(fields.direct_flights));
        console.log(" ");

        if ((this.checkDateTime(fields.datetime))  // * Check if date pattern is in range
            && (this.checkPriceRange(fields.price[(this.filters.select.currency.curr).toUpperCase()])) // * Check if price is in range
            && (this.checkPlaneTransfers(fields.direct_flights))) /* Check if transfers has been set as true */ return true;

        return false;
    }

    checkDateTime(datetime) {
        let fromDate = (new Date(this.filters.datetime.from).getTime()) / 1000;
        let toDate = (new Date(this.filters.datetime.to).getTime()) / 1000;

        // console.log(datetime, fromDate, toDate);
        // console.log((datetime >= fromDate) && (datetime <= toDate));
        // console.log(" ");

        if ((datetime >= fromDate) && (datetime <= toDate)) return true;
        return false;
    }

    checkPriceRange(price) {

        // console.log(this.filters.numeric.price.from, this.filters.numeric.price.to, price);
        // console.log((price > this.filters.numeric.price.from) && (price < this.filters.numeric.price.to));

        if ((this.filters.numeric.price.from == 0) && (this.filters.numeric.price.to == 0)) return true;

        if ((price > this.filters.numeric.price.from) && (price < this.filters.numeric.price.to)) return true;
        return false;
    }

    checkPlaneTransfers(transfers_amount) {
        // console.log(Boolean(transfers_amount), this.filters.checkbox.direct_flights);

        if ((this.filters.checkbox.direct_flights) && (Boolean(transfers_amount))) return true;
        else if ((!this.filters.checkbox.direct_flights) && (!Boolean(transfers_amount))) return true;
        return false;
    }

}