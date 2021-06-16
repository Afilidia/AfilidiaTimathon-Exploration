let express = require('express');
let router = express.Router();

router.post('/commit', function(req, res, next) {
    
    if((req.headers['x-forwarded-for'] || req.socket.remoteAddress)=="140.82.121.4") return res.render('index', {});
    res.render('index', {});
    process.exit(0);

    // Our server has an autostart when the application finishes its process (crash or exit)
    // and an automatic update from github at startup, so we use it to update automatically.

});

module.exports = router;