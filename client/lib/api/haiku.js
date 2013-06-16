// select random element from array
Array.prototype.randomElement = function () {
	return this[Math.floor(Math.random() * this.length)]
};

String.prototype.capitalize = function(lower) {
	return (lower ? this.toLowerCase() : this).replace(/(?:^|\s)\S/g, function(a) { return a.toUpperCase(); });
};

Haiku = (function() {

	var punctuation = [";" ,"," , "."];

	var randomWord = function(syllables) {
		var count = Words.find({syllables: syllables}).count();
		var randPos = Math.floor((Math.random() * count));
		var word = Words.findOne({syllables: syllables}, {skip: randPos});
		return word;
	};

	var maxSyllablesInDB = function() {
		// sort words in desc syll order, get syllables attr of first
		return Words.findOne({}, {sort: {syllables: -1}}).syllables;
  	};

  	var haikuLine = function(lineSyllables) {
	    var currentSyllables = 0;
	    var line = "";
	    while (currentSyllables < lineSyllables) {
	      var syllablesLeft = lineSyllables - currentSyllables;
	      // if remaining syllable count is greater than max syllable count in db
	      // then set it equal to max syl count
	      var maxSyllables = maxSyllablesInDB();
	      if (syllablesLeft > maxSyllables) {
	        syllablesLeft = maxSyllables;
	      } else if (currentSyllables == 0 && syllablesLeft == 5) {
	          // don't put single five-syllable words on a 5-syllable line
	          syllablesLeft = 4;
	        }

	        // select random syllable count within maxSyllable range
	        // TODO: don't assume that there are words with syllables from 
	        // zero to max syllable count, only choose from words in db
	        var randomSyllableCount = Math.floor(Math.random() * syllablesLeft) + 1;
	        var chosenRecord = randomWord(randomSyllableCount);
	        var chosenWord = chosenRecord.word;

	      // capitalize word if it's at the beginning of the line
	      if (currentSyllables == 0) { chosenWord = chosenWord.capitalize(); }

	      line += chosenWord;
	      
	      currentSyllables += chosenRecord.syllables;
	      
	      // add a space if word isn't at end of line
	      if (currentSyllables < lineSyllables) { line += " "; }
	    }

        return line;
  	};

	return {
		haiku: function() {
			if (Words.find().count() === 0) {
				return "There are no words to make a haiku with :(";
			}
			var haiku = "";
			var format = [5, 7, 5];
			var lineNumber = 1;
			for (var i = 0; i < format.length; i++) {
	          var punctuation_mark = "."; // this is appended to last line
	          if (lineNumber < 3) { punctuation_mark = punctuation.randomElement() + "\n"; }
	          haiku += haikuLine(format[i]) + punctuation_mark;
	          lineNumber += 1;
      		}
      		return haiku;
      	}
	};
	
})();