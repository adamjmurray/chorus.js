require('../src/names').into(global);
const { Song } = require('../src');
const { MidiOut } = require('../src/midi');

const song = new Song({
  bpm: 120,
  sections: [{
    scale: HARMONIC_MINOR(C),
    harmony: {
      chords: [TRIAD(0), TRIAD(5), TRIAD(3), TRIAD(4), TRIAD(0)],
      durations: [4],
    },
    parts: [{
      mode: 'arpeggio',
      rhythm: [
        1, -2, 1, -4, 1, -2, 1, -4,
        1, -2, 1, -4, 1, -2, 1, -4,
        1, -2, 1, -4, 1, -2, 1, -4,
        1, -2, 1, -4, 1, -2, 1, -4,
        16,
      ].map(time => time/4),
      pitches: [0, 1, 2, 1],
    }]
  }]
});

MidiOut.select().then(midiOut => midiOut.play(song));
