// -*- coding: utf-8 -*-

/**
 * * This file contains all application data
 */

var CURRENT_PAGE = (window.location.pathname).split("/").pop();
if (CURRENT_PAGE.split('.')[1] != null) CURRENT_PAGE = CURRENT_PAGE.split('.')[0];

// Create inital Debugger object (Will be saved in singleton design pattern)
const DEBUGGER = new Debugger(CURRENT_PAGE, Debugger.DEFAULT_SETTINGS);
Debugger.info(`Currently in > ${CURRENT_PAGE} < page`);
