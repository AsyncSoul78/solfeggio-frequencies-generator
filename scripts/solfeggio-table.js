// The nine solfeggio tones with their syllable, nearest piano note, offset in cents,
// period and wavelength in air.
// Usage: node scripts/solfeggio-table.js [--csv out.csv]
const fs = require('fs');

const TONES = [
  { hz: 174, syllable: '' },
  { hz: 285, syllable: '' },
  { hz: 396, syllable: 'UT' },
  { hz: 417, syllable: 'RE' },
  { hz: 528, syllable: 'MI' },
  { hz: 639, syllable: 'FA' },
  { hz: 741, syllable: 'SOL' },
  { hz: 852, syllable: 'LA' },
  { hz: 963, syllable: '' },
];
const NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const SOUND_SPEED = 343; // m/s in air at 20 °C

function nearestNote(hz, a4 = 440) {
  const semis = 12 * Math.log2(hz / a4);
  const midi = Math.round(semis) + 69;
  const cents = Math.round((semis - (midi - 69)) * 100);
  return { note: NAMES[midi % 12] + (Math.floor(midi / 12) - 1), midi, cents };
}

function digitRoot(n) {
  return 1 + ((n - 1) % 9);
}

function rows() {
  return TONES.map(t => {
    const n = nearestNote(t.hz);
    return {
      hz: t.hz,
      syllable: t.syllable,
      note: n.note,
      cents: n.cents,
      digitRoot: digitRoot(t.hz),
      periodMs: +(1000 / t.hz).toFixed(3),
      wavelengthCm: +(SOUND_SPEED / t.hz * 100).toFixed(1),
    };
  });
}

function toCsv(list) {
  const head = 'frequency_hz,syllable,nearest_note,cents,digit_root,period_ms,wavelength_cm';
  return [head, ...list.map(r => [r.hz, r.syllable, r.note, r.cents, r.digitRoot, r.periodMs, r.wavelengthCm].join(','))].join('\n') + '\n';
}

if (require.main === module) {
  const list = rows();
  const i = process.argv.indexOf('--csv');
  if (i > 0) {
    const out = process.argv[i + 1] || 'solfeggio-frequencies.csv';
    fs.writeFileSync(out, toCsv(list));
    console.log(`${list.length} tones written to ${out}`);
  } else {
    for (const r of list) {
      const sign = r.cents >= 0 ? '+' : '';
      console.log(`${String(r.hz).padStart(4)} Hz  ${r.syllable.padEnd(3)}  ${r.note.padEnd(4)} ${sign}${r.cents} cents  root ${r.digitRoot}  ${r.wavelengthCm} cm`);
    }
  }
}

module.exports = { TONES, nearestNote, digitRoot, rows, toCsv };
