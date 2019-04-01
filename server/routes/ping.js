var express = require('express');
var router = express.Router();
var Event = require('../models/event');
var Feeder = require('../models/feeder');

// API routes
router.post('/ping', getFeederId, addEvent, updateLastPing);

// Get Feeder ID from stub
function getFeederId(req, res, next) {
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
      res.locals.timestamp = String(Math.floor(new Date() / 1000));
      next();
    }
  });
}

// Add new event
function addEvent(req, res, next) {
  var ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  var pingType = 'ping';
  if (req.body.type == 'powerup') {
    pingType = 'powerup';
  } else if (req.body.type == 'lowbattery') {
    pingType = 'lowbattery';
  }
  var newEvent = new Event({
    type: pingType,
    ip: ipAddress,
    datetime: res.locals.timestamp
  });
  newEvent.save((err, event) => {
    if (err) {
      res.json({'ERROR': err});
    } else if (!event) {
      console.log("ERROR: No event object returned upon save.");
    } else {
      event.addFeeder(res.locals.feeder_id).then((_event) => {
        if (pingType == 'ping') {
          console.log("INFO: Added ping event.");
        } else if (pingType == 'powerup') {
          console.log("INFO: Added powerup event");
        }
        next();
      });
    }
  });
}

// Update lastPing
function updateLastPing(req, res) {
  Feeder.findById(res.locals.feeder_id, (err, feeder) => {
    feeder.lastPing = res.locals.timestamp;
    if (req.body.lastPing) feeder.lastPing = req.body.lastPing;
    feeder.save((err) => {
      if (err) {
        res.json({'ERROR': err});
      } else {
        console.log("INFO: Updated feeder lastPing.");
        res.json({'UPDATED': feeder});
      }
    });
  });

}

module.exports = router;
