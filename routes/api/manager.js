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
getOpenskyData = () => {
    let data = {};
    data.states = getOpensky("/states/all");
    setTimeout(() => {
        data.flights = getOpensky("/flights/all");
    }, 5000);
    // data.tracks = getOpensky("/tracks");
    return data;
}
getOpensky = (path) => {
	this.options = {};
    this.options.method = 'GET';
    this.options.hostname = `https://${openskyAuth.user}:${openskyAuth.pass}@opensky-network.org/api${path}`;
    this.options.headers = {
        'Accept': 'application/json'
    };
    
    let self = this;

    return new Promise(function(resolve, reject) {
        fetch(self.options.hostname).then(res => res.text())
        .then(res => {console.log(res); return res})
        .then(res => res.json())
        .then(res => resolve(res));
    }).catch((err) => {console.log(err)});
}
// let openskyData = getOpenskyData();
// setInterval(async ()=>{
//     let data = await getOpenskyData();
//     openskyData = data;
// }, 30000)
// console.log(openskyData);

host.page("/ok", "ok", ()=>{return true;}, "/", true);
host.customPage("/api/opensky/get-data", ()=>{return true;}, "/", (req, res, next) => {
    res.json(openskyData)
}, true);
host.customPage("/api/github/commit", (req, res, next)=>{if((req.headers['x-forwarded-for'] || req.socket.remoteAddress)=="140.82.121.4"||(req.headers['x-forwarded-for'] || req.socket.remoteAddress)=="::ffff:140.82.115.155") return true;}, "/api/ok", (req, res, next)=>{
    
    res.render('ok', {});
    process.exit(0);

    // Our server has an autostart when the application finishes its process (crash or exit)
    // and an automatic update from github at startup, so we use it to update automatically.

}, true, "post");

module.exports = router;