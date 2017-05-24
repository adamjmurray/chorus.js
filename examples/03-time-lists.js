const { Song, Output } = require('chorus');
require('chorus/names').into(global);

const song = new Song({
  bpm: 132,
  sections: [{
    parts: [{
      pitches: [C4, D4,  E4,  F4, C4, D4,  E4,  G4,  B3,  C4],
      rhythm:  [1,  0.5, 0.5, 2,  1,  0.5, 0.5, 1.5, 0.5, 4],
    }]
  }]
});

Output.select().then(output => output.play(song));
