var express = require('express');
var router = express.Router();
var Waypoint = require('../models/waypoint');
var Bird = require('../models/bird');
var Feeder = require('../models/feeder');
var Event = require('../models/event');

// API routes
router.post('/recordTrack', getBirdAndFeederId, addWaypoint, addEvent);

// Get bird ID from RFID and feeder ID from stub
function getBirdAndFeederId(req, res, next) {
    Bird.findOne({rfid: req.body.rfid})
    .exec((err, bird) => {
        if (err) {
            res.json({'ERROR': err});
        } else if (!bird) {
            res.send(400);
        } else {
            Feeder.findOne({stub: req.body.stub})
            .exec((err, feeder) => {
                if (err) {
                    res.json({'ERROR': err});
                } else if (!feeder) {
                    res.send(400);
                } else {
                    res.locals.bird_id = bird._id;
                    res.locals.feeder_id = feeder._id;
                    next();
                }
            });
        }
    });
}

// Add new waypoint
function addWaypoint(req, res, next) {
	res.locals.timestamp = "";
	if (req.body.datetime == "" || req.body.datetime == " ") {
		res.locals.timestamp = String(Math.floor(new Date() / 1000));
	} else {
		res.locals.timestamp = req.body.datetime;
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
        type: 'recordTrack',
        ip: ipAddress,
        datetime: res.locals.timestamp
    });
    newEvent.save((err) => {
        if (err) {
            res.json({'ERROR': err});
        } else {
            res.json({'SUCCESS': newEvent});
        }
    });
}

module.exports = router;
