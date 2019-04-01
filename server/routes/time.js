var express = require('express');
var router = express.Router();
var axios = require('axios');
var Feeder = require('../models/feeder');

// API routes
router.get('/time', getTime);
router.get('/time/sunrisesunset', getFeederLocation, getSunriseSunset);

// Get time
function getTime(req, res) {
  res.json({'time': Math.floor(new Date() / 1000)});
}

// Get sunrise / sunset and send to feeder
function getSunriseSunset(req, res) {
  var locationRequest = 'lat=' + res.locals.feeder_location.latitude +
    '&lng=' + res.locals.feeder_location.longitude +
    '&date=today';
  console.log("INFO: Request: " + 'https://api.sunrise-sunset.org/json?' + locationRequest);
  axios.get('https://api.sunrise-sunset.org/json?' + locationRequest)
    .then((response) => {
      var sunrise = response.data.results.sunrise;
      var sunset = response.data.results.sunset;
      console.log('INFO: Sunrise: ' + sunrise + ' | Sunset: ' + sunset);
      res.json({
        'sunrise': {
          'hour': parseInt(sunrise.substring(0, 1)),
          'minute': parseInt(sunrise.substring(sunrise.indexOf(':') + 1, sunrise.indexOf(':') + 3))
        },
        'sunset': {
          'hour': parseInt(sunset.substring(0, 1)) + 12,
          'minute': parseInt(sunset.substring(sunrise.indexOf(':') + 1, sunrise.indexOf(':') + 3))
        }
      });
    })
    .catch((error) => {
      console.log("WARNING: Requesting sunrise/sunset times failed. Error: " + error);
      res.json({
        'sunrise': {
          'hour': 6,
          'minute': 0
        },
        'sunset': {
          'hour': 18,
          'minute': 0
        }
      });
    });
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

module.exports = router;
