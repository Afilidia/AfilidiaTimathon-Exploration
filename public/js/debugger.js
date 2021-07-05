// -*- coding: utf-8 -*-


class Debugger {
    static DEBUG = false;
    static PAGE = null;
    static SETTINGS = null;

    static DEFAULT_SETTINGS = {
        debug: true,
        time: {
            miliseconds: false,
        },
    };

    /* Console functions */
    static warn(message) { if (Debugger.DEBUG) console.warn(`[!!] ${Debugger.getDebuggerData}: ${message}`); }
    static info(message) { if (Debugger.DEBUG) console.info(`[??] ${Debugger.getDebuggerData}: ${message}`); }
    static error(message) { if (Debugger.DEBUG) console.error(`[error] ${Debugger.getDebuggerData}: ${message}`); }
    static log(message) { if (Debugger.DEBUG) console.log(`[log] ${Debugger.getDebuggerData}: ${message}`); }

    constructor (page, settings) {
        if (page) Debugger.PAGE = page;
        else console.warn('Debugger: passed page is null');

        Debugger.SETTINGS = settings;
        Debugger.DEBUG = settings.debug;
    }

    static get getDate() {
        let date = new Date();

        return '' + (date.getHours() + 1) + ':' + (date.getMinutes() + 1) + ':' + (date.getSeconds() + 1) + (function () {
            if ((Debugger.SETTINGS != null) && (Debugger.SETTINGS.time.miliseconds)) return date.getMilliseconds() + 1;
            else return '';
        })();
    }

    static get getDebuggerData() {
        return `${Debugger.getDate} | ${Debugger.PAGE}`;
    }
}
