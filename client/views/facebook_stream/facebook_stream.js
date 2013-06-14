Template.facebookStream.events({ 
  'click .last-status': function(e) {
    console.log('this is a fb contact');
    var callback = function(status) {
      //colsole.log('poop');
      $('body').append($('<div/>').text('last facebook update: ' + status));
      //console.log(fbApi.getWordSyllables(status));
      // alert(haiku(fbApi.getWordSyllables(status)));
    };
    fbApi.getFriendStatus(1496566583, callback);
  }
});