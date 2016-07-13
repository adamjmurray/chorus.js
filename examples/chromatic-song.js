require('../src/names').into(global);
const { MIDIOut } = require('../src/midi');
const { Song } = require('../src/generators');

const song = new Song({
  bpm: 120,
  sections: [{
    scale: MAJOR.C, // we really just need a root here but oh well
    tracks: [{
      mode: 'chromatic',
      rate: 1/2,
      rhythm: 'XxxxXxxxXxxxX===', // TODO: rhythm should not be necessary in this case (port harmony default to rhythm class?) but it is useful as an option!
      pitches: [4, 12, 11, 1, 3, 2, 7, 9, 8, 6, 10, 5, 0],
    }]
  }]
});

const output = new MIDIOut();
output.open();
output.play(song);
