require('../src/names').into(global);
const { Song } = require('../src');
const { MidiOut } = require('../src/midi');

const song = new Song({
  bpm: 120,
  sections: [{
    scale: HARMONIC_MINOR(C),
    harmony: {
      rate: 4,
      chords: [TRIAD(0), TRIAD(5).inv(-2), TRIAD(3).inv(-1), SEVENTH(4).inv(-2), TRIAD(0)],
    },
    parts: [{
      channel: 1,
      mode: 'bass',
      octave: 2,
      rate: 1/2,
      rhythm: 'X.x.x.x.|X.x.x..x|X.x.x.x.|X...xxxx|X',
      pitches: [0,0,0,2],
    }, {
      channel: 1,
      mode: 'arpeggio',
      rate: 1/4,
      rhythm: 'X=.x=.x.X=.x=.x.|X=.x==x.X=xX.xX.|X=.x=.x.X=.x=.x.|X=.x==x.x=X.x.x.|X===', // X: accented, x: normal, =: tie, .: rest
      pitches: [0, 1, 2, -1, 0, 2, 1, 0, -1, 1, 0, 2, -1, 0],
    }]
  }]
});

MidiOut.select().then(midiOut => midiOut.play(song));
