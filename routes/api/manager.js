require('dotenv').config();
let fetch = require('node-fetch');

let express = require('express');
let router = express.Router();

let Host = require('../../host');
let host = new Host(router);

let openskyAuth = {
    user: process.env.OPENSKYUSERNAME,
    pass: process.env.OPENSKYPASSWORD
}
getOpenskyData = async () => {
/*
0	icao24	string	Unique ICAO 24-bit address of the transponder in hex string representation.
1	callsign	string	Callsign of the vehicle (8 chars). Can be null if no callsign has been received.
2	origin_country	string	Country name inferred from the ICAO 24-bit address.
3	time_position	int	Unix timestamp (seconds) for the last position update. Can be null if no position report was received by OpenSky within the past 15s.
4	last_contact	int	Unix timestamp (seconds) for the last update in general. This field is updated for any new, valid message received from the transponder.
5	longitude	float	WGS-84 longitude in decimal degrees. Can be null.
6	latitude	float	WGS-84 latitude in decimal degrees. Can be null.
7	baro_altitude	float	Barometric altitude in meters. Can be null.
8	on_ground	boolean	Boolean value which indicates if the position was retrieved from a surface position report.
9	velocity	float	Velocity over ground in m/s. Can be null.
10	true_track	float	True track in decimal degrees clockwise from north (north=0°). Can be null.
11	vertical_rate	float	Vertical rate in m/s. A positive value indicates that the airplane is climbing, a negative value indicates that it descends. Can be null.
12	sensors	int[]	IDs of the receivers which contributed to this state vector. Is null if no filtering for sensor was used in the request.
13	geo_altitude	float	Geometric altitude in meters. Can be null.
14	squawk	string	The transponder code aka Squawk. Can be null.
15	spi	boolean	Whether flight status indicates special purpose indicator.
16	position_source	int	Origin of this state’s position: 0 = ADS-B, 1 = ASTERIX, 2 = MLAT
*/
    let data = {states: []};
    try {
        let fulldata = await getOpensky("/states/all");
        fulldata.states.filter(state => !state[8]&&state[0]&&state[3]&&state[14]&&state[1]!="").forEach(state => {
            data.states.push({
                icao24: state[0],
                origin: state[2],
                long: state[5],
                lat: state[6],
                alt: state[7],
            })
        });
        data.statesCount = data.states.length;
    } catch (error) {
        return false;
    }
    // data.tracks = getOpensky("/tracks");
    return data || false;
}
getOpensky = async (path) => {
	this.options = {};
    this.options.method = 'GET';
    this.options.hostname = `https://${openskyAuth.user}:${openskyAuth.pass}@opensky-network.org/api${path}`;
    this.options.headers = {
        'Accept': 'application/json'
    };
    
    let self = this;

    return await new Promise(function(resolve, reject) {
        fetch(self.options.hostname)
        .then(res => res.json())
        .then(res => resolve(res));
    }).catch((err) => {console.log(err)});
}
let openskyData = require("../../stateexample.json");
// setTimeout(async ()=>{
//     if(!openskyData){
//         let data = await getOpenskyData();
//         openskyData = data;
//     }
// }, 1);
// setInterval(async ()=>{
//     if(!openskyData){
//         let data = await getOpenskyData();
//         openskyData = data;
//     }
// }, 30000)

host.page("/ok", "ok", ()=>{return true;}, "/", true);
host.customPage("/api/opensky/get-data", ()=>{return true;}, "/", (req, res, next) => {
    res.json(openskyData)
}, true);
host.customPage("/api/github/commit", (req, res, next)=>{if((req.headers['x-forwarded-for'] || req.socket.remoteAddress)=="140.82.115.155"||(req.headers['x-forwarded-for'] || req.socket.remoteAddress)=="::ffff:140.82.115.155") return true;}, "/api/ok", (req, res, next)=>{
    
    res.render('ok', {});
    process.exit(0);

    // Our server has an autostart when the application finishes its process (crash or exit)
    // and an automatic update from github at startup, so we use it to update automatically.

}, true, "post");

module.exports = router;