require('../src/names').into(global);
const { Song, Rhythm } = require('../src');
const { distribute } = Rhythm;
const { MidiOut } = require('../src/midi');

const song = new Song({
  bpm: 120,
  sections: [{
    parts: [{
      rate: 1,
      rhythm: 'XxxxXxxxXxxxXxxx',
      pitches: [KICK],
    },{
      rate: 1/2,
      rhythm: distribute(7, 32),
      pitches: [SNARE],
    },{
      rate: 1/4,
      rhythm: distribute(37, 64),
      pitches: [CLOSED_HIHAT],
    }]
  }]
});

MidiOut.select().then(midiOut => midiOut.play(song));
