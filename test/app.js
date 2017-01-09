var faker = require("faker");
var stripe = require("stripe")("sk_test_dJrow4I6j74tdb1ExjPlaLF9");
var generateSource = require("../src/lib/generateSource.js");
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

function subscribeCustomer() {
    generateSource(function(err, customerInfo) {
        if (err) {
            console.log(err)
        }
        else {
          console.log('source generated')
          customerInfo.plan = "unlimited_plan"
          var job = queue.create('subscribeCustomer', customerInfo).removeOnComplete(true).save();
          console.log("job created");
          job.on('complete', function(result) {
              console.log(result)
          }).on('failed', function(errorMessage) {
              console.log('Job failed');
              console.log(errorMessage)
          })

        }
    })
}

function unsubscribeCustomer() {
  stripe.customers.list(
    { limit: 3 },
    function(err, customers) {
      var email = customers.data[0].email
      var job = queue.create('unsubscribeCustomer', {email:email}).removeOnComplete(true).save();
      console.log("job created")

      job.on('complete', function(result) {
          console.log(result)
      }).on('failed', function(errorMessage) {
          console.log('Job failed');
          console.log(errorMessage)
      })
    }
  );
}


function checkSecret(){
  var data = {
    secretKey:'127991186660d2848868a44679ca5e8'
  }
  var job = queue.create('checkSecret',data).removeOnComplete(true).save();
  console.log('job created');
  job.on('complete', function(result) {
      console.log("Job Finished")
      console.log(result)
  }).on('failed', function(errorMessage) {
      console.log('Job Failed');
      console.log(errorMessage)
  })
}

checkSecret();
