const { Song, Output } = require('chorus');
require('chorus/names').into(global);

const song = new Song({
  sections: [{
    scale: MAJOR(C),
    parts: [{
      mode: 'scale',
      pitches: [
        C4,
        [D4, F4],
        [E4, G4],
        [F4, A4],
        [G4, B4],
        [F4, A4],
        [D4, F4],
        [B3, D4],
        [C4, G3, C3]
      ],
    }]
  }]
});

Output.select().then(output => output.play(song));
