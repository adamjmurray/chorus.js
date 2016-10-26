const assert = require('assert');
const { Song, SCALES, CHORDS } = require('../../src');

function note({ time, pitch, velocity = 89, duration = 1, channel = 1}) {
  return { type: 'note', time, pitch, velocity, duration, release: 100, channel };
}

describe('Song', () => {

  describe('toJSON()', () => {
    it('supports scale mode', () => {
      const song = new Song({
        bpm: 120,
        sections: [{
          scale: SCALES.MAJOR.C,
          duration: 8,
          tracks: [{
            mode: 'scale',
            rate: 1,
            rhythm: [1],
            pitches: [0, 1, 2, 3, 4, 5, 6, 7, 8],
          }]
        }]
      });
      assert.deepEqual(song.toJSON(), {
        "bpm": 120,
        "tracks": [
          [
            note({ time: 0, pitch: 60 }),
            note({ time: 1, pitch: 62 }),
            note({ time: 2, pitch: 64 }),
            note({ time: 3, pitch: 65 }),
            note({ time: 4, pitch: 67 }),
            note({ time: 5, pitch: 69 }),
            note({ time: 6, pitch: 71 }),
            note({ time: 7, pitch: 72 }),
          ]
        ]
      });
    });

    it('supports chromatic mode', () => {
      const song = new Song({
        bpm: 120,
        sections: [{
          scale: SCALES.MAJOR.C,
          duration: 8,
          tracks: [{
            mode: 'chromatic',
            rate: 1,
            rhythm: [1],
            pitches: [0, 1, 2, 3, 4, 5, 6, 7, 8],
          }]
        }]
      });
      assert.deepEqual(song.toJSON(), {
        "bpm": 120,
        "tracks": [
          [
            note({ time: 0, pitch: 60 }),
            note({ time: 1, pitch: 61 }),
            note({ time: 2, pitch: 62 }),
            note({ time: 3, pitch: 63 }),
            note({ time: 4, pitch: 64 }),
            note({ time: 5, pitch: 65 }),
            note({ time: 6, pitch: 66 }),
            note({ time: 7, pitch: 67 }),
          ]
        ]
      });
    });

    it('supports chord mode', () => {
      const song = new Song({
        bpm: 120,
        sections: [{
          scale: SCALES.MAJOR.C,
          harmony: {
            rate: 2,
            chords: [CHORDS.TRIAD(0), CHORDS.TRIAD(1)] },
          tracks: [{
            mode: 'chord',
            rate: 1,
            rhythm: [1, 1, 1, 1],
            pitches: [0, 1],
          }]
        }]
      });
      assert.deepEqual(song.toJSON(), {
        "bpm": 120,
        "tracks": [
          [
            note({ time: 0, pitch: 60 }),
            note({ time: 0, pitch: 64 }),
            note({ time: 0, pitch: 67 }),
            note({ time: 1, pitch: 64 }),
            note({ time: 1, pitch: 67 }),
            note({ time: 1, pitch: 72 }),
            note({ time: 2, pitch: 62 }),
            note({ time: 2, pitch: 65 }),
            note({ time: 2, pitch: 69 }),
            note({ time: 3, pitch: 65 }),
            note({ time: 3, pitch: 69 }),
            note({ time: 3, pitch: 74 }),
          ]
        ]
      });
    });

    it('supports arpeggio mode', () => {
      const song = new Song({
        bpm: 120,
        sections: [{
          scale: SCALES.MAJOR.C,
          duration: 8,
          harmony: {
            rate: 4,
            chords: [CHORDS.TRIAD(0), CHORDS.TRIAD(1)] },
          tracks: [{
            mode: 'arpeggio',
            rate: 1,
            rhythm: [1],
            pitches: [0, 1, 2, 3],
            looped: true,
          }]
        }]
      });
      assert.deepEqual(song.toJSON(), {
        "bpm": 120,
        "tracks": [
          [
            note({ time: 0, pitch: 60 }),
            note({ time: 1, pitch: 64 }),
            note({ time: 2, pitch: 67 }),
            note({ time: 3, pitch: 72 }),
            note({ time: 4, pitch: 62 }),
            note({ time: 5, pitch: 65 }),
            note({ time: 6, pitch: 69 }),
            note({ time: 7, pitch: 74 }),
          ]
        ]
      });
    });

    it('supports bass mode', () => {
      const song = new Song({
        bpm: 120,
        sections: [{
          scale: SCALES.MAJOR.C,
          harmony: {
            rate: 2,
            chords: [CHORDS.TRIAD(0), CHORDS.TRIAD(5).inv(-2), CHORDS.TRIAD(3).inv(-1), CHORDS.SEVENTH(4).inv(-2), CHORDS.TRIAD(0)],
          },
          duration: 8,
          tracks: [{
            mode: 'bass',
            rate: 1,
            rhythm: [1],
            pitches: [0, 1],
            looped: true,
          }]
        }]
      });
      assert.deepEqual(song.toJSON(), {
        "bpm": 120,
        "tracks": [
          [
            note({ time: 0, pitch: 60 }),
            note({ time: 1, pitch: 62 }),
            note({ time: 2, pitch: 69 }),
            note({ time: 3, pitch: 71 }),
            note({ time: 4, pitch: 65 }),
            note({ time: 5, pitch: 67 }),
            note({ time: 6, pitch: 67 }),
            note({ time: 7, pitch: 69 }),
          ]
        ]
      });
    });
  });
});
