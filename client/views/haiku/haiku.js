Template.haiku.helpers({
	// each line is a separate paragrapb
	// haiku: Haiku.haiku().replace(/\n/g, '</p><p>')
	haiku: function() {
		return Session.get('haiku');
	}
});

Template.haiku.events({
	'click button.good, click button.bad': function(e) {
		//Template.haiku.newHaiku();
		var haiku = Haiku.haiku();
		Session.set('haiku', haiku);
	}
});