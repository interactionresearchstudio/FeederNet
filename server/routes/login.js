var express = require('express');
var router = express.Router();
var passport = require('passport');

router.post('/login', (req, res) => {
  passport.authenticate('local', function(err, user, info) {
    if (err) {
      res.status(404).json(err);
      return;
    }
    if (user) {
      req.logIn(user, (err) => {
        if (err) {
          res.status(500).json({'ERROR': 'Error logging in'});
          return;
        }
        res.status(200).json(info);
      });
    } else {
      res.status(401).json(info);
    }
  })(req, res);
});

module.exports = router;
