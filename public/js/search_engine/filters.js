// -*- coding: utf-8 -*-

"use strict";

class Filters {

    constructor () {
        this.types = {};
        this.filters = {};
    }

    applyFilters(filters) {}
    
    applyTypes(types) {
        if (this.types.length == 0) this.types = types;
    }

}