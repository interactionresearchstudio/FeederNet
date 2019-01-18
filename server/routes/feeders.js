var express = require('express');
var router = express.Router();
var Feeder = require('../models/feeder');
var auth = require('./auth');

// API routes
router.get('/feeders', auth.isLoggedIn, findAllFeeders);
router.get('/feeder/:id', auth.isLoggedIn, findFeederById);
router.post('/feeders', auth.isLoggedIn, addFeeder);
router.put('/feeder/:id', auth.isLoggedIn, updateFeeder);
router.delete('/feeder/:id', auth.isLoggedIn, deleteFeeder);

// Get all feeders
function findAllFeeders(req, res) {
    Feeder.find((err, feeders) => {
        if (err) {
            res.json({'ERROR': err});
        } else {
            res.json(feeders);
        }
    });
}

// Get single feeder
function findFeederById(req, res) {
    Feeder.findById(req.params.id, (err, feeder) => {
        if (err) {
            res.json({'ERROR': err});
        } else {
            res.json(feeder);
        }
    });
}

// Add new feeder
function addFeeder(req, res) {
    var newFeeder = new Feeder({
        stub: req.body.stub,
        name: req.body.name,
        location: req.body.location,
        lastPing: req.body.lastPing
    });
    newFeeder.save((err) => {
        if (err) {
            res.json({'ERROR': err});
        } else {
            res.json({'SUCCESS': newFeeder});
        }
    });
}

// Update feeder
function updateFeeder(req, res) {
    Feeder.findById(req.params.id, (err, feeder) => {
        if (req.body.stub) feeder.stub = req.body.stub;
        if (req.body.name) feeder.name = req.body.name;
        if (req.body.location) feeder.location = req.body.location;
        if (req.body.lastPing) feeder.lastPing = req.body.lastPing;
        feeder.save((err) => {
            if (err) {
                res.json({'ERROR': err});
            } else {
                res.json({'UPDATED': feeder});
            }
        });
    });
}

// Delete feeder
function deleteFeeder(req, res) {
    Feeder.findById(req.params.id, (err, feeder) => {
        if (err) {
            res.json({'ERROR': err});
        } else {
            feeder.remove((err) => {
                if (err) {
                    res.json({'ERROR': err});
                } else {
                    res.json({'REMOVED': feeder});
                }
            });
        }
    });
}

module.exports = router;
