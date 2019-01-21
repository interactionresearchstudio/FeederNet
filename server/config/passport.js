const JsonStrategy = require('passport-json').Strategy;
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');

module.exports = (passport) => {
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      done(err, user);
    });
  });

  // Local JSON login strategy
  passport.use(new JsonStrategy(
    function(username, password, done) {
      User.findOne({'local.username': username}, (err, user) => {
        if (err) {
          return done(err);
        }
        if (!user) {
          return done(null, false);
        }
        if (!user.validPassword(password)) {
          return done(null, false);
        }
        return done(null, user);
      });
    }
  ));

  // Local Strategy
  passport.use(new LocalStrategy(
    function(username, password, done) {
      User.findOne({'local.username': username}, (err, user) => {
        if (err) {
          return done(err);
        }
        if (!user) {
          return done(null, false, {
            username: "Username not found"
          });
        }
        if (!user.validPassword(password)) {
          return done(null, false, {
            password: "Password invalid"
          });
        }
        return done(null, user);
      });
    }
  ));
};
