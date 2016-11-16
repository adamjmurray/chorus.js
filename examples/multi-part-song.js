require('../src/names').into(global);
const { Song } = require('../src');
const { MidiOut } = require('../src/midi');

const song = new Song({
  bpm: 120,
  sections: [{
    scale: HARMONIC_MINOR(C),
    harmony: {
      chords: [TRIAD(0), TRIAD(5), TRIAD(3), TRIAD(4), TRIAD(0)],
      durations: [4],
    },
    parts: [{
      channel: 1, // this is the default, but it's best to be explicit with multiple tracks
      pulse: 1/2,
      rhythm: 'X.x.x.x.|X.x.x..x|X.x.x.x.|X...xxxx|X',
      pitches: [KICK], // intended to be used with a drum sound
    }, {
      channel: 2, // this is the default, but it's best to be explicit with multiple tracks
      mode: 'arpeggio',
      pulse: 1/4,
      rhythm: 'X=.x=.x.X=.x=.x.|X=.x==x.X=xX.xX.|X=.x=.x.X=.x=.x.|X=.x==x.x=X.x.x.|X===', // X: accented, x: normal, =: tie, .: rest
      pitches: [0, 1, 2, -1, 0, 2, 1, 0, -1, 1, 0, 2, -1, 0],
    }]
  }]
});

MidiOut.select().then(midiOut => midiOut.play(song));
