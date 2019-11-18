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
    port: '/dev/tty.usbserial-AI05DMZP',
    baud: 115200,
    files: {
      0x00000: __dirname + '/app.bin'
    }
  }, (err) => {
    if (err) {
      console.log("ERROR!!!");
      console.log(err);
    }
    console.log("Programming successful.");
  });
}

module.exports = router;
