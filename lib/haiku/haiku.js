// select random element from array
Array.prototype.randomElement = function () {
  return this[Math.floor(Math.random() * this.length)]
};

String.prototype.capitalize = function(lower) {
  return (lower ? this.toLowerCase() : this).replace(/(?:^|\s)\S/g, function(a) { return a.toUpperCase(); });
};

Haiku = (function() {

	var words = [["boat", "ship", "crap", "hood", "dip", "hubris", "wish", "stern", "mad", //1
  "book", "goat", "video", "games", "semen", "poop", "fun", "sun", "shit", "fuck"], 
  ["angry", "reading", "magic", "rainbow", "Alex", "Kiril", "Erik", "satan", "neck-beard", "Gervang", "Shadi", "dirtbag"], 
        ["chinaman", "punitive", "butt pirate", "towelhead", "Santa Klaus", "butt muncher", "vector space", //3
        "cinderblock"],
        ["misogyny", "belligerent", "grandiloquent", "interesting", "cross-modulate", "videogames"], //4
        ["creativity", "electricity", "arbitrarily", "diagonally", "undeniable", "evolutionist", "butt enthusiast", //5
        "Yugoslavian", "xenophobia"]];

        var punctuation = [";" ,"," , "."];

        // we'll want to store the words in a database
        var wordBankWithFB = function(statusBank) {
          for (var syllableCount = 0; syllableCount < words.length; syllableCount++) {
            for (var wordCount = 0; wordCount < words[syllableCount].length; wordCount++) {

              if(statusBank[syllableCount][wordCount] !== "" && (typeof statusBank[syllableCount][wordCount] !== "undefined")) {
                    //console.log('word: ' + statusBank[syllableCount][wordCount]);
                    words[syllableCount].push(statusBank[syllableCount][wordCount]);
                  }
                }
              }
              return words;
            }

            var haikuLine = function(max_syllables) {
              var current_syllables = 0;
              var line = "";
              while (current_syllables < max_syllables) {
                var syllables_left = max_syllables - current_syllables;
            // if remaining syllable count is greater than length of words
            // then set it equal to length of words
            if (syllables_left > words.length) {
              syllables_left = words.length;
            } else if (current_syllables == 0 && syllables_left == 5) {
                // don't put single five-syllable words on a 5-syllable line
                syllables_left = 4;
              }

              var chosen_word_syllables = Math.floor(Math.random() * syllables_left);
              var chosen_word = words[chosen_word_syllables].randomElement();

            // capitalize word if it's at the beginning of the line
            if (current_syllables == 0) { chosen_word = chosen_word.capitalize(); }
            

            line += chosen_word;
            
            current_syllables += chosen_word_syllables + 1;
            
            // add a space if word isn't at end of line
            if (current_syllables < max_syllables) { line += " "; }

          }

          return line;
        };

        var haikuObject = {
          haiku: function() {
            //words = wordBankWithFB(addedWordBank);
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
          },
          syllables: function(word) {
            word.toLowerCase();
            if (word.length <= 3) {
              return 1;
            }
            word = word.replace(/(?:[^laeiouy]es|[^laeiouy]e)$/, '');
            word = word.replace(/^y/, '');
            var myRegex = /[aeiouy]{1,2}/;
            var match, matches = [], extraSyllable = 0;
      //runs until null
      while (match = myRegex.exec(word)) {
        if (match[0] === 'eo' || match[0] === 'ia' || match[0] === 'yo') {
          extraSyllable += 1;
        }
        matches.push(match[1]);
        word = word.replace(myRegex, '');
      }
      console.log('syllables: ');
      console.log(matches);
      return matches.length + extraSyllable;
    }
  }
  return haikuObject;


})();