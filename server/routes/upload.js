var express = require('express');
var router = express.Router();
const esptool = require("esptool-wrapper");


// API routes
router.get('/upload',upload);




function upload(req,res){
 
    esptool({
  chip: "esp8266",
  port: "/dev/ttyAMA0",
  baud: 115200,
  files: {
    0x0000: "build/blink.bin"
  }
  }, (err) => {
    if(err) res.json({"ERROR":err});
    else{ // hopefully I tell you *WHAT* went wrong
    console.log("Nothing went wrong!");
    res.json({"SUCCESS":"success"});
  }
  });  

}

module.exports = router;
