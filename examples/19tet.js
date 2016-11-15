require('../src/names').into(global);
const { PitchClass, Scale, Song } = require('../src');
const { MidiOut } = require('../src/midi');

// This example uses a scale based on 19-TET (https://en.wikipedia.org/wiki/19_equal_temperament)
// which has 19 pitches per octave. It approximates a minor scale.
// To hear this properly, you need to use a synthesizer with microtonal support: http://xenharmonic.wikispaces.com/List+of+Microtonal+Software+Plugins
// and tune it to a 19-TET tuning (TODO: more info on this and provide some 19-TET tuning files)

const song = new Song({
  bpm: 120,
  sections: [{
    scale: new Scale([3,2,3,3,2,3,3], new PitchClass(0,19)),
    harmony: {
      rate: 4,
      chords: [TRIAD_PLUS_8(0), TRIAD_PLUS_8(2), TRIAD_PLUS_8(3), SEVENTH(4), TRIAD_PLUS_8(0)]
    },
    parts: [{
      mode: 'chord',
      rate: 1,
      octave: 3,
      rhythm: 'XxXx|Xxxx|XxXx|xxxx|X===',
      pitches: [0,0,0,0,0,0,0,0,-1,-1,-1,-1,-1,-1,-2,-2,0],
    }]
  }]
});

MidiOut.select().then(midiOut => midiOut.play(song));
