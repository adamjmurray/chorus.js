require('../src/names').into(global);
const { MIDIOut } = require('../src/midi');
const { Song, Rhythm } = require('../src/generators');

const song = new Song({
  bpm: 120,
  sections: [{
    tracks: [
      {
        rate: 1,
        rhythm: 'XxxxXxxxXxxxXxxx',
        pitches: [C2], // kick
      },
      {
        rate: 1/2,
        rhythm: Rhythm.euclidean(6,32, { rate: 1/2 }), // TODO: can the track set this?
        // maybe this would be nicer: rhythm: distribute(6, 32), and maybe it should just return a String
        pitches: [E2], // snare (rim)
      },
      {
        rate: 1/4,
        rhythm: Rhythm.euclidean(37,64, { rate: 1/4 }), // TODO: can the track set this?
        pitches: [Gb2], // snare (rim)
      }
    ]
  }]
});

const output = new MIDIOut();
output.open();
output.play(song);
