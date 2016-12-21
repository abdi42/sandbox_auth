var faker = require("faker");
var kue = require('kue'),
    queue = kue.createQueue();

function registerUser(){
  var user = {
    email:faker.internet.email(),
    username:faker.internet.userName(),
    password:'secret'
  }
  var job = queue.create('registerUser',user).removeOnComplete(true).save();
  console.log('job created');
  job.on('complete', function(result) {
      console.log(result)
  }).on('failed', function(errorMessage) {
      console.log('Job failed');
      console.log(errorMessage)
  })
}

registerUser();
