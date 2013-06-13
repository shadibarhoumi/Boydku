if (Meteor.isClient) {
  Template.hello.greeting = function () {
    return "Welcome to Boydku.";
  };

//console.log(fbApi.getWordSyllables('thanks for the birthday wishes homies!!~'));

//Facebook button events
Template.facebookStream.events({ 
  'click .last-status': function(e) {
    console.log('this is a fb contact');
    var callback = function(status) {
      //colsole.log('poop');
      $('body').append($('<div/>').text('last facebook update: ' + status));
      //console.log(fbApi.getWordSyllables(status));
      alert(haiku(fbApi.getWordSyllables(status)));
      $('body').append($('<div/>').text(haiku(fbApi.getWordSyllables(status))));
    };
    fbApi.getFriendStatus(1496566583, callback);
  }
});



Template.hello.events({
  'click input' : function () {
      // template data, if any, is available in 'this'
      if (typeof console !== 'undefined')
        console.log("You pressed the button");
      Meteor.call('sendEmail',
            '16507148452@txt.att.net',
            'chrisgervang@gmail.com',
            'Hello from Meteor!',
            'This is a test of Email.send.');
    }
  });
Accounts.ui.config({
  requestPermissions: {
    facebook: ['email', 'friends_status']
  },
  passwordSignupFields: 'EMAIL'
});


}


if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
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
  }
});
}
