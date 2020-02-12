var express = require('express');
var router = express.Router();
var Waypoint = require('../models/waypoint');
var auth = require('./auth');

// API routes
router.get('/waypoints', auth.isLoggedIn, findAllWaypoints);
router.get('/waypoints/csv', getCsvWaypoints);
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

function getCsvWaypoints(req, res) {
  Waypoint.find()
  .populate('bird')
  .populate('feeder')
  .exec((err, waypoints) => {
      if (err) {
          res.status(500).json({'ERROR': err});
      } else {
          let csv = "Bird Name,RFID,Feeder Name,Date And Time\r\n";
          waypoints.map((object, i) => {
            if (object.bird == null) {
              object.bird = {name: "Deleted", rfid: "Deleted"};
            }
            if (object.feeder == null) {
              object.feeder = {name: "Deleted", stub: "Deleted"};
            }
            csv +=
              object.bird.name + "," +
              object.bird.rfid + "," +
              object.feeder.name + "," +
              convertTime(object.datetime) + "\r\n";
          });
          res.send(csv);
      }
  });
}

// Get waypoints with page limit
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

function convertTime(UNIX_timestamp){
  var a = new Date(UNIX_timestamp * 1000);
  var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  var year = a.getFullYear();
  var month = months[a.getMonth()];
  var date = a.getDate();
  var hour = a.getHours();
  var min = a.getMinutes();
  var sec = a.getSeconds();
  var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec ;
  return time;
}

module.exports = router;
