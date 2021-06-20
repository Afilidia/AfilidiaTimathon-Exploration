// /* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
// /* Geodesy representation conversion functions                        (c) Chris Veness 2002-2019  */
// /*                                                                                   MIT Licence  */
// /* www.movable-type.co.uk/scripts/latlong.html                                                    */
// /* www.movable-type.co.uk/scripts/js/geodesy/geodesy-library.html#dms                             */
// /* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */

// /* eslint no-irregular-whitespace: [2, { skipComments: true }] */


// /**
//  * Latitude/longitude points may be represented as decimal degrees, or subdivided into sexagesimal
//  * minutes and seconds. This module provides methods for parsing and representing degrees / minutes
//  * / seconds.
//  *
//  * @module dms
//  */


// /* Degree-minutes-seconds (& cardinal directions) separator character */
// let dmsSeparator = '\u202f'; // U+202F = 'narrow no-break space'


// /**
//  * Functions for parsing and representing degrees / minutes / seconds.
//  */
// class Dms {

//     // note Unicode Degree = U+00B0. Prime = U+2032, Double prime = U+2033

//     /**
//      * Separator character to be used to separate degrees, minutes, seconds, and cardinal directions.
//      *
//      * Default separator is U+202F ‘narrow no-break space’.
//      *
//      * To change this (e.g. to empty string or full space), set Dms.separator prior to invoking
//      * formatting.
//      *
//      * @example
//      *   import LatLon, { Dms } from '/js/geodesy/latlon-spherical.js';
//      *   const p = new LatLon(51.2, 0.33).toString('dms');  // 51° 12′ 00″ N, 000° 19′ 48″ E
//      *   Dms.separator = '';                                // no separator
//      *   const pʹ = new LatLon(51.2, 0.33).toString('dms'); // 51°12′00″N, 000°19′48″E
//      */
//     static get separator()     { return dmsSeparator; }
//     static set separator(char) { dmsSeparator = char; }


//     /**
//      * Parses string representing degrees/minutes/seconds into numeric degrees.
//      *
//      * This is very flexible on formats, allowing signed decimal degrees, or deg-min-sec optionally
//      * suffixed by compass direction (NSEW); a variety of separators are accepted. Examples -3.62,
//      * '3 37 12W', '3°37′12″W'.
//      *
//      * Thousands/decimal separators must be comma/dot; use Dms.fromLocale to convert locale-specific
//      * thousands/decimal separators.
//      *
//      * @param   {string|number} dms - Degrees or deg/min/sec in variety of formats.
//      * @returns {number}        Degrees as decimal number.
//      *
//      * @example
//      *   const lat = Dms.parse('51° 28′ 40.37″ N');
//      *   const lon = Dms.parse('000° 00′ 05.29″ W');
//      *   const p1 = new LatLon(lat, lon); // 51.4779°N, 000.0015°W
//      */
//     static parse(dms) {
//         // check for signed decimal degrees without NSEW, if so return it directly
//         if (!isNaN(parseFloat(dms)) && isFinite(dms)) return Number(dms);

//         // strip off any sign or compass dir'n & split out separate d/m/s
//         const dmsParts = String(dms).trim().replace(/^-/, '').replace(/[NSEW]$/i, '').split(/[^0-9.,]+/);
//         if (dmsParts[dmsParts.length-1]=='') dmsParts.splice(dmsParts.length-1);  // from trailing symbol

//         if (dmsParts == '') return NaN;

//         // and convert to decimal degrees...
//         let deg = null;
//         switch (dmsParts.length) {
//             case 3:  // interpret 3-part result as d/m/s
//                 deg = dmsParts[0]/1 + dmsParts[1]/60 + dmsParts[2]/3600;
//                 break;
//             case 2:  // interpret 2-part result as d/m
//                 deg = dmsParts[0]/1 + dmsParts[1]/60;
//                 break;
//             case 1:  // just d (possibly decimal) or non-separated dddmmss
//                 deg = dmsParts[0];
//                 // check for fixed-width unseparated format eg 0033709W
//                 //if (/[NS]/i.test(dmsParts)) deg = '0' + deg;  // - normalise N/S to 3-digit degrees
//                 //if (/[0-9]{7}/.test(deg)) deg = deg.slice(0,3)/1 + deg.slice(3,5)/60 + deg.slice(5)/3600;
//                 break;
//             default:
//                 return NaN;
//         }
//         if (/^-|[WS]$/i.test(dms.trim())) deg = -deg; // take '-', west and south as -ve

//         return Number(deg);
//     }


//     /**
//      * Converts decimal degrees to deg/min/sec format
//      *  - degree, prime, double-prime symbols are added, but sign is discarded, though no compass
//      *    direction is added.
//      *  - degrees are zero-padded to 3 digits; for degrees latitude, use .slice(1) to remove leading
//      *    zero.
//      *
//      * @private
//      * @param   {number} deg - Degrees to be formatted as specified.
//      * @param   {string} [format=d] - Return value as 'd', 'dm', 'dms' for deg, deg+min, deg+min+sec.
//      * @param   {number} [dp=4|2|0] - Number of decimal places to use – default 4 for d, 2 for dm, 0 for dms.
//      * @returns {string} Degrees formatted as deg/min/secs according to specified format.
//      */
//     static toDms(deg, format='d', dp=undefined) {
//         if (isNaN(deg)) return null;  // give up here if we can't make a number from deg
//         if (typeof deg == 'string' && deg.trim() == '') return null;
//         if (typeof deg == 'boolean') return null;
//         if (deg == Infinity) return null;
//         if (deg == null) return null;

//         // default values
//         if (dp === undefined) {
//             switch (format) {
//                 case 'd':   case 'deg':         dp = 4; break;
//                 case 'dm':  case 'deg+min':     dp = 2; break;
//                 case 'dms': case 'deg+min+sec': dp = 0; break;
//                 default:          format = 'd'; dp = 4; break; // be forgiving on invalid format
//             }
//         }

//         deg = Math.abs(deg);  // (unsigned result ready for appending compass dir'n)

//         let dms = null, d = null, m = null, s = null;
//         switch (format) {
//             default: // invalid format spec!
//             case 'd': case 'deg':
//                 d = deg.toFixed(dp);                       // round/right-pad degrees
//                 if (d<100) d = '0' + d;                    // left-pad with leading zeros (note may include decimals)
//                 if (d<10) d = '0' + d;
//                 dms = d + '°';
//                 break;
//             case 'dm': case 'deg+min':
//                 d = Math.floor(deg);                       // get component deg
//                 m = ((deg*60) % 60).toFixed(dp);           // get component min & round/right-pad
//                 if (m == 60) { m = (0).toFixed(dp); d++; } // check for rounding up
//                 d = ('000'+d).slice(-3);                   // left-pad with leading zeros
//                 if (m<10) m = '0' + m;                     // left-pad with leading zeros (note may include decimals)
//                 dms = d + '°'+Dms.separator + m + '′';
//                 break;
//             case 'dms': case 'deg+min+sec':
//                 d = Math.floor(deg);                       // get component deg
//                 m = Math.floor((deg*3600)/60) % 60;        // get component min
//                 s = (deg*3600 % 60).toFixed(dp);           // get component sec & round/right-pad
//                 if (s == 60) { s = (0).toFixed(dp); m++; } // check for rounding up
//                 if (m == 60) { m = 0; d++; }               // check for rounding up
//                 d = ('000'+d).slice(-3);                   // left-pad with leading zeros
//                 m = ('00'+m).slice(-2);                    // left-pad with leading zeros
//                 if (s<10) s = '0' + s;                     // left-pad with leading zeros (note may include decimals)
//                 dms = d + '°'+Dms.separator + m + '′'+Dms.separator + s + '″';
//                 break;
//         }

//         return dms;
//     }


//     /**
//      * Converts numeric degrees to deg/min/sec latitude (2-digit degrees, suffixed with N/S).
//      *
//      * @param   {number} deg - Degrees to be formatted as specified.
//      * @param   {string} [format=d] - Return value as 'd', 'dm', 'dms' for deg, deg+min, deg+min+sec.
//      * @param   {number} [dp=4|2|0] - Number of decimal places to use – default 4 for d, 2 for dm, 0 for dms.
//      * @returns {string} Degrees formatted as deg/min/secs according to specified format.
//      *
//      * @example
//      *   const lat = Dms.toLat(-3.62, 'dms'); // 3°37′12″S
//      */
//     static toLat(deg, format, dp) {
//         const lat = Dms.toDms(Dms.wrap90(deg), format, dp);
//         return lat===null ? '–' : lat.slice(1) + Dms.separator + (deg<0 ? 'S' : 'N');  // knock off initial '0' for lat!
//     }


//     /**
//      * Convert numeric degrees to deg/min/sec longitude (3-digit degrees, suffixed with E/W).
//      *
//      * @param   {number} deg - Degrees to be formatted as specified.
//      * @param   {string} [format=d] - Return value as 'd', 'dm', 'dms' for deg, deg+min, deg+min+sec.
//      * @param   {number} [dp=4|2|0] - Number of decimal places to use – default 4 for d, 2 for dm, 0 for dms.
//      * @returns {string} Degrees formatted as deg/min/secs according to specified format.
//      *
//      * @example
//      *   const lon = Dms.toLon(-3.62, 'dms'); // 3°37′12″W
//      */
//     static toLon(deg, format, dp) {
//         const lon = Dms.toDms(Dms.wrap180(deg), format, dp);
//         return lon===null ? '–' : lon + Dms.separator + (deg<0 ? 'W' : 'E');
//     }


//     /**
//      * Converts numeric degrees to deg/min/sec as a bearing (0°..360°).
//      *
//      * @param   {number} deg - Degrees to be formatted as specified.
//      * @param   {string} [format=d] - Return value as 'd', 'dm', 'dms' for deg, deg+min, deg+min+sec.
//      * @param   {number} [dp=4|2|0] - Number of decimal places to use – default 4 for d, 2 for dm, 0 for dms.
//      * @returns {string} Degrees formatted as deg/min/secs according to specified format.
//      *
//      * @example
//      *   const lon = Dms.toBrng(-3.62, 'dms'); // 356°22′48″
//      */
//     static toBrng(deg, format, dp) {
//         const brng =  Dms.toDms(Dms.wrap360(deg), format, dp);
//         return brng===null ? '–' : brng.replace('360', '0');  // just in case rounding took us up to 360°!
//     }


//     /**
//      * Converts DMS string from locale thousands/decimal separators to JavaScript comma/dot separators
//      * for subsequent parsing.
//      *
//      * Both thousands and decimal separators must be followed by a numeric character, to facilitate
//      * parsing of single lat/long string (in which whitespace must be left after the comma separator).
//      *
//      * @param   {string} str - Degrees/minutes/seconds formatted with locale separators.
//      * @returns {string} Degrees/minutes/seconds formatted with standard Javascript separators.
//      *
//      * @example
//      *   const lat = Dms.fromLocale('51°28′40,12″N');                          // '51°28′40.12″N' in France
//      *   const p = new LatLon(Dms.fromLocale('51°28′40,37″N, 000°00′05,29″W'); // '51.4779°N, 000.0015°W' in France
//      */
//     static fromLocale(str) {
//         const locale = (123456.789).toLocaleString();
//         const separator = { thousands: locale.slice(3, 4), decimal: locale.slice(7, 8) };
//         return str.replace(separator.thousands, '⁜').replace(separator.decimal, '.').replace('⁜', ',');
//     }


//     /**
//      * Converts DMS string from JavaScript comma/dot thousands/decimal separators to locale separators.
//      *
//      * Can also be used to format standard numbers such as distances.
//      *
//      * @param   {string} str - Degrees/minutes/seconds formatted with standard Javascript separators.
//      * @returns {string} Degrees/minutes/seconds formatted with locale separators.
//      *
//      * @example
//      *   const Dms.toLocale('123,456.789');                   // '123.456,789' in France
//      *   const Dms.toLocale('51°28′40.12″N, 000°00′05.31″W'); // '51°28′40,12″N, 000°00′05,31″W' in France
//      */
//     static toLocale(str) {
//         const locale = (123456.789).toLocaleString();
//         const separator = { thousands: locale.slice(3, 4), decimal: locale.slice(7, 8) };
//         return str.replace(/,([0-9])/, '⁜$1').replace('.', separator.decimal).replace('⁜', separator.thousands);
//     }


//     /**
//      * Returns compass point (to given precision) for supplied bearing.
//      *
//      * @param   {number} bearing - Bearing in degrees from north.
//      * @param   {number} [precision=3] - Precision (1:cardinal / 2:intercardinal / 3:secondary-intercardinal).
//      * @returns {string} Compass point for supplied bearing.
//      *
//      * @example
//      *   const point = Dms.compassPoint(24);    // point = 'NNE'
//      *   const point = Dms.compassPoint(24, 1); // point = 'N'
//      */
//     static compassPoint(bearing, precision=3) {
//         if (![ 1, 2, 3 ].includes(Number(precision))) throw new RangeError(`invalid precision ‘${precision}’`);
//         // note precision could be extended to 4 for quarter-winds (eg NbNW), but I think they are little used

//         bearing = Dms.wrap360(bearing); // normalise to range 0..360°

//         const cardinals = [
//             'N', 'NNE', 'NE', 'ENE',
//             'E', 'ESE', 'SE', 'SSE',
//             'S', 'SSW', 'SW', 'WSW',
//             'W', 'WNW', 'NW', 'NNW' ];
//         const n = 4 * 2**(precision-1); // no of compass points at req’d precision (1=>4, 2=>8, 3=>16)
//         const cardinal = cardinals[Math.round(bearing*n/360)%n * 16/n];

//         return cardinal;
//     }


//     /**
//      * Constrain degrees to range 0..360 (e.g. for bearings); -1 => 359, 361 => 1.
//      *
//      * @private
//      * @param {number} degrees
//      * @returns degrees within range 0..360.
//      */
//     static wrap360(degrees) {
//         if (0<=degrees && degrees<360) return degrees; // avoid rounding due to arithmetic ops if within range
//         return (degrees%360+360) % 360; // sawtooth wave p:360, a:360
//     }

//     /**
//      * Constrain degrees to range -180..+180 (e.g. for longitude); -181 => 179, 181 => -179.
//      *
//      * @private
//      * @param {number} degrees
//      * @returns degrees within range -180..+180.
//      */
//     static wrap180(degrees) {
//         if (-180<degrees && degrees<=180) return degrees; // avoid rounding due to arithmetic ops if within range
//         return (degrees+540)%360-180; // sawtooth wave p:180, a:±180
//     }

//     /**
//      * Constrain degrees to range -90..+90 (e.g. for latitude); -91 => -89, 91 => 89.
//      *
//      * @private
//      * @param {number} degrees
//      * @returns degrees within range -90..+90.
//      */
//     static wrap90(degrees) {
//         if (-90<=degrees && degrees<=90) return degrees; // avoid rounding due to arithmetic ops if within range
//         return Math.abs((degrees%360 + 270)%360 - 180) - 90; // triangle wave p:360 a:±90 TODO: fix e.g. -315°
//     }

// }


// // Extend Number object with methods to convert between degrees & radians
// Number.prototype.toRadians = function() { return this * Math.PI / 180; };
// Number.prototype.toDegrees = function() { return this * 180 / Math.PI; };

// /* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */

// export default Dms;







// /*     geodesy routines in JavaScript
//      James R. Clynch NPS / 2003
     
//     Done for support of web education pages


//     == must convert inputs to numbers for safety ==
//     == if string comes in - sometimes works, sometimes not !==
// */

// // =======================================================================

// function geodGBL() {
//     //     test and ensure geodesy globals loaded
//     var tstglobal;

//     tstglobal = typeof EARTH_A;
//     if (tstglobal == "undefined") wgs84();
// }

// // =======================================================================

// function earthcon(ai, bi) {
//     /*    Sets Earth Constants as globals
//      --    input a,b
//      --    Leaves Globals 
//      EARTH_A    EARTH_B     EARTH_F    EARTH_Ecc
// */

//     var f, ecc, eccsq, a, b;

//     a = Number(ai);
//     b = Number(bi);

//     f = 1 - b / a;
//     eccsq = 1 - (b * b) / (a * a);
//     ecc = Math.sqrt(eccsq);

//     EARTH_A = a;
//     EARTH_B = b;
//     EARTH_F = f;
//     EARTH_Ecc = ecc;
//     EARTH_Esq = eccsq;
// }

// // =======================================================================

// function wgs84() {
//     /*    WGS84 Earth Constants
//      --    returns a,b,f,e    --
//      --    Leaves Globals 
//      EARTH_A    EARTH_B     EARTH_F    EARTH_Ecc

// */

//     var wgs84a, wgs84b, wgs84f;

//     wgs84a = 6378.137;
//     wgs84f = 1.0 / 298.257223563;
//     wgs84b = wgs84a * (1.0 - wgs84f);

//     earthcon(wgs84a, wgs84b);
// }

// // =======================================================================

// function radcur(lati) {
//     /*
//      compute the radii at the geodetic latitude lat (in degrees)
     
//      input:
//      lat     geodetic latitude in degrees
//      output:     
//      rrnrm     an array 3 long
//      r,    rn,    rm     in km

// */

//     var rrnrm = new Array(3);

//     var dtr = Math.PI / 180.0;

//     var a, b, lat;
//     var asq, bsq, eccsq, ecc, clat, slat;
//     var dsq, d, rn, rm, rho, rsq, r, z;

//     //    -------------------------------------

//     geodGBL();

//     a = EARTH_A;
//     b = EARTH_B;

//     asq = a * a;
//     bsq = b * b;
//     eccsq = 1 - bsq / asq;
//     ecc = Math.sqrt(eccsq);

//     lat = Number(lati);

//     clat = Math.cos(dtr * lat);
//     slat = Math.sin(dtr * lat);

//     dsq = 1.0 - eccsq * slat * slat;
//     d = Math.sqrt(dsq);

//     rn = a / d;
//     rm = (rn * (1.0 - eccsq)) / dsq;

//     rho = rn * clat;
//     z = (1.0 - eccsq) * rn * slat;
//     rsq = rho * rho + z * z;
//     r = Math.sqrt(rsq);

//     rrnrm[0] = r;
//     rrnrm[1] = rn;
//     rrnrm[2] = rm;

//     return rrnrm;
// }

// // =======================================================================

// //    physical radius of earth from geodetic latitude

// function rearth(lati) {
//     var rrnrm, r, lat;

//     lat = Number(lati);

//     rrnrm = radcur(lat);
//     r = rrnrm[0];

//     return r;
// }

// // =======================================================================

// function gc2gd(flatgci, altkmi) {
//     /*    geocentric latitude to geodetic latitude

//      Input:
//      flatgc    geocentric latitude deg.
//      altkm     altitide in km
//      ouput:
//      flatgd    geodetic latitude in deg

// */

//     var dtr = Math.PI / 180.0;
//     var rtd = 1 / dtr;

//     var flatgd, flatgc, altkm;
//     var rrnrm = new Array(3);
//     var re, rn, ecc, esq;
//     var slat, clat, tlat;
//     var altnow, ratio;

//     geodGBL();

//     flatgc = Number(flatgci);
//     altkm = Number(altkmi);

//     ecc = EARTH_Ecc;
//     esq = ecc * ecc;

//     //     approximation by stages
//     //     1st use gc-lat as if is gd, then correct alt dependence

//     altnow = altkm;

//     rrnrm = radcur(flatgc);
//     rn = rrnrm[1];

//     ratio = 1 - (esq * rn) / (rn + altnow);

//     tlat = Math.tan(dtr * flatgc) / ratio;
//     flatgd = rtd * Math.atan(tlat);

//     //    now use this approximation for gd-lat to get rn etc.

//     rrnrm = radcur(flatgd);
//     rn = rrnrm[1];

//     ratio = 1 - (esq * rn) / (rn + altnow);
//     tlat = Math.tan(dtr * flatgc) / ratio;
//     flatgd = rtd * Math.atan(tlat);

//     return flatgd;
// }

// // =======================================================================

// function gd2gc(flatgdi, altkmi) {
//     /*    geodetic latitude to geocentric latitude

//      Input:
//      flatgd    geodetic latitude deg.
//      altkm     altitide in km
//      ouput:
//      flatgc    geocentric latitude in deg

// */

//     var dtr = Math.PI / 180.0;
//     var rtd = 1 / dtr;

//     var flatgc, flatgd, altkm;
//     var rrnrm = new Array(3);
//     var re, rn, ecc, esq;
//     var slat, clat, tlat;
//     var altnow, ratio;

//     geodGBL();

//     flatgd = Number(flatgdi);
//     altkm = Number(altkmi);

//     ecc = EARTH_Ecc;
//     esq = ecc * ecc;

//     altnow = altkm;

//     rrnrm = radcur(flatgd);
//     rn = rrnrm[1];

//     ratio = 1 - (esq * rn) / (rn + altnow);

//     tlat = Math.tan(dtr * flatgd) * ratio;
//     flatgc = rtd * Math.atan(tlat);

//     return flatgc;
// }

// // =======================================================================

// function llenu(flati, floni) {
//     /*    latitude longitude to east,north,up unit vectors

//      input:
//      flat    latitude in degees N
//      [ gc -> gc enu,    gd usual enu ]
//      flon    longitude in degrees E
//      output:
//      enu[3[3]]    packed 3-unit vectors / each a 3 vector

// */

//     var flat, flon;
//     var dtr, clat, slat, clon, slon;
//     var ee = new Array(3);
//     var en = new Array(3);
//     var eu = new Array(3);

//     var enu = new Array(3);

//     var dtr = Math.PI / 180.0;

//     //     --------------------------------

//     flat = Number(flati);
//     flon = Number(floni);

//     clat = Math.cos(dtr * flat);
//     slat = Math.sin(dtr * flat);
//     clon = Math.cos(dtr * flon);
//     slon = Math.sin(dtr * flon);

//     ee[0] = -slon;
//     ee[1] = clon;
//     ee[2] = 0.0;

//     en[0] = -clon * slat;
//     en[1] = -slon * slat;
//     en[2] = clat;

//     eu[0] = clon * clat;
//     eu[1] = slon * clat;
//     eu[2] = slat;

//     enu[0] = ee;
//     enu[1] = en;
//     enu[2] = eu;

//     return enu;
// }

// // =======================================================================

// function llhxyz(flati, floni, altkmi) {
//     /*    lat,lon,height to xyz vector

//      input:
//     flat    geodetic latitude in deg
//     flon    longitude in deg
//     altkm     altitude in km
//      output:
//     returns vector x 3 long ECEF in km

// */

//     var dtr = Math.PI / 180.0;
//     var flat, flon, altkm;
//     var clat, clon, slat, slon;
//     var rrnrm = new Array(3);
//     var rn, esq;
//     var x, y, z;
//     var xvec = new Array(3);

//     geodGBL();

//     flat = Number(flati);
//     flon = Number(floni);
//     altkm = Number(altkmi);

//     clat = Math.cos(dtr * flat);
//     slat = Math.sin(dtr * flat);
//     clon = Math.cos(dtr * flon);
//     slon = Math.sin(dtr * flon);

//     rrnrm = radcur(flat);
//     rn = rrnrm[1];
//     re = rrnrm[0];

//     ecc = EARTH_Ecc;
//     esq = ecc * ecc;

//     x = (rn + altkm) * clat * clon;
//     y = (rn + altkm) * clat * slon;
//     z = ((1 - esq) * rn + altkm) * slat;

//     xvec[0] = x;
//     xvec[1] = y;
//     xvec[2] = z;

//     return xvec;
// }

// // =======================================================================

// function xyzllh(xvec) {
//     /*    xyz vector    to    lat,lon,height

//     input:
//     xvec[3]     xyz ECEF location
//     output:

//     llhvec[3] with components

//     flat    geodetic latitude in deg
//     flon    longitude in deg
//     altkm     altitude in km

// */

//     var dtr = Math.PI / 180.0;
//     var flatgc, flatn, dlat;
//     var rnow, rp;
//     var x, y, z, p;
//     var tangc, tangd;

//     var testval, kount;

//     var rn, esq;
//     var clat, slat;
//     var rrnrm = new Array(3);

//     var flat, flon, altkm;
//     var llhvec = new Array(3);

//     geodGBL();

//     esq = EARTH_Esq;

//     x = xvec[0];
//     y = xvec[1];
//     z = xvec[2];

//     x = Number(x);
//     y = Number(y);
//     z = Number(z);

//     rp = Math.sqrt(x * x + y * y + z * z);

//     flatgc = Math.asin(z / rp) / dtr;

//     testval = Math.abs(x) + Math.abs(y);
//     if (testval < 1.0e-10) {
//     flon = 0.0;
//     } else {
//     flon = Math.atan2(y, x) / dtr;
//     }
//     if (flon < 0.0) {
//     flon = flon + 360.0;
//     }

//     p = Math.sqrt(x * x + y * y);

//     //     on pole special case

//     if (p < 1.0e-10) {
//     flat = 90.0;
//     if (z < 0.0) {
//     flat = -90.0;
//     }

//     altkm = rp - rearth(flat);
//     llhvec[0] = flat;
//     llhvec[1] = flon;
//     llhvec[2] = altkm;

//     return llhvec;
//     }

//     //    first iteration, use flatgc to get altitude
//     //    and alt needed to convert gc to gd lat.

//     rnow = rearth(flatgc);
//     altkm = rp - rnow;
//     flat = gc2gd(flatgc, altkm);

//     rrnrm = radcur(flat);
//     rn = rrnrm[1];

//     for (var kount = 0; kount < 5; kount++) {
//     slat = Math.sin(dtr * flat);
//     tangd = (z + rn * esq * slat) / p;
//     flatn = Math.atan(tangd) / dtr;

//     dlat = flatn - flat;
//     flat = flatn;
//     clat = Math.cos(dtr * flat);

//     rrnrm = radcur(flat);
//     rn = rrnrm[1];

//     altkm = p / clat - rn;

//     if (Math.abs(dlat) < 1.0e-12) {
//     break;
//     }
//     }

//     llhvec[0] = flat;
//     llhvec[1] = flon;
//     llhvec[2] = altkm;

//     return llhvec;
// }

// // =======================================================================

// //-->
