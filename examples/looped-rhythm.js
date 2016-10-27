require('../src/names').into(global);
const selectOutput = require('./helpers/select-output');
const { Song, Rhythm } = require('../src');

const song = new Song({
  bpm: 120,
  sections: [{
    length: 32,
    parts: [{
      looped: true,
      rhythm: new Rhythm([1.5, 0.5], {
        rate: 1,
        intensities: [1, 0.6, 0.3, 0.9, 0.5],
        durations: [1, 0.5, 0.25],
        looped: true,
      }),
      pitches: [C4, D4, E4, G4, D4, A3, G3],
    }]
  }]
});

selectOutput().then(output => output.play(song));
