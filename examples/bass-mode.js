require('chorus/names').into(global);
const { Song, Output } = require('chorus');

const song = new Song({
  bpm: 120,
  sections: [{
    scale: HARMONIC_MINOR(C),
    harmony: {
      chords: [TRIAD(0), TRIAD(5).inv(-2), TRIAD(3).inv(-1), SEVENTH(4).inv(-2), TRIAD(0)],
      durations: [4],
    },
    parts: [{
      channel: 1,
      mode: 'bass',
      octave: 2,
      rhythm: 'X.x.x.x.|X.x.x..x|X.x.x.x.|X...xxxx|X',
      pulse: 1/2,
      pitches: [0,0,0,2],
    }, {
      channel: 1,
      mode: 'arpeggio',
      rhythm: 'X=.x=.x.X=.x=.x.|X=.x==x.X=xX.xX.|X=.x=.x.X=.x=.x.|X=.x==x.x=X.x.x.|X===', // X: accented, x: normal, =: tie, .: rest
      pulse: 1/4,
      pitches: [0, 1, 2, -1, 0, 2, 1, 0, -1, 1, 0, 2, -1, 0],
    }]
  }]
});

Output.select().then(output => output.play(song));
