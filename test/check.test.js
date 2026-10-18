// Run: npm test
const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');
const { TONES, nearestNote, digitRoot, rows, toCsv } = require('../scripts/solfeggio-table');
const { interval } = require('../scripts/interval');

test('nine tones from 174 to 963 Hz', () => {
  assert.strictEqual(TONES.length, 9);
  assert.strictEqual(TONES[0].hz, 174);
  assert.strictEqual(TONES[8].hz, 963);
  assert.strictEqual(TONES.find(t => t.hz === 528).syllable, 'MI');
});

test('528 Hz sits 16 cents above C5', () => {
  assert.deepStrictEqual(nearestNote(528), { note: 'C5', midi: 72, cents: 16 });
  assert.deepStrictEqual(nearestNote(440), { note: 'A4', midi: 69, cents: 0 });
});

test('digit roots follow the 3, 6, 9 pattern', () => {
  assert.deepStrictEqual(TONES.map(t => digitRoot(t.hz)), [3, 6, 9, 3, 6, 9, 3, 6, 9]);
});

test('published CSV matches the script', () => {
  const csv = fs.readFileSync(path.join(__dirname, '..', 'solfeggio-frequencies.csv'), 'utf8').replace(/\r/g, '');
  assert.strictEqual(csv, toCsv(rows()));
});

test('intervals', () => {
  assert.strictEqual(interval(440, 880).name, 'octave');
  assert.strictEqual(interval(440, 660).name, 'perfect fifth');
  assert.strictEqual(interval(528, 396).name, 'perfect fourth');
});
