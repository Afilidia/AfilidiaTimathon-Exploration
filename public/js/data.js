// -*- coding: utf-8 -*-

/**
 * * This file contains all application data
 */

var CURRENT_PAGE = (window.location.pathname).split("/").pop();
if (CURRENT_PAGE.split('.')[1] != null) CURRENT_PAGE = CURRENT_PAGE.split('.')[0];

// Create inital Debugger object (Will be saved in singleton design pattern)
const DEBUGGER = new Debugger(CURRENT_PAGE, Debugger.DEFAULT_SETTINGS);
Debugger.info(`Currently in > ${CURRENT_PAGE} < page`);

// * All components that matches given page
const COMPONENTS = {
    '': ['MenuComponent'],
    'index': ['MenuComponent'],
    'features': ['FooterComponent', 'MenuComponent'],
    'about': ['FooterComponent', 'MenuComponent'],
    'faq': ['FooterComponent', 'MenuComponent'],

    // Features
    'earth': ['FooterComponent', 'MenuComponent'],
    'nearby': ['FooterComponent', 'MenuComponent'],
};

const MAP_DATA = {
    'Basic': {
        map: 'https://studio.mapbox.com/styles/afilidiagroup/ckq41dm4d2vju18mjnvw3g6vi/edit/#12/48.8665/2.3176',
        attribution: '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>',
    },
};


// Returns all needed components for a given page
function getComponents(page) {
    return COMPONENTS[page] || '';
}

// Returns all pages for give component
function getComponentPages(component) {
    let pages = [];

    Object.keys(COMPONENTS).forEach(comp => {
        if (COMPONENTS[comp].includes(component)) pages.push(comp);
    });

    return pages;
}

function getMapData(type) {
    return MAP_DATA[type];
}
