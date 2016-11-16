require('../src/names').into(global);
const { Song } = require('../src');
const { MidiOut } = require('../src/midi');

const song = new Song({
  bpm: 120,
  sections: [{
    parts: [{
      rhythm: 'X.x.x.x.|X.x.x..x|X.x.x.x.|X...xxxx|X',
      pulse: 1/2,
      pitches: [KICK], // intended to be used with a drum sound
    }]
  }]
});

MidiOut.select().then(midiOut => midiOut.play(song));
