require('../src/names').into(global);
const { MidiFile } = require('../src/midi');
const { Song } = require('../src');

const song = new Song({
  bpm: 110,
  sections: [{
    scale: HARMONIC_MINOR(C),
    harmony: {
      chords: [TRIAD(0), TRIAD(5), TRIAD(3), TRIAD(4), TRIAD(0)],
      durations: [4],
    },
    parts: [{
      mode: 'arpeggio',
      pulse: 1/4,
      rhythm: 'X=.x=.x.X=.x=.x.|X=.x==x.X=xX.xX.|X=.x=.x.X=.x=.x.|X=.x==x.x=X.x.x.|X===', // X: accented, x: normal, =: tie, .: rest
      pitches: [0, 1, 2, -1, 0, 2, 1, 0, -1, 1, 0, 2, -1, 0],
    }]
  }]
});

new MidiFile('song-to-file-example.mid')
  .write(song.toJSON())
  .then(() => console.log('wrote song-to-file-example.mid'))
  .catch(err => console.error('Failed to write MIDI file', err));
