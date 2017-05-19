require('chorus/names').into(global);
const { Song, Output } = require('chorus');

const song = new Song({
  bpm: 120,
  sections: [{
    parts: [{
      rhythm: 'X.x.x.x.|X.x.x..x|X.x.x.x.|X...xxxx|X',
      pulse: 1/2,
      pitches: [KICK], // intended to be used with a drum sound
    }]
  }]
});

Output.select().then(output => output.play(song));
