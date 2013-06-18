if (Meteor.isClient) {

}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // init twilio
    twilio = Twilio("AC9651ffc59574555d691de3c263db9c42", "ba645c78d7db0c7ec5debc85e2d2d2d8");
  });

  Meteor.methods({
    sendEmail: function (to, from, subject, text) {
      check([to, from, subject, text], [String]);

    // Let other method calls from the same client start running,
    // without waiting for the email sending to complete.
    this.unblock();

    Email.send({
      to: to,
      from: from,
      subject: subject,
      text: text
    });
  },


  sendSMS: function(to, body) {
    twilio.sendSms({
            to: to, // Any number Twilio can deliver to
            from: '+16502739991', // A number you bought from Twilio and can use for outbound communication
            body: body // body of the SMS message
          }, function(err, responseData) { //this function is executed when a response is received from Twilio
            if (!err) { // "err" is an error received during the request, if any
              // "responseData" is a JavaScript object containing data received from Twilio.
              // A sample response from sending an SMS message is here (click "JSON" to see how the data appears in JavaScript):
              // http://www.twilio.com/docs/api/rest/sending-sms#example-1
              console.log(responseData.from); // outputs "+14506667788"
              console.log(responseData.body); // outputs "word to your mother."
            }
          });            
  }


});
}
