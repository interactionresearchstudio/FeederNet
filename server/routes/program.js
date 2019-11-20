const express = require('express');
const router = express.Router();
const esptool = require('esptool-wrapper');
const request = require('request');
const tmp = require('tmp');
const fs = require('fs');
const axios = require('axios');
const SerialPort = require('serialport');
const port = new SerialPort('/dev/ttyUSB0', {autoOpen=false, baudRate=115200});

// API routes
router.post('/program', getTags, sendBinary);
router.post('/configure', configureDevice);

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

// Configure device with WiFi credentials
function configureDevice(req, res) {
  port.open((err) => {
    if (err) {
      console.log("ERROR: Could not open serial port.");
      console.log(err);
      res.sendStatus(500);
    }
    port.on('data', (data) => {
      console.log(data);
      if (data.includes('\r\n')) {
        port.write('W' + process.env.WIFI_NAME + '\r' + process.env.WIFI_PASS + '\r', (_err) => {
          if (_err) {
            console.log("ERROR: Could not write to serial port.");
            console.log(_err);
            res.sendStatus(500);
          }
          port.close((__err) => {
            if (__err) {
              console.log("ERROR: Could not close serial port.");
              console.log(__err);
              res.sendStatus(500);
            }
            res.json({'SUCCESS': 'Program sent to esp8266 successfully'});
          });
        });
      }
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
