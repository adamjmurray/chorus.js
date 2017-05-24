const { Song, Output } = require('chorus');
require('chorus/names').into(global);

const song = new Song({
  sections: [{
    scale: MAJOR(C),
    parts: [{
      mode: 'scale',
      pitches: [C4, D4, E4, F4, G4, F4, D4, B3, C4],
    }]
  }]
});

Output.select().then(output => output.play(song));
