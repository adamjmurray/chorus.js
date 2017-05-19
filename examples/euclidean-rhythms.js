require('chorus/names').into(global);
const { Song, Rhythm, Output } = require('chorus');
const { distribute } = Rhythm;

const song = new Song({
  bpm: 120,
  sections: [{
    parts: [{
      pulse: 1,
      rhythm: 'XxxxXxxxXxxxXxxx',
      pitches: [KICK], // intended to be used with a kick drum sound
    },{
      pulse: 1/2,
      rhythm: distribute(7, 32),
      pitches: [SNARE], // intended to be used with a snare sound
    },{
      pulse: 1/4,
      rhythm: distribute(37, 64),
      pitches: [CLOSED_HIHAT],  // intended to be used with a high-hat cymbal sound
    }]
  }]
});

Output.select().then(output => output.play(song));
