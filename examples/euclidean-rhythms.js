require('../src/names').into(global);
const { MIDIOut } = require('../src/midi');
const { Song, Rhythm } = require('../src/generators');
const { distribute } = Rhythm;

const song = new Song({
  bpm: 120,
  sections: [{
    tracks: [{
      rate: 1,
      rhythm: 'XxxxXxxxXxxxXxxx',
      pitches: [C2], // kick
    },{
      rate: 1/2,
      rhythm: distribute(7, 32),
      pitches: [E2], // snare (rim)
    },{
      rate: 1/4,
      rhythm: distribute(37, 64),
      pitches: [Gb2], // snare (rim)
    }]
  }]
});

const output = new MIDIOut();
output.open();
output.play(song);
