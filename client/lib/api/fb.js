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
      friendsList: [],
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
