const { Song, Output } = require('chorus');
require('chorus/names').into(global);

const song = new Song({
  bpm: 132,
  sections: [{
    parts: [{
      pitches: [KICK, SNARE, RIM, CLAP, CLOSED_HIHAT, OPEN_HIHAT, CYMBAL],
    }]
  }]
});

Output.select().then(output => output.play(song));
