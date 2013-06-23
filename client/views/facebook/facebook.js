Template.facebook.helpers({
	username: function() {
		return 'shadi barhoumi';
	}
});

Template.facebook.events({
	'click button.fb-login': function(e) {
		fbApi.login(function(username) {
			 Session.set('username', username);
			 $('body').addClass('logged-in');
		     // hide login button
		     // $('.login').addClass('hidden');
		     // // show user and logout info
		     // $('.username').text(username);
		     // $('.logout').removeClass('hidden');
		});
		return false;
	},

	'click a.fb-logout': function(e) {
		$('body').removeClass('logged-in loaded');
		fbApi.logout(function() {
			// $('.logout').addClass('hidden');
	  //       $('.login').removeClass('hidden');
		});
		return false;
	}
})