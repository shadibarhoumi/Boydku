Template.facebook.events({
	'click button.fb-login': function(e) {
		fbApi.login();
	}
})