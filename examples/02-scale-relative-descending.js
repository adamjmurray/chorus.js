const { Song, Output } = require('chorus');
require('chorus/names').into(global);

const song = new Song({
  sections: [{
    scale: MAJOR(C),
    parts: [{
      mode: 'scale',
      pitches: [0, -1, -2, -3, -4, -5, -6, -7],
    }]
  }]
});

Output.select().then(output => output.play(song));
