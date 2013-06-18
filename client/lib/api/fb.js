$.getScript('http://connect.facebook.net/en_US/all.js', function() {
  // cache sdk locally between pages
  $.ajaxSetup({ cache: true });
  window.fbAsyncInit = function() { 
    // init the FB JS SDK
    FB.init({
      appId      : '167444476760170',                        // App ID from the app dashboard
      channelUrl : 'http://localhost:3000', // Channel file for x-domain comms
      status     : true,                                 // Check Facebook Login status
      xfbml      : true                                  // Look for social plugins on the page
    });


    window.fbApi = {
      statuses: [],
      statusWords: [],
      log: function(query) {
        FB.api(query, function(response) {
          console.log("RESPONSE FROM QUERY: " + query);
          console.log(response);
        });
      },
      getAllStatuses: function(profileId) {
        // max limit is 100
        fbApi.statuses.length = 0;
        fbApi.statusWords.length = 0;
        FB.api('/'+ profileId + '/statuses?limit=100', function(response) {
          // push statuses to fbApi.statuses
          for (var i = 0; i < response.data.length; i++) {
            if (!!response.data[i].message === true) {
              fbApi.statuses.push(response.data[i].message);
            }
          }

          // pull words out of each status and push to fbApi.statusWords
          var wordsOnly = /\b[a-zA-Z]+'?[a-zA-Z]*\b/g
          for (var i = 0; !!fbApi.statuses[i] === true && i < fbApi.statuses.length; i++) {
            var matches = fbApi.statuses[i].match(wordsOnly);
            for (var j = 0; !!matches === true && j < matches.length; j++) {
              if (!!matches[j] === true) {
                fbApi.statusWords.push(matches[j]);
              }
            }
          }

          console.log('pulled ' + fbApi.statuses.length + ' statuses for ' + response.data[0].from.name)
          console.log('total words: ' + fbApi.statusWords.length);

          // set word and status counts in session for display to user
          Session.set('totalWords', fbApi.statusWords.length);
          Session.set('totalStatuses', fbApi.statuses.length);
          Haiku.fillWords(fbApi.statusWords);
        });
      },
      login: function() {
        FB.login(function(response) {
         if (response.authResponse) {
           console.log('Welcome!  Fetching your information.... ');
           FB.api('/me', function(response) {
             console.log('Good to see you, ' + response.name + '.');
           });
           fbApi.getAllStatuses('me');
         } else {
           console.log('User cancelled login or did not fully authorize.');
         }
       }, {scope: "email, read_stream"});
      },





      getFriendsList: function(callback) {
        FB.api('/me/friends', function(response) {
        //these are run once facebook says its ready
        this.fbApi.friendsList = response.data;
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
      }
    };
  };
});
