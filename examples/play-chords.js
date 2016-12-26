require('../src/names').into(global);
const { Song, Output } = require('../src');

const song = new Song({
  bpm: 120,
  sections: [{
    scale: MAJOR(C),
    harmony: {
      chords: [TRIAD(0), TRIAD(5), TRIAD(3), TRIAD(4), TRIAD_PLUS_8(0)],
      durations: [4],
    },
    parts: [{
      mode: 'chord',
      pulse: 1/4,
      rhythm: 'X=.x=.x.X=.x=.x.|X=.x==x.X=xX.xX.|X=.x=.x.X=.x=.x.|X=.x==x.x=X.x.x.|X=======', // X: accented, x: normal, =: tie, .: rest
      pitches: [0, 1, 2, -1, 0, 2, 1, 0, -1, 1, 0, 2, -1, 0],
      octave: 3,
    }]
  }]
});

Output.select().then(output => output.play(song));
