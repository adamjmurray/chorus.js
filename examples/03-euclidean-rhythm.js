const { Song, Rhythm, Output } = require('chorus');
const { distribute } = Rhythm;
require('chorus/names').into(global);

const song = new Song({
  sections: [{
    parts: [{
      pulse: 1/2,
      rhythm: distribute(6, 8),
      pitches: [C4],
    }]
  }]
});

Output.select().then(output => output.play(song));
