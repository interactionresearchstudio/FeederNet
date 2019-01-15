module.exports = {
  // Make sure that the user is logged in.
  isLoggedIn: function(req, res, next) {
      if (req.isAuthenticated())
          return next();
      console.log();
      res.status(401).json({"ERROR": "Access denied."});
  }
};
