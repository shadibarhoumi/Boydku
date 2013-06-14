Template.sendSMS.events({
	'click button.send': function(e) {
		var destinationNumber = $('#message-form .number').val();
		var messageBody = $('#message-form .message').val();
		console.log('sending sms!!! way to go shadi!');
		Meteor.call('sendSMS', destinationNumber, messageBody);
		$('#message-form input').val('');
	}
})