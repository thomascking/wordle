const { createReadStream, createWriteStream } = require('fs');
const { pipeline } = require('stream/promises');

async function run() {
    return await pipeline(
        createReadStream('english.txt', {
            encoding: 'utf8',
        }),
        async function* (source) {
            let current = '';
            for await (const chunk of source) {
                current = `${current}${chunk}`;
                words = current.split('\n');
                current = words.pop();
                for (const word of words) {
                    if (/^[a-z]{5}$/.test(word)) yield `${word}\n`;
                }
            }
        },
        createWriteStream('5-letter.txt', {
            encoding: 'utf8'
        }),
    );
}

run().catch(console.error);