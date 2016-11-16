require('../src/names').into(global);
const { Song, Rhythm } = require('../src');
const { MidiOut } = require('../src/midi');

const song = new Song({
  bpm: 120,
  sections: [{
    length: 32,
    parts: [{
      looped: true,
      rhythm: new Rhythm({
        pattern: [1.5, 0.5],
        intensities: [1, 0.6, 0.3, 0.9, 0.5],
        durations: [1, 0.5, 0.25],
        looped: true,
      }),
      pitches: [C4, D4, E4, G4, D4, A3, G3],
    }]
  }]
});

MidiOut.select().then(midiOut => midiOut.play(song));
