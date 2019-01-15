var express = require('express');
var router = express.Router();
var Bird = require('../models/bird');
var auth = require('./auth');

router.get('/', (req, res, next) => {
    console.log('INFO: GET root.');
    res.json({'SUCCESS': 'Hello world.'});
});

// API routes
router.get('/birds', auth.isLoggedIn, findAllBirds);
router.get('/bird/:id', auth.isLoggedIn, findBirdById);
router.post('/birds', auth.isLoggedIn, addBird);
router.put('/bird/:id', auth.isLoggedIn, updateBird);
router.delete('/bird/:id', auth.isLoggedIn, deleteBird);

// Get all birds
function findAllBirds(req, res) {
    Bird.find((err, birds) => {
        if (err) {
            res.json({'ERROR': err});
        } else {
            res.json(birds);
        }
    });
}

// Get single bird
function findBirdById(req, res) {
    Bird.findById(req.params.id, (err, bird) => {
        if (err) {
            res.json({'ERROR': err});
        } else {
            res.json(bird);
        }
    });
}

// Add new bird
function addBird(req, res) {
    var newBird = new Bird({
        rfid: req.body.rfid,
        name: req.body.name
    });
    newBird.save((err) => {
        if (err) {
            res.json({'ERROR': err});
        } else {
            res.json({'SUCCESS': newBird});
        }
    });
}

// Update bird
function updateBird(req, res) {
    Bird.findById(req.params.id, (err, bird) => {
        if (req.body.rfid) bird.rfid = req.body.rfid;
        if (req.body.name) bird.name = req.body.name;
        bird.save((err) => {
            if (err) {
                res.json({'ERROR': err});
            } else {
                res.json({'UPDATED': bird});
            }
        });
    });
}

// Delete bird
function deleteBird(req, res) {
    console.log("INFO: DELETE request received with param: " + req.params.id);
    Bird.findById(req.params.id, (err, bird) => {
        if (err) {
            res.json({'ERROR': err});
        } else {
            bird.remove((err) => {
                if (err) {
                    res.json({'ERROR': err});
                } else {
                    res.json({'REMOVED': bird});
                }
            });
        }
    });
}

module.exports = router;
