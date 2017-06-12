var port = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080,
    ip = process.env.IP || process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0';
//  OpenShift sample Node application
var express = require('express'),
  fs = require('fs'),
  app = express(),
  eps = require('ejs'),
  morgan = require('morgan');

Object.assign = require('object-assign')

//app.engine('html', require('ejs').renderFile);
app.use(morgan('combined'))

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));

var passport = require('passport');

var ExpressPeerServer = require('peer').ExpressPeerServer;

var server = require('http').Server(app);
var io = require('socket.io')(server);

var MongoDB = require('./server/mongodb.js');
var db = MongoDB.db;
var User = require('./server/user.js');

app.get('*', function (req, res, next) {
  if (!db) {
    MongoDB.initDb(function (err) {});
  }
  next();
});
var routes = [
  '/',
  '/lobby',
  '/game',
  '/outcome',
  '/login',
  '/register'
]
app.get(routes, function (req, res) {
  res.sendFile(__dirname + '/files/index.html');
});

app.get('/files/*', function (req, res) {
  res.sendFile(__dirname + req.url);
});
app.get('/images/*', function (req, res) {
  res.sendFile(__dirname + "/files" + req.url);
});
app.use(passport.initialize());
app.use(passport.session());
passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.post('/login',
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
  })
);
app.post('/register', function (req, res) {
  User.register(new User({
    username: req.body.username
  }), req.body.password, function (err, user) {
    if (err) {
      return res.send(err)
    }

    passport.authenticate('local')(req, res, function () {
      res.redirect('/');
    });
  });
});

var options = {
  debug: true
}
var peerServer = ExpressPeerServer(server, options);
app.use('/peerjs', peerServer);

peerServer.on('connection', function (id) {
  console.log(`${id} connected`);
});

var connected = [];
io.on('connection', function (socket) {
  console.log(JSON.stringify(connected))
  socket.emit('lobbies', connected);
  var id;
  socket.on('peer id', function (data) {
    id = data;
    connected.push(id);
    socket.broadcast.emit('lobby created', id);
    console.log("public:" + JSON.stringify(id));
  });
  socket.on('disconnect', function () {
    if (id) {
      connected.splice(connected.indexOf(id), 1);
      socket.broadcast.broadcast.emit('lobby closed', id);
    }
  });
});

// error handling
app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500).send('Something bad happened!');
});


server.listen(port, ip);
console.log('Server running on http://%s:%s', ip, port);

module.exports = app;