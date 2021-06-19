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
    let data = {states: []};
    let fulldata = await getOpensky("/states/all");
    fulldata.states.filter(state => !state[8]&&state[0]&&state[3]&&state[14]&&state[1]!=""&&state[2]=="United States").forEach(state => {
        data.states.push({
            x: state.x,
            y: state.y,
            z: state.z,
        })
    });
    // data.tracks = getOpensky("/tracks");
    return data;
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
let openskyData = getOpenskyData();
// setInterval(async ()=>{
//     let data = await getOpenskyData();
//     openskyData = data;
// }, 30000)
console.log(openskyData);

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