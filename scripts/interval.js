// How far apart two tones are: frequency ratio, cents and the closest musical interval.
// Usage: node scripts/interval.js 396 528
const INTERVALS = [
  'unison', 'minor second', 'major second', 'minor third', 'major third', 'perfect fourth', 'tritone',
  'perfect fifth', 'minor sixth', 'major sixth', 'minor seventh', 'major seventh', 'octave',
];

function interval(a, b) {
  const [lo, hi] = a <= b ? [a, b] : [b, a];
  const cents = 1200 * Math.log2(hi / lo);
  const octaves = Math.floor(Math.round(cents / 100) / 12);
  const step = Math.round(cents / 100) - octaves * 12;
  let name = INTERVALS[step];
  if (octaves > 0 && step !== 0) name += ` + ${octaves} octave${octaves > 1 ? 's' : ''}`;
  if (octaves > 0 && step === 0) name = octaves === 1 ? 'octave' : `${octaves} octaves`;
  return { ratio: +(hi / lo).toFixed(4), cents: Math.round(cents), name, offset: Math.round(cents - Math.round(cents / 100) * 100) };
}

if (require.main === module) {
  const [a, b] = process.argv.slice(2).map(Number);
  if (!(a > 0 && b > 0)) { console.error('usage: interval.js <Hz> <Hz>'); process.exit(1); }
  const r = interval(a, b);
  const sign = r.offset >= 0 ? '+' : '';
  console.log(`${a} Hz and ${b} Hz: ratio ${r.ratio}, ${r.cents} cents, ${r.name} (${sign}${r.offset} cents)`);
}

module.exports = { interval };
