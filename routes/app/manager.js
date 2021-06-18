let express = require('express');
let router = express.Router();

let Host = require('../../host');
let host = new Host(router);

host.pager('/app', 'app/', ()=>{return true;}, "/", true)

module.exports = router;