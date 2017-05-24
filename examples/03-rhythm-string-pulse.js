const { Song, Output } = require('chorus');
require('chorus/names').into(global);

const song = new Song({
  sections: [{
    parts: [{
      pitches: [C4, D4, E4, D4, E4, F4, E4, C4, D4, B3, C4],
      rhythm: {
        pattern: "Xxx.|Xxx=|x.x.|x.x=|X===",
        pulse: 0.5,
      }
    }]
  }]
});

Output.select().then(output => output.play(song));
