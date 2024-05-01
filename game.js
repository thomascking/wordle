require('colors');
const { readFile } = require('fs/promises');
const { createInterface, moveCursor, clearScreenDown } = require('readline');

const reader = createInterface({
  input: process.stdin,
  output: process.stdout,
});

const NONE = 0;
const WRONG = 1;
const RIGHT = 2;

// Pick a random word from 5-letter words
async function loadWords() {
  const file = await readFile('5-letter.txt', {
    encoding: 'utf8',
  });
  return file.split('\n');
}

function pickWord(words) {
  return words[Math.floor(words.length * Math.random())];
}

// Compare entered word
function compareWords(target, guess) {
  const response = [];
  for (let i = 0; i < guess.length; i++) {
    response[i] = guess.charAt(i) === target.charAt(i)
      ? RIGHT
      : target.indexOf(guess.charAt(i)) > -1
        ? WRONG
        : NONE;
  }
  return response;
}

async function run() {
  const words = await loadWords();
  const selected = pickWord(words);
  // console.log(selected);
  reader.prompt();
  let guesses = 0;
  reader.on('line', function (guess) {
    moveCursor(process.stdout, 0, -1);
    clearScreenDown(process.stdout);
    guess = guess.trim();
    const hits = compareWords(selected, guess);
    const letters = guess.split('');
    console.log(letters.map(function (letter, i) {
      switch (hits[i]) {
        case NONE:
          return letter;
        case WRONG:
          return letter.red;
        case RIGHT:
          return letter.green;
        default:
          return letter;
      }
    }).join(''));
    if (guess === selected) {
      process.exit(0);
    }
    if (guesses++ > 4) {
      process.exit(0);
    }
    reader.prompt();
  });
}

run().catch(console.error);
