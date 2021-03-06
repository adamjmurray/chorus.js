const { Song, Output } = require('chorus');
require('chorus/names').into(global);

const song = new Song({
  bpm: 240,
  sections: [{
    parts: [{
      pitches: [C4, D4, E4, F4, G4, F4, E4, D4, C4],
    }]
  }]
});

Output.select().then(output => output.play(song));
