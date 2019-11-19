var express = require('express');
var router = express.Router();
var esptool = require('esptool-wrapper');
var request = require('request');
var tmp = require('tmp');
var fs = require('fs');

// API routes
router.get('/program', getTags, saveBinary);

// Get available tags from GitHub repository.
function getTags(req, res, next) {
  axios.get('https://api.github.com/repos/interactionresearchstudio/RFIDBirdFeeder/releases/latest')
  .then(response => {
    console.log("Latest release tag: " + response.data.tag_name + " | Asset URL: " + response.data.assets[0].browser_download_url);
    res.locals.release = response.data;
    next();
  })
  .catch(error => {
    console.log("ERROR: Could not retrieve tags from firmware repo.");
    console.log(error);
    res.sendStatus(500);
  });
}

// Check ESP version and send binary file to esptool.
function sendBinary(req, res, next) {
  var downloadUrl = res.locals.release.assets[0].browser_download_url;
  tmp.file((err, path, fd) => {
    if (err) {
      console.log("ERROR: Could not create temporary file for binary.");
      re.sendStatus(500);
    }
    console.log("File path: " + path);
    res.locals.binaryPath = path;
    var stream = request.get(downloadUrl).pipe(fs.createWriteStream(path));
    stream.on('finish', () => {
      program(path, '/dev/ttyUSB0', (err) => {
        if (err) {
          console.log("ERROR: esptool error.");
          console.log(err);
          res.json({'ERROR': err});
        }
        res.json({'SUCCESS': 'Program sent to esp8266 successfully'});
      });
    });
  });
}

// Program device with firmware
function program(path, port, callback) {
  console.log("Attempting programming...");
  esptool({
    chip: 'esp8266',
    port: port,
    baud: 115200,
    files: {
      0x00000: path
    }
  }, (err) => {
    if (err) {
      callback(err);
    }
    console.log("INFO: Programming successful.");
    callback();
  });
}

module.exports = router;
