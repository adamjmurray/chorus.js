require('../src/names').into(global);
const selectOutput = require('../src/midi/select-output');
const { Song } = require('../src');

const song = new Song({
  bpm: 120,
  sections: [{
    scale: MAJOR(C),
    harmony: {
      rate: 4,
      chords: [TRIAD(0), TRIAD(5), TRIAD(3), TRIAD(4), TRIAD_PLUS_8(0)] },
    parts: [{
      mode: 'chord',
      rate: 1/4,
      rhythm: 'X=.x=.x.X=.x=.x.|X=.x==x.X=xX.xX.|X=.x=.x.X=.x=.x.|X=.x==x.x=X.x.x.|X=======', // X: accented, x: normal, =: tie, .: rest
      pitches: [0, 1, 2, -1, 0, 2, 1, 0, -1, 1, 0, 2, -1, 0],
      octave: 3,
    }]
  }]
});

selectOutput().then(output => output.play(song));
