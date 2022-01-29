const { readFile, writeFile } = require('fs/promises');

async function loadWords() {
    const file = await readFile('5-letter.txt', {
        encoding: 'utf8',
    });
    return file.split('\n');
}

function scoreLetters(words) {
    const letters = {
        a: 0,
        b: 0,
        c: 0,
        d: 0,
        e: 0,
        f: 0,
        g: 0,
        h: 0,
        i: 0,
        j: 0,
        k: 0,
        l: 0,
        m: 0,
        n: 0,
        o: 0,
        p: 0,
        q: 0,
        r: 0,
        s: 0,
        t: 0,
        u: 0,
        v: 0,
        w: 0,
        x: 0,
        y: 0,
        z: 0,
    };
    for (const letter in letters) {
        for (const word of words) {
            if (word.indexOf(letter) > -1) {
                letters[letter]++;
            }
        }
    }
    return letters;
}

function scoreWords(words, letterScores) {
    const scores = [];
    for (const word of words) {
        let score = 0;
        for (const letter in letterScores) {
            if (word.indexOf(letter) > 0) {
                score += letterScores[letter];
            }
        }
        scores.push({
            word,
            score,
        });
    }
    return scores;
}

async function run() {
    const words = await loadWords();
    const letterScores = scoreLetters(words);
    const wordScores = scoreWords(words, letterScores);
    wordScores.sort(function(a, b) {
        return b.score - a.score;
    });
    const wordString = wordScores.map(function({word}){
        return word;
    }).join('\n');
    await writeFile('sorted.txt', wordString);
}

run().catch(console.error);