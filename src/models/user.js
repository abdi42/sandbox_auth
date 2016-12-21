var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var crypto = require('crypto');

// create a schema
var userSchema = new Schema({
  email: String,
  username:String,
  canceled:{type:Boolean,default:false},
  secret_key:String
});

userSchema.methods.setPassword = function(password){
  this.salt = crypto.randomBytes(16).toString('hex');
  this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 512,'sha512').toString('hex');
};

userSchema.methods.validPassword = function(password) {
  var hash = crypto.pbkdf2Sync(password, this.salt, 1000, 512,'sha512').toString('hex');
  return this.hash === hash;
};

userSchema.methods.setPassword

// we need to create a model
var User = mongoose.model('User', userSchema);

// make this available to our users in our Node applications
module.exports = User;
