var express = require('express');
var router = express.Router();
var Waypoint = require('../models/waypoint');
var Bird = require('../models/bird');
var Feeder = require('../models/feeder');
var Event = require('../models/event');

// API routes
router.post('/recordTrack', getBirdId, getFeederId, addWaypoint, updateLastReportedRssi, addEvent);

// Get bird ID from RFID.
function getBirdId(req, res, next) {
  Bird.findOne({rfid: req.body.rfid})
  .exec((err, bird) => {
    if (err) {
      console.log("ERROR: Could not search.");
      res.json({'ERROR': err});
    } else if (!bird) {
      console.log("INFO: Bird not found. Creating new one.");
      var newBird = new Bird({
        rfid: req.body.rfid,
        name: 'Unknown Bird'
      });
      newBird.save((err, data) => {
        if (err) {
          res.json({'ERROR': err});
          console.log("ERROR: Could not save new bird.");
        } else {
          console.log("INFO: Created new bird with ID " + String(data.id));
          res.locals.bird_id = data.id;
          next();
        }
      });
    } else {
      console.log("INFO: Found bird in DB.");
      res.locals.bird_id = bird._id;
      next();
    }
  });
}

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
      next();
    }
  });
}

// Add new waypoint
function addWaypoint(req, res, next) {
	res.locals.timestamp = "";
	if (req.body.datetime == "" || req.body.datetime == " ") {
		res.locals.timestamp = String(Math.floor(new Date() / 1000));
    res.locals.eventType = "";
	} else {
		res.locals.timestamp = req.body.datetime;
    res.locals.eventType = '-cached';
	}
    var newWaypoint = new Waypoint({
        datetime: res.locals.timestamp
    });
    newWaypoint.save((err, waypoint) => {
        if (err) {
            res.json({'ERROR': err});
        } else if (!waypoint) {
            res.send(400);
        } else {
            waypoint.addBird(res.locals.bird_id).then((_waypoint) => {
                _waypoint.addFeeder(res.locals.feeder_id).then((__waypoint) => {
                    next();
                });
            });
        }
    });
}

// Add new event
function addEvent(req, res) {
    console.log('Add event');
    var ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    var newEvent = new Event({
        type: 'recordTrack' + res.locals.eventType,
        ip: ipAddress,
        datetime: res.locals.timestamp
    });
    newEvent.save((err) => {
        if (err) {
            res.json({'ERROR': err});
        } else {
          newEvent.addFeeder(res.locals.feeder_id).then((_event) => {
            console.log("INFO: Added recordTrack event.");
            res.json({'SUCCESS': newEvent});
          });
        }
    });
}

// Update last reported RSSI
function updateLastReportedRssi(req, res, next) {
  Feeder.findById(res.locals.feeder_id, (err, feeder) => {
    feeder.lastReportedRssi = req.body.rssi;
    feeder.save((err) => {
      if (err) {
        res.json({'ERROR': err});
      } else {
        console.log("INFO: Updated feeder RSSI to " + req.body.rssi);
        next();
      }
    });
  });
}

module.exports = router;
