Template.haiku.helpers({
	// each line is a separate paragrapb
	haiku: Haiku.haiku().replace(/\n/g, '</p><p>')
});