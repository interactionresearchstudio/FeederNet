const express = require('express');
const router = express.Router();
const esptool = require('esptool-wrapper');
const request = require('request');
const tmp = require('tmp');
const fs = require('fs');
const axios = require('axios');
const SerialPort = require('serialport');
const Ready = require('@serialport/parser-ready');
const ReadLine = require('@serialport/parser-readline');
const port = new SerialPort('/dev/ttyUSB0', {autoOpen: false, baudRate: 115200});

// API routes
router.post('/program', getTags, sendBinary);
router.post('/configure', configureDevice);
router.post('/register', getDeviceMacAddress, addFeeder);

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
    const parser = port.pipe(new Ready({ delimiter: 'ready' }));
    console.log("INFO: Serial port opened.");
    parser.on('ready', () => {
      console.log("INFO: Received ready sequence.");
      setTimeout(() => {
        port.write('W' + process.env.WIFI_NAME + '\r' + process.env.WIFI_PASS + '\r', (_err) => {
          console.log('INFO: Wrote ' + 'W' + process.env.WIFI_NAME + '|' + process.env.WIFI_PASS  + ' to serial port.');
          if (_err) {
            console.log("ERROR: Could not write to serial port.");
            console.log(_err);
            res.sendStatus(500);
          }
          port.close((__err) => {
            console.log("INFO: Closed serial port.");
            if (__err) {
              console.log("ERROR: Could not close serial port.");
              console.log(__err);
              res.sendStatus(500);
            }
            res.json({'SUCCESS': 'Program sent to esp8266 successfully'});
          });
        });
      }, 2000);
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

// Register device with database
function getDeviceMacAddress(req, res, next) {
  port.open((err) => {
    if (err) {
      console.log("ERROR: Could not open serial port.");
      console.log(err);
      res.sendStatus(500);
    }
    console.log("INFO: Device registration - Waiting for MAC address from device...");
    const parser = port.pipe(new ReadLine({delimiter: '\r\n'}));
    parser.on('data', (data) => {
      console.log("INFO: Data received from port: " + data);
      const macAddress = getMacFromString(data);
      if (macAddress != null) {
        console.log("INFO: Mac address " + macAddress[0] + " received.");
        res.locals.macAddress = macAddress[0];
        port.close((_err) => {
          if (_err) {
            console.log("ERROR: Could not close serial port.");
            console.log(__err);
            res.status(500);
            res.json({'ERROR': err});
          }
          console.log("INFO: Closed serial port.");
          next();

        });
      }
    });
  });
}

// Add new feeder
function addFeeder(req, res) {
  const isRegistered = isFeederRegistered(res.locals.macAddress);
  if (isRegistered === false) {
    var newFeeder = new Feeder({
        stub: res.locals.macAddress,
        name: res.locals.macAddress
    });
    newFeeder.save((err) => {
        if (err) {
          res.status(500);
          res.json({'ERROR': err});
        } else {
          res.json({'SUCCESS': newFeeder});
        }
    });
  } else if (isRegistered === true) {
    res.status(304);
    res.json({'NOCHANGE': 'Feeder already registered.'});
  } else if (isRegistered === null) {
    res.status(500);
    res.json({'ERROR': 'Error searching for feeder.'});
  }
}

// Get Feeder ID from stub
function isFeederRegistered(stub) {
  Feeder.findOne({stub: stub})
  .exec((err, feeder) => {
    if (err) {
      console.log(err);
      return null;
    } else if (!feeder) {
      console.log("INFO: Feeder stub " + req.body.stub + " not found.");
      return false;
    } else {
      console.log("INFO: Found feeder in DB.");
      return true;
    }
  });
}

function getMacFromString(s) {
  const rx = /((?:(\d{1,2}|[a-fA-F]{1,2}){2})(?::|-*)){6}/;
  return rx.exec(s);
}

module.exports = router;
