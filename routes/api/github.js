let express = require('express');
let router = express.Router();
let crypto = require('crypto');

router.get('/commit', function(req, res, next) {
    if(req.header['x-hub-signature'] != "sha1=" + crypto.createHmac('sha1', process.env.GITHUBSECRET||"T9QJVrfatKB9uYKxe4dKtWiiq2vAUpxUZSmTYPeG").update(chunk.toString()).digest('hex')) return res.send("ok");
    res.send("ok");
    process.exit(0);
    //Our server has an autostart when the application finishes its process (crash or exit) and an automatic update from github at startup, so we use it to update automatically.
});

module.exports = router;