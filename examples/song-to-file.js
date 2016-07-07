require('../src/names').into(global);
const { MIDIFile } = require('../src/midi');
const { Song } = require('../src/generators');

const song = new Song({
  bpm: 120,
  sections: [{
    //scale: HARMONIC_MINOR.at(C), // TODO: move out here
    harmony: {
      scale: HARMONIC_MINOR.at(C),
      // TODO: support lazy inversions without applying the scale
      chords: [TRIAD.at(0), TRIAD.at(5), TRIAD.at(3), TRIAD.at(4), TRIAD.at(0)],
      rate: 4 },
    tracks: [{
      channel: 1,
      rate: 1/4,
      rhythm: 'X=.x=.x.X=.x=.x.|X=.x==x.X=xX.xX.|X=.x=.x.X=.x=.x.|X=.x==x.x=X.x.x.|X===', // X: accented, x: normal, =: tie, .: rest
      pitches: [0, 1, 2, -1, 0, 2, 1, 0, -1, 1, 0, 2, -1, 0],
      follow: 'chords',
    }]
  }]
});

new MIDIFile('./song-to-file-example.mid')
  .write(song.toJSON())
  .then(() => console.log('wrote song-to-file-example.mid'))
  .catch(err => console.error('Failed to write MIDI file', err));
