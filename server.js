//  OpenShift sample Node application
var express = require('express'),
    fs      = require('fs'),
    app     = express(),
    eps     = require('ejs'),
    morgan  = require('morgan');

Object.assign=require('object-assign')

//app.engine('html', require('ejs').renderFile);
app.use(morgan('combined'))

var ExpressPeerServer = require('peer').ExpressPeerServer;

var server = require('http').Server(app);
var io = require('socket.io')(server);


var port = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080,
    ip   = process.env.IP   || process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0',
    mongoURL = process.env.OPENSHIFT_MONGODB_DB_URL || process.env.MONGO_URL,
    mongoURLLabel = "";

if (mongoURL == null && process.env.DATABASE_SERVICE_NAME) {
  var mongoServiceName = process.env.DATABASE_SERVICE_NAME.toUpperCase(),
      mongoHost = process.env[mongoServiceName + '_SERVICE_HOST'],
      mongoPort = process.env[mongoServiceName + '_SERVICE_PORT'],
      mongoDatabase = process.env[mongoServiceName + '_DATABASE'],
      mongoPassword = process.env[mongoServiceName + '_PASSWORD']
      mongoUser = process.env[mongoServiceName + '_USER'];

  if (mongoHost && mongoPort && mongoDatabase) {
    mongoURLLabel = mongoURL = 'mongodb://';
    if (mongoUser && mongoPassword) {
      mongoURL += mongoUser + ':' + mongoPassword + '@';
    }
    // Provide UI label that excludes user id and pw
    mongoURLLabel += mongoHost + ':' + mongoPort + '/' + mongoDatabase;
    mongoURL += mongoHost + ':' +  mongoPort + '/' + mongoDatabase;

  }
}
var db = null,
    dbDetails = new Object();

var initDb = function(callback) {
  if (mongoURL == null) return;

  var mongodb = require('mongodb');
  if (mongodb == null) return;

  mongodb.connect(mongoURL, function(err, conn) {
    if (err) {
      callback(err);
      return;
    }

    db = conn;
    dbDetails.databaseName = db.databaseName;
    dbDetails.url = mongoURLLabel;
    dbDetails.type = 'MongoDB';

    console.log('Connected to MongoDB at: %s', mongoURL);
  });
};

app.get('*',function(req, res, next){
  if (!db) {
    initDb(function(err){});
  }
  next();
});
var routes = ['/','/lobby','/game','/outcome']
app.get(routes, function (req, res) {
  if (db) {
    var col = db.collection('counts');
    // Create a document with request IP and current time of request
    col.insert({ip: req.ip, date: Date.now()});
    col.count(function(err, count){
      res.sendFile(__dirname+'/files/index.html');
    });
  } else {
    res.sendFile(__dirname+'/files/index.html');
  }
});

app.get('/files/*', function(req, res){
  res.sendFile(__dirname+req.url);
});
app.get('/images/*', function(req, res){
  res.sendFile(__dirname+"/files"+req.url);
});

app.get('/pagecount', function (req, res) {
  if (db) {
    db.collection('counts').count(function(err, count ){
      res.send('{ pageCount: ' + count + '}');
    });
  } else {
    res.send('{ pageCount: -1 }');
  }
});

var options = {
    debug: true
}
var peerServer = ExpressPeerServer(server, options);
app.use('/peerjs', peerServer);

peerServer.on('connection', function(id) {
   console.log(`${id} connected`); 
});

var connected = [];
io.on('connection', function(socket){
  console.log(JSON.stringify(connected))
  socket.emit('lobbies', connected);
  var id;
  socket.on('peer id', function(data){
    id = data;
    connected.push(id);
    socket.broadcast.emit('lobby created', id);
    console.log("public:" + JSON.stringify(id));
  });
  socket.on('disconnect', function(){
    if(id){
      connected.splice(connected.indexOf(id), 1);
      socket.broadcast.broadcast.emit('lobby closed', id);
    }
  });
});

// error handling
app.use(function(err, req, res, next){
  console.error(err.stack);
  res.status(500).send('Something bad happened!');
});

initDb(function(err){
  console.log('Error connecting to Mongo. Message:\n'+err);
});

server.listen(port, ip);
console.log('Server running on http://%s:%s', ip, port);

module.exports = app ;
