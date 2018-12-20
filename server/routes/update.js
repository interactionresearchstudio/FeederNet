var express = require('express');
var axios = require('axios');
var semverSort = require('semver-sort');
var request = require('request');
var router = express.Router();
var Event = require('../models/event');

// API routes
router.get('/update', getTags, sendBinary, addEvent);

// Get available tags from GitHub repository.
function getTags(req, res, next) {
  axios.get('https://api.github.com/repos/interactionresearchstudio/RFIDBirdFeeder/git/refs/tags')
  .then(response => {
    semverSort.desc(response.data.map((tag) => {
      return tag.ref;
    }));
    res.locals.tags = response.data;
    next();
  })
  .catch(error => {
    console.log("ERROR: Could not retrieve tags from firmware repo.");
    console.log(error);
    res.sendStatus(500);
  });
}

// Check ESP version and send binary file.
function sendBinary(req, res, next) {
  var espVersion = req.get('x-ESP8266-version');
  console.log("INFO: Firmware version: " + espVersion);
  var latestVersion = res.locals.tags[0].ref.substr(res.locals.tags[0].ref.lastIndexOf('/') + 1);
  console.log("INFO: Latest version: " + latestVersion);
  if (espVersion == latestVersion) {
    console.log("INFO: No update needed.");
    res.sendStatus(304);
  } else {
    console.log("INFO: Update required");
    var downloadUrl =
      "https://github.com/interactionresearchstudio/RFIDBirdFeeder/releases/download/" +
      latestVersion +
      "/RFIDBirdFeeder.ino.adafruit.bin";
    request.get(downloadUrl).pipe(res);
    next();
  }
}

// Add new event
function addEvent(req, res) {
  var ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  var newEvent = new Event({
    type: "update-" + req.get('x-ESP8266-STA-MAC'),
    ip: ipAddress,
    datetime: String(Math.floor(new Date() / 1000))
  });
  newEvent.save((err) => {
    if (err) {
      res.json({'ERROR': err});
    } else {
      console.log("INFO: Added update event");
    }
  });
}

module.exports = router;
