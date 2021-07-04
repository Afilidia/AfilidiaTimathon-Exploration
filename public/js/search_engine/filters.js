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
        datasets.forEach(dataset => {
            result = filter(dataset);

            // * If dataset is not in filters
            // * => remove dataset from the all data
            if (!result) datasets.splice(datasets.indexOf(dataset));
        });
    }

    // * Save datasets that matches given filters
    filter(dataset) {
        
    }

}