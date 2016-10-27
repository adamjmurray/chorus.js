require('../src/names').into(global);
const selectOutput = require('./helpers/select-output');
const { Song } = require('../src');

const song = new Song({
  bpm: 160,
  sections: [
    {
      length: 16,
      scale: HARMONIC_MINOR.C,
      harmony: {
        rate: 4,
        looped: true,
        chords: [TRIAD(0), TRIAD(-2)]
      },
      tracks: [{
        looped: true,
        mode: 'arpeggio',
        rhythm: [1, 1.5, 1, 0.5],
        pitches: [0, 1, 2, 0],
      }]
    },
    {
      length: 16,
      scale: HARMONIC_MINOR.C,
      harmony: {
        rate: 4,
        looped: true,
        chords: [TRIAD(-4), TRIAD(-3)]
      },
      tracks: [{
        looped: true,
        mode: 'arpeggio',
        rhythm: [1, 1.5, 1, 0.5],
        pitches: [0, 1, 2, 0],
      }]
    },
    {
      tracks: [{
        rhythm: [1],
        pitches: [C4],
      }]
    }
  ]
});

selectOutput().then(output => output.play(song));
