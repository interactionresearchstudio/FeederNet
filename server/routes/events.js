var express = require('express');
var router = express.Router();
var Event = require('../models/event');
var auth = require('./auth');

// API routes
router.get('/events', auth.isLoggedIn, findAllEvents);
router.get('/event/:id', auth.isLoggedIn, findEventById);
router.post('/events', addEvent);
router.put('/event/:id', updateEvent);
router.delete('/event/:id', auth.isLoggedIn, deleteEvent);

// Get all events
function findAllEvents(req, res) {
    Event.find()
    .populate('feeder')
    .exec((err, events) => {
        if (err) {
            res.json({'ERROR': err});
        } else {
            res.json(events);
        }
    });
}

// Get single event
function findEventById(req, res) {
    Event.findById(req.params.id)
    .populate('feeder')
    .exec((err, event) => {
        if (err) {
            res.json({'ERROR': err});
        } else {
            res.json(event);
        }
    });
}

// Add new event
function addEvent(req, res) {
    var newEvent = new Event({
        type: req.body.type,
        ip: req.body.ip,
        datetime: req.body.datetime
    });
    newEvent.save((err) => {
        if (err) {
            res.json({'ERROR': err});
        } else {
            res.json({'SUCCESS': newEvent});
        }
    });
}

// Update event
function updateEvent(req, res) {
    Event.findById(req.params.id, (err, event) => {
        if (req.body.type) event.type = req.body.type;
        if (req.body.ip) event.ip = req.body.ip;
        if (req.body.datetime) event.datetime = req.body.datetime;
        event.save((err) => {
            if (err) {
                res.json({'ERROR': err});
            } else {
                res.json({'UPDATED': event});
            }
        });
    });
}

// Delete event
function deleteEvent(req, res) {
    Event.findById(req.params.id, (err, event) => {
        if (err) {
            res.json({'ERROR': err});
        } else {
            event.remove((err) => {
                if (err) {
                    res.json({'ERROR': err});
                } else {
                    res.json({'REMOVED': event});
                }
            });
        }
    });
}

module.exports = router;
