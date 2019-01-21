var express = require('express');
var path = require('path');
var router = express.Router();

router.get('/*', (req, res, next) => {
    console.log('INFO: GET admin.');
    res.sendFile(path.join(__dirname, '../../../admin-client/build/index.html'));
});

module.exports = router;
