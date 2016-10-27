require('../src/names').into(global);
const selectOutput = require('./helpers/select-output');
const { Song } = require('../src');

const song = new Song({
  bpm: 120,
  sections: [
    {
      length: 8,
      parts: [{
        looped: true,
        rhythm: [1, 1.5, 0.5],
        pitches: [C4, D4, E4, G4, F4, D4, A3, D4],
      }]
    },
    {
      length: 8,
      parts: [{
        looped: true,
        rhythm: [0.66, 0.34],
        pitches: [G4, F4, D4, B3, A3],
      }]
    },
    {
      parts: [{
        rhythm: [1],
        pitches: [C4],
      }]
    }
  ]
});

selectOutput().then(output => output.play(song));
