require('../src/names').into(global);
const { MIDIOut } = require('../src/midi');
const { Song } = require('../src/generators');

const song = new Song({
  bpm: 120,
  //scale: HARMONIC_MINOR.at(C),
  //chords: [TRIAD.at(0), TRIAD.at(5), TRIAD.at(3), SEVENTH.at(4)], // wrap in a cycle? maybe sequencer does this automatically
  //chord_rate: 4,
  harmony: {
    scale: HARMONIC_MINOR.at(C),
    chords: [TRIAD.at(0), TRIAD.at(5), TRIAD.at(3), TRIAD.at(4), TRIAD.at(0)],
    rate: 4,
  },
  tracks: [
    {
      channel: 1, // defaults to track index+1
      follow: 'chords', // or 'scale' or null (chromatic), maybe 'full-chords'/'harmony'?
      rhythm: 'X=.x=.x.X=.x=.x. | X=.x==x.X=xX.xX. | X=.x=.x.X=.x=.x. | X=.x==x.X=x.X.x. | X===', // X: accented, x: normal, =: tie, .: rest
      pitches: [0, 1, 2, -1, 0, 2, 1, 0, -1, 1, 0, 2, -1, 0],
      rate: 1/4, // duration of each char in the rhythm
    }
  ]
});

const output = new MIDIOut({ defaultDuration: 1000 });
output.open();
output.play(song);


