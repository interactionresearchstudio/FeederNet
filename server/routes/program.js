var express = require('express');
var router = express.Router();
var esptool = require('esptool-wrapper');

// API routes
router.get('/program', program);

// Get all events
function program(req, res) {
  console.log("Attempting programming...");
  esptool({
    chip: 'esp8266',
    port: '/dev/ttyUSB0',
    baud: 115200,
    files: {
      0x00000: __dirname + '/blink.bin'
    }
  }, (err) => {
    if (err) {
      console.log("ERROR!!!");
      console.log(err);
      res.json({'ERROR': err});
    }
    console.log("Programming successful.");
    res.json({'SUCCESS': "Programming successful."});
  });
}

module.exports = router;
