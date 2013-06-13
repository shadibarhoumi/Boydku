$.getScript('http://connect.facebook.net/en_US/all.js', function()
{
  window.fbAsyncInit = function() {
    // init the FB JS SDK
    FB.init({
      appId      : '167444476760170',                        // App ID from the app dashboard
      channelUrl : 'http://localhost:3000', // Channel file for x-domain comms
      status     : true,                                 // Check Facebook Login status
      xfbml      : true                                  // Look for social plugins on the page
    });

    // Additional initialization code such as adding Event Listeners goes here
  };

  window.fbApi = {
    friendsList: [],
    getFriendsList: function(callback) {
      FB.api('/me/friends', function(response) {
        //these are run once facebook says its ready
        //this.fbApi.friendsList = response.data;
        callback(response.data);
      });
    },
    getFriendProfilePics: function(profileId) {
      return "http://graph.facebook.com/"+ profileId +"/picture";
    },
    getFriendStatus: function(profileId, callback) {
      FB.api('/' + profileId + '/statuses?fields=message&limit=1', function(response) {
        console.log(response);
        callback(response.data[0].message);
      });
    },
    getTimeStampOfStatus: function(profileId) {
      FB.api('/' + profileId + '?fields=statuses.limit(1)', function(response) {
        callback(response.statuses.data[0].updated_time);
      });
    },
    getFriendLocation: function(profileId, callback) {
      FB.api('/' + profileId + '?fields=location', function(response) {
        callback(response.location.name);
      });
    }, 
    syllables: function(word) {
      word.toLowerCase();
      if (word.length <= 3) {
        return 1;
      }
      word = word.replace(/(?:[^laeiouy]es|[^laeiouy]e)$/, '');
      word = word.replace(/^y/, '');
      var myRegex = /[aeiouy]{1,2}/;
      var match, matches = [], extraSyllable = 0;
      //runs until null
      while (match = myRegex.exec(word)) {
          if (match[0] === 'eo' || match[0] === 'ia' || match[0] === 'yo') {
            extraSyllable += 1;
          }
          // console.log(match);
          // console.log(matches);
          matches.push(match[1]);
          word = word.replace(myRegex, '');
      }

      return matches.length + extraSyllable;
    },
    getWordSyllables: function(sentence) {
      var words = sentence.split(' ');
      var array = [[]];
      for (var j = 0; j < 5; j++) {
        if (typeof array[j] === 'undefined') {
            array[j] = [];
          }
        for (var i = 0; i < words.length; i++) {
        words[i] = words[i].replace(/\W+/, ' ').toLowerCase();
        var outIndex = this.syllables(words[i]) - 1;
        if (outIndex === j) {
          
          array[outIndex].push(words[i]);
        }
        }
      }
      return array;
    }


    
  };
});
