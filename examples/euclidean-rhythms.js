require('../src/names').into(global);
const selectOutput = require('../src/midi/select-output');
const { Song, Rhythm } = require('../src');
const { distribute } = Rhythm;

const song = new Song({
  bpm: 120,
  sections: [{
    parts: [{
      rate: 1,
      rhythm: 'XxxxXxxxXxxxXxxx',
      pitches: [KICK],
    },{
      rate: 1/2,
      rhythm: distribute(7, 32),
      pitches: [SNARE],
    },{
      rate: 1/4,
      rhythm: distribute(37, 64),
      pitches: [CLOSED_HIHAT],
    }]
  }]
});

selectOutput().then(output => output.play(song));
