let express = require('express');
let router = express.Router();

let Host = require('../../host');
let host = new Host(router);

host.page("/ok", "ok", ()=>{return true;}, "/", true)
host.customPage("/api/github/commit", "ok", (req, res, next)=>{if((req.headers['x-forwarded-for'] || req.socket.remoteAddress)=="140.82.121.4") return true;}, "/api/ok", (req, res, next)=>{
    
    res.render('ok', {});
    process.exit(0);

    // Our server has an autostart when the application finishes its process (crash or exit)
    // and an automatic update from github at startup, so we use it to update automatically.

}, true, "post");

module.exports = router;