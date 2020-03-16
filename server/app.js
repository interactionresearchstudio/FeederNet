const express = require('express');
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const http = require('http');
const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);

const port = process.env.PORT || 5000;

// Mongoose
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/node-testing', {useNewUrlParser: true}, (err, res) => {
  if(err) {
    console.log('Error connecting to the database. ' + err);
  } else {
    console.log('Connected to Database!');
  }
});

// Session store
const store = new MongoDBStore({
  uri: process.env.MONGODB_URI || 'mongodb://localhost/node-testing',
  collection: 'sessions'
});

store.on('error', (error) => {
  assert.ifError(error);
  assert.ok(false);
});

// Check if user exists.
const User = require('./models/user');
User.findOne({'local.username': 'admin'}, (err, user) => {
  if (err) {
    console.log("ERROR: Admin user search failed");
    console.log(err);
  }
  if (!user) {
    console.log("INFO: Admin user not found in database. Setting...");
    var adminUser = new User();
    adminUser.local.username = "admin";
    adminUser.local.password = adminUser.generateHash(process.env.ADMIN_PASSWORD || "adminpass");
    adminUser.save((err) => {
        console.log("INFO: Admin user created.");
    });
  }
});

// Routes
const admin = require('./routes/admin.js');
const birds = require('./routes/birds.js');
const feeders = require('./routes/feeders.js');
const events = require('./routes/events.js');
const waypoints = require('./routes/waypoints.js');
const recordTrack = require('./routes/recordTrack.js');
const time = require('./routes/time.js');
const ping = require('./routes/ping.js');
const update = require('./routes/update.js');
const login = require('./routes/login.js');
const program = require('./routes/program.js');

// Express instance
var app = express();

// Passport config
require('./config/passport')(passport);

// Config middleware
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.use(require('express-session')({
  secret: process.env.SESSION_SECRET || 'keyboard cat',
  store: store,
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use('/admin/', express.static(__dirname + '../../admin-client/build/'));
//app.use('/admin/', admin);

// Main routes
app.use('/api/', birds);
app.use('/api/', feeders);
app.use('/api/', events);
app.use('/api/', waypoints);
app.use('/api/', recordTrack);
app.use('/api/', time);
app.use('/api/', ping);
app.use('/api/', update);
app.use('/api/', login);
app.use('/api/', program);

app.get('/admin/*', (req,res) =>{
    res.sendFile(path.join(__dirname, '../', 'admin-client/build/index.html'));
});

// Server configuration
var server = http.createServer(app);
server.listen(port, () => {
    console.log('INFO: Server started on port ' + port);
    console.log('WiFi name: ' + process.env.WIFI_NAME + ' | WiFi pass: ' + process.env.WIFI_PASS);
    console.log('Serial port: ' + process.env.SERIAL_PORT);
});

module.exports = app;
