// -*- coding: utf-8 -*-

"use strict";

/**
 * Search Engine class file.
 *
 * @description Searches for a datasets. 
 *
 * @link /public/js/search_engine/search.js
 * @file This file defines the Search class that
 *       searches for a products that matches a given keyword.
 *
 * @author Adriskk
 * @since 0.0.1
 *
 * @copyright Afilidia
 */



/**
 * Main Search class.
 *
 * @description Search class -> engine for searching dataset.
 *
 * @since 0.0.1
 * @augments children
 *
 * @alias Search
 * @link /public/js/search_engine/search.js
 *
 */
 class Search extends Filters {
    static DEBUG = true;

    /**
     * @description Initialize all fields
     *
     * @constructor constructor method of Search
     *
     * @since 0.0.1
     *
     * @param {array} data              An array of datasets
     * @param {Object} structure        An js object containing types structure
     *
     */
    constructor (data, structure) {
        super();

        this.data = data;
        this.structure = structure;

        this.types = this.getStructureTypes(this.structure);
        this.applyTypes(this.types);
        // if (Search.DEBUG) console.log(this.types);
    }


    /**
     * @description Searches for dataset by a keyword
     *
     * @since 0.0.1
     * @access public
     *
     * @param {string} keyword          Keyword to match saved datasets
     *
     * @memberof Search
     * @returns {array}                 Returns array of datasets that match given keyword
     */
    searchByKeyword(keyword) {
        var elements = null;

        // GET KEYWORD TYPE
        if ((typeof keyword === 'float') || (typeof keyword === 'number')) elements = this.types['float'];
        else elements = this.types[typeof keyword];

        if (Search.DEBUG) console.log(elements);

        var type = typeof keyword;
        var datasets = this.findSimilarDatasets(type, elements, keyword);

        // CHECK FOR FILTERS HERE LATER

        return datasets;
    }


    /**
     * @description Look for similarities in datasets for a given keyword
     *
     * @since 0.0.1
     * @access public
     *
     * @param {string} type             Type of a keyword
     * @param {array} elements          Array of saved types
     * @param {string} keyword          Keyword to match saved datasets
     *
     * @memberof Search
     * @returns {array}                  Returns array of datasets that owns similarities
     */
    findSimilarDatasets(type, elements, keyword) {
        var datasets = [];
        console.log('DATA: ', this.data);

        this.data.forEach(dataset => {

            switch (type) {
                case 'string': {
                    elements.forEach(element => {
                        let text = dataset[element];
                        // if (Search.DEBUG) console.log(element, text);

                        if ((text != null) && (!this.isAlreadyInDatasets(dataset.id, datasets))) {
                            text = text.toLowerCase();
                            if (text.search(keyword.toLowerCase()) != -1) datasets.push(dataset);
                        }

                    });

                } break;

                case 'number': {
                    elements.forEach(element => {
                        let price = parseFloat(dataset[element]);
                        // if (Search.DEBUG) console.log(element, price);

                        if (price != null) {
                            if (keyword == price) datasets.push(dataset);

                        } else console.log('[PRODUCT ERROR] PRODUCT PRICE IS NULL! ');

                    });

                } break;
            }

        });

        return datasets;
    }


    /**
     * @description Checks if dataset is already in found datasets
     *
     * @since 0.0.1
     * @access public
     *
     * @param {number} id               Id of operating dataset
     * @param {array} datasets          Array of datasets
     *
     * @memberof Search
     * @returns {bool}                 Returns true if dataset is already in datasets
     */
    isAlreadyInDatasets(id, datasets) {
        let alreadyIn = false;

        datasets.forEach(dataset => {
            if (dataset.id == id) alreadyIn = true;
        });

        return alreadyIn;
    }

    /**
     * @description Gets types from a passed structure
     *
     * @since 0.0.1
     * @access public
     *
     * @param {Object} structure        JS Object with types
     *
     * @memberof Search
     * @returns {array}                 Returns JS Object of resolved types
     */
    getStructureTypes(structure) {
        var keys = Object.keys(structure);
        var types = {};

        keys.forEach(key => {
            let data = structure[key];

            // CHECK IF GIVEN TYPE IN TYPES -> CREATE ARRAY UNDER THIS TYPE IF NOT IN
            if (!types.hasOwnProperty(data.type)) types[data.type] = [];

            // ADD KEY (FIELD) TO THE TYPES[TYPE] IF NOT IN
            if (!types[data.type].includes(key)) types[data.type].push(key);
        });

        return types;
    }

    // GETTERS

    /**
     * @description Get types GETTER
     *
     * @since 0.0.1
     * @access public
     *
     * @memberof Search
     * @returns {array}                 Returns all the saved types
     */
    get getTypes() {
        return Object.keys(this.types);
    }

    /**
     * @description Get elements GETTER
     *
     * @since 0.0.1
     * @access public
     *
     * @memberof Search
     * @returns {array}                 Returns all the saved types data
     */
    get getElements() {
        return Object.keys(this.structure);
    }
}