var stripe = require("stripe")("sk_test_dJrow4I6j74tdb1ExjPlaLF9");
var subscriptionsController = require("./lib/subscriptions.js")
var faker = require('faker');
var mongoose = require('mongoose');
var mongoose = require('mongoose');
var register = require("./lib/register.js")
var util = require('sandbox_util');
var kue = require('kue')
 , queue = kue.createQueue();

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/auth');

queue.process('registerUser',25,function(job,done){
  util.checkObject(job.data,['email','username','password'],function(err){
    if(err) return done(err);

    register(job.data,done);
  })
})

queue.process('subscribeCustomer',25, function(job, done){
  util.checkObject(job.data,['email','plan','token'],function(err){
    if(err) return done(err);

    subscriptionsController.subscribe(job.data,done)
  })
});

queue.process('unsubscribeCustomer',25, function(job, done){
  if(!job.data.email)
    return done(createNewError("user email not specified"))
  else
    subscriptionsController.unsubscribe(job.data,done)
});

function createNewError(err){
    var error = new Error(err)
    return error
}
