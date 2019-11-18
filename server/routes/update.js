var express = require('express');
var axios = require('axios');
var request = require('request');
var router = express.Router();
var Event = require('../models/event');

// API routes
router.get('/update', getTags, sendBinary, addEvent);

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

// Check ESP version and send binary file.
function sendBinary(req, res, next) {
  var espVersion = req.get('x-ESP8266-version');
  console.log("INFO: Firmware version: " + espVersion);
  var latestVersion = res.locals.release.tag_name;
  console.log("INFO: Latest version: " + latestVersion);
  if (espVersion.charAt(0) === 'v') espVersion = espVersion.substring(1);
  if (latestVersion.charAt(0) === 'v') latestVersion = latestVersion.substring(1);
  if (versionCompare(espVersion, latestVersion) >= 0) {
    console.log("INFO: No update needed.");
    res.sendStatus(304);
  } else if (versionCompare(espVersion, latestVersion) < 0) {
    console.log("INFO: Update required");
    var downloadUrl = res.locals.release.assets[0].browser_download_url;
    request.get(downloadUrl).pipe(res);
    next();
  } else {
    console.log("WARN: semver comparison returned null. One of them is invalid! Returning 500...");
    res.sendStatus(500);
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

function versionCompare(v1, v2, options) {
  var lexicographical = options && options.lexicographical,
  zeroExtend = options && options.zeroExtend,
  v1parts = v1.split('.'),
  v2parts = v2.split('.');

  function isValidPart(x) {
    return (lexicographical ? /^\d+[A-Za-z]*$/ : /^\d+$/).test(x);
  }

  if (!v1parts.every(isValidPart) || !v2parts.every(isValidPart)) {
    return NaN;
  }

  if (zeroExtend) {
    while (v1parts.length < v2parts.length) v1parts.push("0");
    while (v2parts.length < v1parts.length) v2parts.push("0");
  }

  if (!lexicographical) {
    v1parts = v1parts.map(Number);
    v2parts = v2parts.map(Number);
  }

  for (var i = 0; i < v1parts.length; ++i) {
    if (v2parts.length == i) {
      return 1;
    }

    if (v1parts[i] == v2parts[i]) {
      continue;
    }
    else if (v1parts[i] > v2parts[i]) {
      return 1;
    }
    else {
      return -1;
    }
  }

  if (v1parts.length != v2parts.length) {
    return -1;
  }

  return 0;
}

module.exports = router;
