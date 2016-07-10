require('../src/names').into(global);
const { MIDIOut } = require('../src/midi');
const { Song } = require('../src/generators');

const song = new Song({
  bpm: 120,
  sections: [{
    tracks: [{
      rate: 1/2,
      rhythm: 'X.x.x.x.|X.x.x..x|X.x.x.x.|X...xxxx|X',
      pitches: [C4], // TODO: make this the default if no pitches are given? support pitch (singular) property?
    }]
  }]
});

const output = new MIDIOut();
output.open();
output.play(song);
