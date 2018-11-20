var express = require('express');
var router = express.Router();

// API routes
router.get('/time', getTime);

// Get time
function getTime(req, res) {
  res.json({'time': Math.floor(new Date() / 1000)});
}

module.exports = router;
