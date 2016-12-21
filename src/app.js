var mongoose = require('mongoose');
var register = require("./lib/register.js")
var util = require('sandbox_util');
var kue = require('kue')
 , queue = kue.createQueue();

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/users');

queue.process('registerUser',25,function(job,done){
  util.checkObject(userData,['email','username','password'],function(err){
    if(err) return done(err);

    registerUser(job.data,done);
  })
})
