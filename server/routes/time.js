var express = require('express');
var router = express.Router();
var axios = require('axios');
var { getSunrise, getSunset } = require('sunrise-sunset-js');
var { exec } = require('child_process');
var Feeder = require('../models/feeder');
var auth = require('./auth');

// API routes
router.get('/time', getTime);
router.get('/time/sunrisesunset', getFeederLocation, getSunriseSunset);
router.post('/time/set', auth.isLoggedIn, setSystemTime);

// Get time
function getTime(req, res) {
  var newDate = new Date();
  if (isDaylightSavingTime(newDate)) {
    console.log("INFO: Compensating for daylight saving time.");
    res.json({'time': Math.floor(newDate.getTime() / 1000) + 3600000});
  } else {
    res.json({'time': Math.floor(newDate.getTime() / 1000)});
  }
}

// Get sunrise / sunset and send to feeder
function getSunriseSunset(req, res) {
  var sunrise = getSunrise(parseInt(res.locals.feeder_location.latitude), parseInt(res.locals.feeder_location.longitude));
  var sunset = getSunset(parseInt(res.locals.feeder_location.latitude), parseInt(res.locals.feeder_location.longitude));
  console.log('INFO: Sunrise: ' + sunrise + ' | Sunset: ' + sunset);

  res.json({
    'sunrise': {
      'hour': sunrise.getHours(),
      'minute': sunrise.getMinutes()
    },
    'sunset': {
      'hour': sunset.getHours(),
      'minute': sunset.getMinutes()
    }
  });
}

// Set system time
function setSystemTime(req, res) {
  if (req.body.time) {
    console.log('INFO: System time requested with time string ' + req.body.time);
    exec('date -s "' + req.body.time + '" && hwclock -w', (err, stdout, stderr) => {
      console.log(`stdout: ${stdout}`);
      console.log(`stderr: ${stderr}`);
      if (err) {
        console.log('ERROR: Request to time server failed.');
        console.log(err);
        res.status(500).json({'ERROR': "Internal request to time server failed."});
      } else {
        console.log('INFO: System time changed by user client.');
        res.json({"SUCCESS": req.body.time});
      }
    });
  } else {
    res.status(400).json({'ERROR': "Bad request. No time provided."});
  }
}

function getFeederLocation(req, res, next) {
  Feeder.findOne({stub: req.body.stub})
  .exec((err, feeder) => {
    if (err) {
      res.json({'ERROR': err});
    } else if (!feeder) {
      console.log("ERROR: Feeder stub " + req.body.stub + " not found.");
      res.send(400);
    } else {
      console.log("INFO: Found feeder in DB.");
      res.locals.feeder_id = feeder._id;
      res.locals.feeder_name = feeder.name;
      res.locals.feeder_location = feeder.location;
      next();
    }
  });
}

function isDaylightSavingTime(d) {
    let jan = new Date(d.getFullYear(), 0, 1).getTimezoneOffset();
    let jul = new Date(d.getFullYear(), 6, 1).getTimezoneOffset();
    return Math.max(jan, jul) != d.getTimezoneOffset();
}

module.exports = router;
