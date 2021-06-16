let express = require('express');
let router = express.Router();

router.post('/commit', function(req, res, next) {
    if (req.body.secret == "T9QJVrfatKB9uYKxe4dKtWiiq2vAUpxUZSmTYPeG")
    res.status(200);
    process.exit(0);
    //Our server has an autostart when the application finishes its process (crash or exit) and an automatic update from github at startup, so we use it to update automatically.
});

module.exports = router;