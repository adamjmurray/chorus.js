const { Song, Output } = require('chorus');
require('chorus/names').into(global);

const song = new Song({
  sections: [{
    parts: [{
      pitches: [C4, D4, E4, F4, G4, A4, B4, C5],
      rhythm: {
        pattern: [1, 1, 1, 1, 1, 1, 1, 1],
        intensities: [0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0],
      },
    }]
  }]
});

Output.select().then(output => output.play(song));
