// IE < 8 doesn't implement indexOf
if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function(needle) {
        for(var i = 0; i < this.length; i++) {
            if(this[i] === needle) {
                return i;
            }
        }
        return -1;
    };
}

// select random element from array
Array.prototype.randomElement = function () {
	return this[Math.floor(Math.random() * this.length)]
};

String.prototype.capitalize = function(lower) {
	return (lower ? this.toLowerCase() : this).replace(/(?:^|\s)\S/g, function(a) { return a.toUpperCase(); });
};

Haiku = (function() {

	var availableSyllables = [];

	var punctuation = [";" ,"," , "."];
	
	var availableSyllablesInDB = function() {
		// return array of available syllable counts in db
		syllables = [];
		for (var i = 1; i <= 7; i++) {
			if (Words.findOne({syllables: i})) {
				syllables.push(i);
			}
		}
		// sort words in desc syll order, get syllables attr of first
		// return Words.findOne({}, {sort: {syllables: -1}}).syllables;
		return syllables;
  	};

	var randomWord = function(syllables) {
		// decrement syl count until you get a syl count that can
		// be found in the database
		while (availableSyllables.indexOf(syllables) === -1) {
			syllables--;
		}
		var count = Words.find({syllables: syllables}).count();
		var randPos = Math.floor((Math.random() * count));
		var word = Words.findOne({syllables: syllables}, {skip: randPos});
		return word;
	};

	var weightedRandomword = function(syllables) {
		// randomness weighted such that words with fewer sylls more likely
		// to be chosen
		var count = Words.find().count();
		var randPos = Math.floor((Math.random() * count));
		var word = Words.findOne({}, {skip: randPos});
		// console.log('word found in weighted random word');
		// console.log(word);
		 
		while (word.syllables > syllables) {
			randPos = Math.floor((Math.random() * count));
			word = Words.findOne({}, {skip: randPos});
			console.log('word found in weigted random word');
			console.log(word);
		}
		return word;
	}


  	var haikuLine = function(lineSyllables) {
	    var currentSyllables = 0;
	    var line = "";
	    while (currentSyllables < lineSyllables) {
	      var syllablesLeft = lineSyllables - currentSyllables;

	      if (currentSyllables == 0 && syllablesLeft == 5) {
	          // don't put single five-syllable words on a 5-syllable line
	          syllablesLeft = 4;
	      } else if (currentSyllables == 0 && syllablesLeft == 7) {
	          // don't put single seven-syllable words on a 7-syllable line
	      	  syllablesLeft = 6;
	      }

	        var randomSyllableCount = Math.floor(Math.random() * syllablesLeft) + 1;
	        var chosenRecord = randomWord(randomSyllableCount);
	        // console.log('randomSyllableCount: ' + randomSyllableCount);
	        // console.log('chosen record');
	        // console.log(chosenRecord);
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
                console.log('no words!');
				return "There are no words to make a haiku with :(";
			} else if (availableSyllables.length == 0) {
				availableSyllables = availableSyllablesInDB();
			}
			var haiku = [];
			var format = [5, 7, 5];
			var lineNumber = 1;
			for (var i = 0; i < format.length; i++) {
	          var punctuation_mark = "."; // this is appended to last line
	          if (lineNumber < 3) { punctuation_mark = punctuation.randomElement(); }
              var haikuObject = { line: haikuLine(format[i]) + punctuation_mark }
	          haiku.push(haikuObject);
	          lineNumber += 1;
      		}
      		return haiku;
      	},

      	syllables: function(word, debug) {
      		var syllables = 0;
      		// TODO: don't count -ed at end in some circumstances
            word = word.toLowerCase();

            // replace vowels that appear 3+ times next to each other with just one
            // marisaaaaaa => marisa
            word = word.replace(/([aeiouy])\1{2,}/g, '$1')
            
 			// the replace(regex, 'k') makes sure that stuff before regex doesn't get shunted to 
 			// the end of the line and then chopped off by the es|ed
 			// regex at the end
            word = word.replace(/^y/, 'k');

            var friend = word.match(/friend/);
     		if (friend) {
     			if (debug) { console.log('adding 1 to syllables from friend'); }
     			syllables += 1;
     			word = word.replace(friend, 'k');
     		}

     		var ien = word.match(/ien/);
     		if (ien) {
     			if (debug) {console.log('adding 2 to syllables from ien');}

     			syllables += 2;
     			word = word.replace(ien, 'k');
     		}

     		// 'function', 'action', 'caption', 'captious' => io is only one syl in this case
     		var ction = word.match(/tion|tious/);
     		if (ction) {
     			if (debug) {console.log('adding 1 to syllables from ction');}

     			syllables += 1;
     			word = word.replace(ction, 'k');
     		}

     		var ssion = word.match(/ssion/);
     		if (ssion) {
     			if (debug) {if (debug) {console.log('adding 1 to syllables from ssion');}}


     			syllables += 1;
     			word = word.replace(ssion, 'k');	
     		}

     		// hide, side, ride, tide, aide
            var ide = word.match(/[hsrtabw]ide/);
            if (ide) {
                if (debug) {console.log('adding 1 to syllables from ide');}

                syllables += 1;
                word = word.replace(ide, 'k');  
            }

            // spiritual, contractual
     		var tual = word.match(/tual/);
     		if (tual) {
     			if (debug) {console.log('adding 2 to syllables from tual');}

     			syllables += 2;
     			word = word.replace(tual, 'k');	
     		}

     		var geon = word.match(/geon/);
     		if (geon) {
     			if (debug) {console.log('adding 1 to syllables from geon');}

     			syllables += 1;
     			word = word.replace(geon, 'k');	
     		}

     		var ome = word.match(/ome/);
     		if (ome) {
     			if (debug) {console.log('adding 1 to syllables from ome');}

     			syllables += 1;
     			word = word.replace(ome, 'k');	
     		}

     		var eist = word.match(/eist/);
     		if (eist) {
     			if (debug) {console.log('adding 1 to syllables from eist');}

     			syllables += 2;
     			word = word.replace(eist, 'k');	
     		}

     		// accound for *ed endings that DO add a syllable
     		var ed = /(?:ted|bled|tled|cled)$/
     		if (word.match(ed)) {
     			if (debug) {console.log('adding 1 to syllables from ed-endings');}

     			syllables += 1;
     			word = word.replace(ed, 'k');
     		}


            // account for *es endings that DO add a syllable
          	// 'shes', 'ces', 'ges', 'xes', 'gles', 'cles', 'ches'
     		var es = /(?:shes|ces|ges|xes|gles|cles|ches)$/
     		if (word.match(es)) {
     			if (debug) {console.log('adding 1 to syllables from es-endings');}

     			syllables += 1;
     			word = word.replace(es, 'k');
     		}

			var ole = word.match(/ole/);
     		if (ole) {
     			if (debug) {console.log('adding 1 to syllables from ole');}

     			syllables += 1;
     			word = word.replace(ole, 'k');
     		}


            var peo = word.match(/peo/);
     		if (peo) {
     			if (debug) {console.log('adding 1 to syllables from peo');}

     			syllables += 1;
     			word = word.replace(peo, 'k');
     		}

     		// account for two-syllable pairs
     		var pairs = /eo|ia|yo|io|oing/g
     		var pairMatches = word.match(pairs)
     		if (pairMatches) {
     			if (debug) {console.log('adding 2 to syllables from pairs');}

     			syllables += pairMatches.length * 2;
     			word = word.replace(pairs, 'k');
     		}

     		if (debug) {console.log('word before rep: ' + word);}


     		// now replace *es and *e endings
     		// replace with consonant so that other things don'
            word = word.replace(/(?:[^laeiouy]es|[^laeiouy]e|ed)$/, '');

     		if (debug) {console.log('word after rep: ' + word);}

            // now count vowels
            var vowels = /[aeiouy]{1,2}/g;
            var matches = word.match(vowels);

            if (matches) {
            	if (debug) {console.log('adding ' + matches.length + ' to syllables from vowels');}

            	syllables += matches.length;
            }

            return syllables;
      	},

      	fillWords: function(wordArray) {
            console.log(this);
      		for (var i = 0; i < wordArray.length; i++) {
      			Words.insert({
      				word: wordArray[i],
      				syllables: this.syllables(wordArray[i])
      			});
      		}
      	}
	};
	
})();