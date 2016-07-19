require('../src/names').into(global);
const { MIDIOut } = require('../src/midi');
const { Song } = require('../src/generators');

const song = new Song({
  bpm: 120,
  sections: [{
    scale: MAJOR.C,
    harmony: {
      rate: 4,
      chords: [TRIAD(0), TRIAD(5), TRIAD(3), TRIAD(4), TRIAD_PLUS_8(0)] },
    tracks: [{
      mode: 'chord',
      rate: 1/4,
      rhythm: 'X=.x=.x.X=.x=.x.|X=.x==x.X=xX.xX.|X=.x=.x.X=.x=.x.|X=.x==x.x=X.x.x.|X=======', // X: accented, x: normal, =: tie, .: rest
      pitches: [0, 1, 2, -1, 0, 2, 1, 0, -1, 1, 0, 2, -1, 0],
    }]
  }]
});

const output = new MIDIOut();
output.open();
output.play(song);
