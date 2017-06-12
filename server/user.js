var mongoose = require('./mongodb.js').mongoose;
var Schema = mongoose.Schema;

var passportLocalMongoose = require('passport-local-mongoose');

var User = new Schema({
  username:String,
  password:String
});

User.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', User);
