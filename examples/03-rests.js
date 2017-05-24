const { Song, Output } = require('chorus');
require('chorus/names').into(global);

const song = new Song({
  bpm: 132,
  sections: [{
    parts: [{
      pitches: [C4, C4,        C4,          C4,          C4],
      rhythm:  [1,  0.5, -0.5, 0.25, -0.75, 0.05, -0.95, 4],
    }]
  }]
});

Output.select().then(output => output.play(song));