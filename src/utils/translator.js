/**
 * Translator class to handle number to word conversions in different languages
 */
export class Translator {
  /**
   * Create a new translator
   */
  constructor() {
    // Define word lists for different languages
    this.wordLists = {
      kinyarwanda: [
        'na', 'mirongo', 'rimwe', 'kabiri', 'gatatu', 'kane', 'gatanu', 'gatandatu', 'karindwi', 'umunane',
        'ikenda', 'icumi', 'cumi', 'makumyabiri', 'itatu', 'ine', 'itanu', 'itandatu', 'irindwi',
        'nane', 'ikenda', 'ijana', "n'"
      ],
      swahili: [
        'na', 'moja', 'mbili', 'tatu', 'nne', 'tano', 'sita', 'saba', 'nane', 'kumi', 'ishirini', ''
      ],
      english: [
        'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve',
        'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen', 'twenty', 'thirty',
        'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety', 'one hundred'
      ],
      france: [
        'un', 'deux', 'trois', 'quatre', 'cinq', 'six', 'sept', 'huit', 'neuf', 'dix',
        'onze', 'douze', 'treize', 'quatorze', 'quinze', 'seize', 'dix-sept', 'dix-huit', 'dix-neuf',
        'vingt', 'vingt-et-un', 'vingt-deux', 'vingt-trois', 'vingt-quatre', 'vingt-cinq', 'vingt-six',
        'vingt-sept', 'vingt-huit', 'vingt-neuf', 'trente', 'trente-et-un', 'trente-deux', 'trente-trois',
        'trente-quatre', 'trente-cinq', 'trente-six', 'trente-sept', 'trente-huit', 'trente-neuf',
        'quarante', 'quarante-et-un', 'quarante-deux', 'quarante-trois', 'quarante-quatre', 'quarante-cinq',
        'quarante-six', 'quarante-sept', 'quarante-huit', 'quarante-neuf', 'cinquante', 'cinquante-et-un',
        'cinquante-et-deux', 'cinquante-trois', 'cinquante-quatre', 'cinquante-cinq', 'cinquante-six',
        'cinquante-sept', 'cinquante-huit', 'cinquante-neuf', 'soixante', 'soixante-et-un', 'soixante-deux',
        'soixante-trois', 'soixante-quatre', 'soixante-cinq', 'soixante-six', 'soixante-sept', 'soixante-huit',
        'soixante-neuf', 'soixante-dix', 'soixante-dix-et-onze', 'soixante-dix-douze', 'soixante-dix-treize',
        'soixante-dix-et-quatorze', 'soixante-dix-et-seize', 'soixante-dix-et-sept', 'soixante-dix-et-huit',
        'soixante-dix-et-neuf', 'quatre-vingts', 'quatre-vingt-un', 'quatre-vingt-deux', 'quatre-vingt-trois',
        'quatre-vingt-quatre', 'quatre-vingt-cinq', 'quatre-vingt-six', 'quatre-vingt-sept', 'quatre-vingt-huit',
        'quatre-vingt-neuf', 'quatre-vingt-dix', 'quatre-vingt-onze', 'quatre-vingt-douze', 'quatre-vingt-treize',
        'quatre-vingt-quatorze', 'quatre-vingt-quinze', 'quatre-vingt-seize', 'quatre-vingt-dix-sept',
        'quatre-vingt-dix-huit', 'quatre-vingt-neuf', 'cent'
      ],
      roman: [
        'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII', 'XIII', 'XIV', 'XV', 'XVI', 'XVII',
        'XVIII', 'XIX', 'XX', 'XXI', 'XXII', 'XXIII', 'XXIV', 'XXV', 'XXVI', 'XXVII', 'XXVIII', 'XXIX', 'XXX', 'XXXI',
        'XXXII', 'XXXIII', 'XXXIV', 'XXXV', 'XXXVI', 'XXXVII', 'XXXVIII', 'XXXIX', 'XL', 'XLI', 'XLII', 'XLIII', 'XLIV',
        'XLV', 'XLVI', 'XLVII', 'XLVIII', 'XLIX', 'L', 'LI', 'LII', 'LIII', 'LIV', 'LV', 'LVI', 'LVII', 'LVIII', 'LIX',
        'LX', 'LXI', 'LXII', 'LXIII', 'LXIV', 'LXV', 'LXVI', 'LXVII', 'LXVIII', 'LXIX', 'LXX', 'LXXI', 'LXXII', 'LXXIII',
        'LXXIV', 'LXXV', 'LXXVI', 'LXXVII', 'LXXVIII', 'LXXIX', 'LXXX', 'LXXXI', 'LXXXII', 'LXXXIII', 'LXXXIV', 'LXXXV',
        'LXXXVI', 'LXXXVII', 'LXXXVIII', 'LXXXIX', 'XC', 'XCI', 'XCII', 'XCIII', 'XCIV', 'XCV', 'XCVI', 'XCVII', 'XCVIII',
        'XCIX', 'C'
      ]
    };
  }

  /**
   * Translate a number to a word in the specified language
   * @param {number} num - Number to translate
   * @param {string} language - Target language
   * @returns {string} Translated word
   */
  translateNumber(num, language) {
    switch (language) {
      case 'kinyarwanda':
        return this.toKinyarwandaWord(num);
      case 'english':
        return this.toEnglishWord(num);
      case 'france':
        return this.toFrenchWord(num);
      case 'roman':
        return this.toRomanWord(num);
      default:
        return this.toEnglishWord(num);
    }
  }

  /**
   * Translate a number to Kinyarwanda word
   * @param {number} num - Number to translate
   * @returns {string} Kinyarwanda word
   */
  toKinyarwandaWord(num) {
    // Placeholder for Kinyarwanda implementation
    // This would need to be implemented based on the complex Kinyarwanda number system
    return this.wordLists.kinyarwanda[num] || num.toString();
  }

  /**
   * Translate a number to English word
   * @param {number} num - Number to translate
   * @returns {string} English word
   */
  toEnglishWord(num) {
    const words = this.wordLists.english;
    const string = num.toString();
    let inWord = '';

    if (string.length === 1) {
      inWord = words[num - 1];
    } else if (string.length === 2) {
      if (string[0] === '1') {
        inWord = words[parseInt(string[1]) + 9];
      } else if (string[0] !== '0') {
        if (string[1] === '0' && string !== '10') {
          inWord = words[parseInt(string[0] - 1) + 18];
        } else if (string[1] !== '0' && parseInt(string) > 20) {
          inWord = `${words[parseInt(string[0] - 1) + 18]} ${words[parseInt(string[1] - 1)]}`;
        }
      }
    } else if (string.length === 3 && string === '100') {
      inWord = words[27];
    }

    return inWord || num.toString();
  }

  /**
   * Translate a number to French word
   * @param {number} num - Number to translate
   * @returns {string} French word
   */
  toFrenchWord(num) {
    // For numbers 1-100, we can directly index into the french words array
    if (num >= 1 && num <= 100) {
      return this.wordLists.france[num - 1];
    }
    return num.toString();
  }

  /**
   * Translate a number to Roman numeral
   * @param {number} num - Number to translate
   * @returns {string} Roman numeral
   */
  toRomanWord(num) {
    // For numbers 1-100, we can directly index into the roman words array
    if (num >= 1 && num <= 100) {
      return this.wordLists.roman[num - 1];
    }
    return num.toString();
  }

  /**
   * Read the text aloud
   * @param {string} text - Text to read
   * @param {number} speed - Reading speed
   */
  speak(text, speed = 1) {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = Number.isFinite(speed) ? speed : 1;
      
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();
      
      // Speak the new text
      window.speechSynthesis.speak(utterance);
    }
  }
} 