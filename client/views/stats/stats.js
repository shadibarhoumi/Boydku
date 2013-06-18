Template.stats.helpers({
	totalWords: function() {
		return Session.get('totalWords');
	},
	totalStatuses: function() {
		return Session.get('totalStatuses');
	}
});