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
    chords: [TRIAD.at(0), TRIAD.at(5), TRIAD.at(3), SEVENTH.at(4), TRIAD.at(0)],
    rate: 4,
  },
  tracks: [
    {
      channel: 1, // defaults to track index+1
      follow: 'chords', // or 'scale' or null (chromatic), maybe 'full-chords'?
      // TODO: might not be ending on correct chord? seems a little wonky. Debug. Write tests!
      rhythm: 'X=.x=.x.X=.x=.x.X=.x==x.X=xX.xX.X=.x=.x.X=.x=.x.X=.x==x.X=x.X.x.X===', // X: accented, x: normal, -: tie, .: rest
      // TODO: support an array of numbers for the rhythm, relative to the given rate (1 == rate value)
      // but then I guess we also need an intensities array
      rate: 1/4, // duration of each char in the rhythm
      pitches: [0, 1, 2, 0, 1, 2, 0, 1, 2, 3, 2, 1, 0, 2],
      // also support simultaneous notes like pitches: [[0,1], [2,1]]
    }
  ]
});

const output = new MIDIOut({ defaultDuration: 1000 });
output.open();
output.play(song);


