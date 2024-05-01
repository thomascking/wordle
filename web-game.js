const NONE = 0;
const WRONG = 1;
const RIGHT = 2;

function get(id) {
  return document.getElementById(id);
}

async function loadWords() {
  let response = await fetch('./5-letter.txt');
  let text = await response.text();
  return text.split('\n').map(word => word.trim());
}

function pickWord(words) {
  return words[Math.floor(words.length * Math.random())];
}

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

(async () => {
  let words = await loadWords();
  let word = pickWord(words);
  console.log(word);
  let guess = 1;
  const form = get('form');
  const input = get('input');
  const reset = get('reset');
  let previous = [];

  form.addEventListener('submit', event => {
    event.preventDefault();
    const userGuess = input.value.trim();
    // check for valid word
    if (!words.includes(userGuess)) {
      console.log(words);
      alert(`${userGuess} is not in the word list`);
      return;
    }
    // check against previous guesses
    if (previous.includes(userGuess)) {
      alert('You\'ve already guessed that.');
      return;
    }
    previous.push(userGuess);
    const hits = compareWords(word, userGuess);
    const letters = userGuess.split('');

    const guessRow = get(`guess_${guess}`);
    const letterDivs = guessRow.querySelectorAll('.letter');
    console.log(letterDivs);

    letters.forEach((letter, i) => {
      letterDivs[i].innerText = letter;
      switch (hits[i]) {
        case WRONG:
          letterDivs[i].classList.add('wrong');
          break;
        case RIGHT:
          letterDivs[i].classList.add('right');
          break;
      }
    });
    guess++;
    input.value = '';
    if (guess > 6) {
      setTimeout(() =>
        alert(`The word was ${word}`), 1
      );
      input.setAttribute('disabled', true);
      form.querySelector('button').setAttribute('disabled', true);
    }
  });

  reset.addEventListener('click', () => {
    input.removeAttribute('disabled')
    form.querySelector('button').removeAttribute('disabled');
    word = pickWord(words);
    guess = 1;
    const letters = document.getElementsByClassName('letter');
    for (let letter of letters) {
      letter.innerText = '';
      letter.classList.remove('right', 'wrong');
    }
    previous = [];
  });
})();
