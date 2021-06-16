let express = require('express');
let router = express.Router();

router.post('/commit', function(req, res, next) {
    console.log(body)
    res.status(200);
    process.exit(0);
    //Our server has an autostart when the application finishes its process (crash or exit) and an automatic update from github at startup, so we use it to update automatically.
});

module.exports = router;