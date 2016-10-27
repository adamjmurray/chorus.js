const assert = require('assert');
const { Song, SCALES, CHORDS, PITCHES } = require('../../src');

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
          length: 8,
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
          length: 8,
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
          length: 8,
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
          length: 8,
          harmony: {
            rate: 2,
            chords: [CHORDS.TRIAD(0), CHORDS.TRIAD(5).inv(-2), CHORDS.TRIAD(3).inv(-1), CHORDS.SEVENTH(4).inv(-2)],
          },
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

    it('supports lead mode', () => {
      const song = new Song({
        bpm: 120,
        sections: [{
          scale: SCALES.MAJOR.C,
          length: 8,
          harmony: {
            rate: 2,
            chords: [CHORDS.TRIAD(0), CHORDS.TRIAD(0).inv(1), CHORDS.TRIAD(2).inv(-2), CHORDS.SEVENTH(4).inv(-2)],
          },
          tracks: [{
            mode: 'lead',
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
            note({ time: 2, pitch: 64 }),
            note({ time: 3, pitch: 65 }),
            note({ time: 4, pitch: 55 }),
            note({ time: 5, pitch: 57 }),
            note({ time: 6, pitch: 62 }),
            note({ time: 7, pitch: 64 }),
          ]
        ]
      });
    });

    it('supports looped harmonies', () => {
      const song = new Song({
        bpm: 160,
        sections: [
          {
            length: 16,
            scale: SCALES.HARMONIC_MINOR.C,
            harmony: {
              rate: 4,
              looped: true,
              chords: [CHORDS.TRIAD(0), CHORDS.TRIAD(-2)]
            },
            tracks: [{
              looped: true,
              mode: 'arpeggio',
              rhythm: [1, 1.5, 1, 0.5],
              pitches: [0, 1, 2, 0],
            }]
          },
          {
            length: 16,
            scale: SCALES.HARMONIC_MINOR.C,
            harmony: {
              rate: 4,
              looped: true,
              chords: [CHORDS.TRIAD(-4), CHORDS.TRIAD(-3)]
            },
            tracks: [{
              looped: true,
              mode: 'arpeggio',
              rhythm: [1, 1.5, 1, 0.5],
              pitches: [0, 1, 2, 0],
            }]
          },
          {
            tracks: [{
              rhythm: [1],
              pitches: [PITCHES.C4],
            }]
          }
        ]
      });
      assert.deepEqual(song.toJSON(), {
        "bpm": 160,
        "tracks": [
          [
            note({ time: 0, pitch: 60 }),
            note({ time: 1, pitch: 63, duration: 1.5 }),
            note({ time: 2.5, pitch: 67 }),
            note({ time: 3.5, pitch: 60, duration: 0.5 }),
            note({ time: 4, pitch: 56 }),
            note({ time: 5, pitch: 60, duration: 1.5 }),
            note({ time: 6.5, pitch: 63 }),
            note({ time: 7.5, pitch: 56, duration: 0.5 }),
            note({ time: 8, pitch: 60 }),
            note({ time: 9, pitch: 63, duration: 1.5 }),
            note({ time: 10.5, pitch: 67 }),
            note({ time: 11.5, pitch: 60, duration: 0.5 }),
            note({ time: 12, pitch: 56 }),
            note({ time: 13, pitch: 60, duration: 1.5 }),
            note({ time: 14.5, pitch: 63 }),
            note({ time: 15.5, pitch: 56, duration: 0.5 }),

            // TODO FIXME: This is a bug! Multi-section songs aren't maintaining the time offset properly
            note({ time: 0, pitch: 53 }),
            note({ time: 1, pitch: 56, duration: 1.5 }),
            note({ time: 2.5, pitch: 60 }),
            note({ time: 3.5, pitch: 53, duration: 0.5 }),
            note({ time: 4, pitch: 55 }),
            note({ time: 5, pitch: 59, duration: 1.5 }),
            note({ time: 6.5, pitch: 62 }),
            note({ time: 7.5, pitch: 55, duration: 0.5 }),
            note({ time: 8, pitch: 53 }),
            note({ time: 9, pitch: 56, duration: 1.5 }),
            note({ time: 10.5, pitch: 60 }),
            note({ time: 11.5, pitch: 53, duration: 0.5 }),
            note({ time: 12, pitch: 55 }),
            note({ time: 13, pitch: 59, duration: 1.5 }),
            note({ time: 14.5, pitch: 62 }),
            note({ time: 15.5, pitch: 55, duration: 0.5 }),

            note({ time: 0, pitch: 60 }),
          ]
        ]
      });
    });
  });
});
