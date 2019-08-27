var express = require('express');
var router = express.Router();
const esptool = require("esptool-wrapper");


// API routes
router.get('/upload',upload);




function upload(req,res){
   
    esptool({
  chip: "esp8266",
  port: "/dev/tty.usbserial-A700eM8o",
  baud: 460800,
  files: {
    0x0000: "/var/folders/zb/m73fl1w946b2_7p1ywmftzk00000gn/T/arduino_build_921874/Blink.ino.bin"
  }
  }, (err) => {
    if(err) throw err; // hopefully I tell you *WHAT* went wrong
    console.log("Nothing went wrong!");
  });  

}

module.exports = router;
