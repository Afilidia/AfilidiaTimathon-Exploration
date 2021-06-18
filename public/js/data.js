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
};

function getComponents(page) {
    return COMPONENTS[page];
}