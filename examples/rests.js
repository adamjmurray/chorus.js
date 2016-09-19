require('../src/names').into(global);
const selectOutput = require('./helpers/select-output');
const { Song } = require('../src');

const song = new Song({
  bpm: 120,
  sections: [{
    scale: HARMONIC_MINOR.C,
    harmony: {
      rate: 4,
      chords: [TRIAD(0), TRIAD(5), TRIAD(3), TRIAD(4), TRIAD(0)] },
    tracks: [{
      mode: 'arpeggio',
      rate: 1/4,
      rhythm: [
        1, -2, 1, -4, 1, -2, 1, -4,
        1, -2, 1, -4, 1, -2, 1, -4,
        1, -2, 1, -4, 1, -2, 1, -4,
        1, -2, 1, -4, 1, -2, 1, -4,
        16,
      ],
      pitches: [0, 1, 2, 1],
    }]
  }]
});

selectOutput().then(output => output.play(song));
