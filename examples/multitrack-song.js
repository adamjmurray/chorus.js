require('../src/names').into(global);
const { MIDIOut } = require('../src/midi');
const { Song } = require('../src/generators');

const song = new Song({
  bpm: 120,
  sections: [{
    scale: HARMONIC_MINOR.C,
    harmony: {
      rate: 4,
      // TODO: support lazy inversions without applying the scale
      chords: [TRIAD[0], TRIAD[5], TRIAD[3], TRIAD[4], TRIAD[0]] },
    tracks: [{
      channel: 1, // this is the default, but it's best to be explicit with multiple tracks
      rate: 1/2,
      rhythm: 'X.x.x.x.|X.x.x..x|X.x.x.x.|X...xxxx|X',
      pitches: [C4], // TODO: make this the default if no pitches are given? support pitch (singular) property?
    }, {
      channel: 2, // this is the default, but it's best to be explicit with multiple tracks
      mode: 'arpeggio',
      rate: 1/4,
      rhythm: 'X=.x=.x.X=.x=.x.|X=.x==x.X=xX.xX.|X=.x=.x.X=.x=.x.|X=.x==x.x=X.x.x.|X===', // X: accented, x: normal, =: tie, .: rest
      pitches: [0, 1, 2, -1, 0, 2, 1, 0, -1, 1, 0, 2, -1, 0],
    }]
  }]
});

const output = new MIDIOut();
output.open();
output.play(song);
