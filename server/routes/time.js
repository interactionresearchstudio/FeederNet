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
      console.log('INFO: Sunrise: ' + response.data.results.sunrise + ' | Sunset: ' + response.data.results.sunset);
      res.json({
        'sunrise': response.data.results.sunrise.substring(0, 1),
        'sunset': parseInt(response.data.results.sunset.substring(0, 1)) + 12
      });
    })
    .catch((error) => {
      console.log("WARNING: Requesting sunrise/sunset times failed. Error: " + error);
      res.json({
        'sunrise': '6',
        'sunset': '18'
      });
    });
}

function getFeederLocation(req, res, next) {
  Feeder.findOne({stub: req.body.stub})
  .exec((err, feeder) => {
    if (err) {
      res.json({'ERROR': err});
    } else if (!feeder) {
      console.log("ERROR: Feeder stub not found.");
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
