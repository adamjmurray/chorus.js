const { Song, Output } = require('chorus');
require('chorus/names').into(global);

const song = new Song({
  bpm: 132,
  sections: [{
    parts: [{
      pitches: [C4, C4, C4, C4, E4, G4, Bb4, C5],
      rhythm: {
        pattern: [1, 1, 1, 1, 1, 1, 1, 1],
        durations: [0.5, 0.25, 0.05, 6, 5, 4, 3, 2],
      },
    }]
  }]
});

Output.select().then(output => output.play(song));
