var userSchema = require("../models/user.js");
var hat = require('hat');
var rack = hat.rack();

module.exports = function(userData,callback){
  if(err) return callback(err);

  userSchema.findOne({email:userData.email},function(err,user){
    if(user){
      var err = new Error("user already exists")
      err.status = 400;
      return callback(err);
    }

    var user = new userSchema({
      email:userData.email,
      username:userData.username,
      secret_key:rack()
    })

    user.setPassword(userData.password);
      user.save(function(err){
      if(err) return callback(err);

      return callback(null);
    })

  })


}
