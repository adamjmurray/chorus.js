require('../src/names').into(global);
const { Chord, Song } = require('../src');
const { MidiOut } = require('../src/midi');

const song = new Song({
  bpm: 120,
  sections: [{
    scale: HARMONIC_MINOR(C),
    harmony: {
      chords: [new Chord([0,2,4], {root: 1, inversion: 1, shifts: [-1]}), SEVENTH(4).inv(-2), TRIAD_PLUS_8(0)],
      durations: [2],
    },
    parts: [{
      mode: 'chord',
      rhythm: 'XXX=',
      pulse: 2,
      pitches: [0],
      octave: 3,
    }]
  }]
});

MidiOut.select().then(midiOut => midiOut.play(song));
