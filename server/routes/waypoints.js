var express = require('express');
var router = express.Router();
var Waypoint = require('../models/waypoint');
var auth = require('./auth');

// API routes
router.get('/waypoints', auth.isLoggedIn, findAllWaypoints);
router.get('/waypoints/:offset/:limit', auth.isLoggedIn, findPaginatedWaypoints);
router.get('/waypoint/:id', auth.isLoggedIn, findWaypointById);
router.post('/waypoints', auth.isLoggedIn, addWaypoint);
router.delete('/waypoint/:id', auth.isLoggedIn, deleteWaypoint);

// Get all waypoints
function findAllWaypoints(req, res) {
    Waypoint.find()
    .populate('bird')
    .populate('feeder')
    .exec((err, waypoints) => {
        if (err) {
            res.json({'ERROR': err});
        } else {
            res.json(waypoints);
        }
    });
}

// Get events with page limit
function findPaginatedWaypoints(req, res) {
  var options = {
    sort: { datetime: -1 },
    populate: ['bird', 'feeder'],
    offset: parseInt(req.params.offset),
    limit: parseInt(req.params.limit)
  };
  Waypoint.paginate({}, options, (err, events) => {
      if (err) {
        res.json({'ERROR': err});
      } else {
        res.json(events);
      }
  });
}

// Get single waypoint
function findWaypointById(req, res) {
    Waypoint.findById(req.params.id)
    .populate('bird')
    .populate('feeder')
    .exec((err, waypoint) => {
        if (err) {
            res.json({'ERROR': err});
        } else {
            res.json(waypoint);
        }
    });
}

// Add new waypoint
function addWaypoint(req, res) {
    var newWaypoint = new Waypoint({
        datetime: req.body.datetime
    });
    newWaypoint.save((err, waypoint) => {
        if (err) {
            res.json({'ERROR': err});
        } else if (!waypoint) {
            res.send(400);
        } else {
            return waypoint.addBird(req.body.bird_id).then((_waypoint) => {
                return _waypoint.addFeeder(req.body.feeder_id).then((__waypoint) => {
                    return res.json({'SUCCESS': __waypoint});
                });
            });
        }
    });
}

// Delete waypoint
function deleteWaypoint(req, res) {
    Waypoint.findById(req.params.id, (err, waypoint) => {
        if (err) {
            res.json({'ERROR': err});
        } else {
            waypoint.remove((err) => {
                if (err) {
                    res.json({'ERROR': err});
                } else {
                    res.json({'REMOVED': waypoint});
                }
            });
        }
    });
}

module.exports = router;
