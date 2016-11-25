const assert = require('assert');
const {Song, Section, Chord, Rhythm, Scale, PitchClass, SCALES, CHORDS, PITCHES, PITCH_CLASSES} = require('../../src');
const { C, D } = PITCH_CLASSES;

function note({ time, pitch, velocity = 89, duration = 1, channel = 1}) {
  return { type: 'note', time, pitch, velocity, duration, release: 100, channel };
}

describe('Song', () => {

  describe('constructor()', () => {
    it('defaults bpm to 120', () => {
      assert.equal(new Song().bpm, 120);
    });

    it('accepts an Array of Section objects for the sections option', () => {
      const section1 = new Section();
      const section2 = new Section();
      assert.deepEqual(new Song({ sections: [section1,section2] }).sections, [section1,section2]);
    });
  });

  describe('toJSON()', () => {
    it('supports scale mode', () => {
      const song = new Song({
        bpm: 120,
        sections: [{
          scale: SCALES.MAJOR(C),
          length: 8,
          parts: [{
            mode: 'scale',
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
          scale: SCALES.MAJOR(C),
          length: 8,
          parts: [{
            mode: 'chromatic',
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
          scale: SCALES.MAJOR(C),
          harmony: {
            chords: [CHORDS.TRIAD(0), CHORDS.TRIAD(1)],
            durations: [2],
          },
          parts: [{
            mode: 'chord',
            pitches: [0, 1, 0, 1],
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
          scale: SCALES.MAJOR(C),
          length: 8,
          harmony: {
            chords: [CHORDS.TRIAD(0), CHORDS.TRIAD(1)],
            durations: [4]
          },
          parts: [{
            mode: 'arpeggio',
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
          scale: SCALES.MAJOR(C),
          length: 8,
          harmony: {
            chords: [CHORDS.TRIAD(0), CHORDS.TRIAD(5).inv(-2), CHORDS.TRIAD(3).inv(-1), CHORDS.SEVENTH(4).inv(-2)],
            durations: [2],
          },
          parts: [{
            mode: 'bass',
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
          scale: SCALES.MAJOR(C),
          length: 8,
          harmony: {
            chords: [CHORDS.TRIAD(0), CHORDS.TRIAD(0).inv(1), CHORDS.TRIAD(2).inv(-2), CHORDS.SEVENTH(4).inv(-2)],
            durations: [2],
          },
          parts: [{
            mode: 'lead',
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

    it("doesn't output notes when a part has an invalid mode", () => {
      const song = new Song({
        bpm: 120,
        sections: [{
          scale: SCALES.MAJOR(C),
          length: 4,
          parts: [{
            mode: 'invalid',
            pitches: [0, 1, 2, 3],
          }]
        }]
      });
      assert.deepEqual(song.toJSON(), {
        "bpm": 120,
        "tracks": [],
      });
    });

    it('supports looped harmonies', () => {
      const song = new Song({
        bpm: 160,
        sections: [
          {
            length: 16,
            scale: SCALES.HARMONIC_MINOR(C),
            harmony: {
              chords: [CHORDS.TRIAD(0), CHORDS.TRIAD(-2)],
              durations: [4],
              looped: true,
            },
            parts: [{
              mode: 'arpeggio',
              rhythm: [1, 1.5, 1, 0.5],
              pitches: [0, 1, 2, 0],
              looped: true,
            }]
          },
          {
            length: 16,
            scale: SCALES.HARMONIC_MINOR(C),
            harmony: {
              chords: [CHORDS.TRIAD(-4), CHORDS.TRIAD(-3)],
              durations: [4],
              looped: true,
            },
            parts: [{
              mode: 'arpeggio',
              rhythm: [1, 1.5, 1, 0.5],
              pitches: [0, 1, 2, 0],
              looped: true,
            }]
          },
          {
            parts: [{
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
            note({ time: 16, pitch: 53 }),
            note({ time: 17, pitch: 56, duration: 1.5 }),
            note({ time: 18.5, pitch: 60 }),
            note({ time: 19.5, pitch: 53, duration: 0.5 }),
            note({ time: 20, pitch: 55 }),
            note({ time: 21, pitch: 59, duration: 1.5 }),
            note({ time: 22.5, pitch: 62 }),
            note({ time: 23.5, pitch: 55, duration: 0.5 }),
            note({ time: 24, pitch: 53 }),
            note({ time: 25, pitch: 56, duration: 1.5 }),
            note({ time: 26.5, pitch: 60 }),
            note({ time: 27.5, pitch: 53, duration: 0.5 }),
            note({ time: 28, pitch: 55 }),
            note({ time: 29, pitch: 59, duration: 1.5 }),
            note({ time: 30.5, pitch: 62 }),
            note({ time: 31.5, pitch: 55, duration: 0.5 }),
            note({ time: 32, pitch: 60 }),
          ]
        ]
      });
    });

    it('supports delay', () => {
      const song = new Song({
        bpm: 120,
        sections: [{
          scale: SCALES.MAJOR(C),
          length: 8,
          parts: [{
            delay: 4,
            mode: 'scale',
            pitches: [0, 1, 2, 3],
          }]
        }]
      });
      assert.deepEqual(song.toJSON(), {
        "bpm": 120,
        "tracks": [
          [
            note({ time: 4, pitch: 60 }),
            note({ time: 5, pitch: 62 }),
            note({ time: 6, pitch: 64 }),
            note({ time: 7, pitch: 65 }),
          ]
        ]
      });
    });

    it ('supports chords with shifts', () => {
      const song = new Song({
        bpm: 120,
        sections: [{
          scale: SCALES.HARMONIC_MINOR(C),
          harmony: {
            chords: [new Chord([{degree:1,shift:-1},3,5], 1), CHORDS.SEVENTH(4).inv(-2), CHORDS.TRIAD_PLUS_8(0)],
            durations: [2],
          },
          parts: [{
            mode: 'chord',
            rhythm: 'xxX=',
            pulse: 2,
            pitches: [0],
            octave: 3,
          }]
        }]
      });
      assert.deepEqual(song.toJSON(), {
        "bpm": 120,
        "tracks": [
          [
            note({ time: 0, pitch: 53, velocity: 89, duration: 2 }),
            note({ time: 0, pitch: 56, velocity: 89, duration: 2 }),
            note({ time: 0, pitch: 61, velocity: 89, duration: 2 }),
            note({ time: 2, pitch: 50, velocity: 89, duration: 2 }),
            note({ time: 2, pitch: 53, velocity: 89, duration: 2 }),
            note({ time: 2, pitch: 55, velocity: 89, duration: 2 }),
            note({ time: 2, pitch: 59, velocity: 89, duration: 2 }),
            note({ time: 4, pitch: 48, velocity: 127, duration: 4 }),
            note({ time: 4, pitch: 51, velocity: 127, duration: 4 }),
            note({ time: 4, pitch: 55, velocity: 127, duration: 4 }),
            note({ time: 4, pitch: 60, velocity: 127, duration: 4 }),
          ]
        ]
      });
    });

    it('supports Euclidean-style rhythms via Rhythm.distribute()', () => {
      const song = new Song({
        bpm: 120,
        sections: [{
          parts: [{
            rhythm: Rhythm.distribute(7, 32),
            pulse: 1/2,
            pitches: [42],
          }],
        }],
      });
      assert.deepEqual(song.toJSON(), {
        "bpm": 120,
        "tracks": [
          [
            note({ time: 0, pitch: 42, duration: 0.5 }),
            note({ time: 2.5, pitch: 42, duration: 0.5 }),
            note({ time: 5, pitch: 42, duration: 0.5 }),
            note({ time: 7, pitch: 42, duration: 0.5 }),
            note({ time: 9.5, pitch: 42, duration: 0.5 }),
            note({ time: 11.5, pitch: 42, duration: 0.5 }),
            note({ time: 14, pitch: 42, duration: 0.5 }),
          ],
        ],
      });
    });

    it('allows setting the default scale and section length at the song-level', () => {
      const song = new Song({
        bpm: 120,
        scale: SCALES.DORIAN(D),
        sectionLength: 4,
        sections: [
          {
            parts: [{
              mode: 'scale',
              rhythm: [1/2],
              pitches: [0,1,2,3]
            }],
          },
          {
            scale: SCALES.MAJOR(C),
            length: 2,
            parts: [{
              mode: 'scale',
              rhythm: [1/4],
              pitches: [0,1,2,3]
            }],
          },
          {
            parts: [{
              mode: 'scale',
              pitches: [0]
            }],
          },
        ],
      });
      assert.deepEqual(song.toJSON(), {
        "bpm": 120,
        "tracks": [
          [
            note({ time: 0, pitch: 62, duration: 0.5 }),
            note({ time: 0.5, pitch: 64, duration: 0.5 }),
            note({ time: 1, pitch: 65, duration: 0.5 }),
            note({ time: 1.5, pitch: 67, duration: 0.5 }),
            note({ time: 4, pitch: 60, duration: 0.25 }),
            note({ time: 4.25, pitch: 62, duration: 0.25 }),
            note({ time: 4.5, pitch: 64, duration: 0.25 }),
            note({ time: 4.75, pitch: 65, duration: 0.25 }),
            note({ time: 6, pitch: 62, duration: 1 }),
          ],
        ],
      });
    });

    it('supports microtonal scales', () => {
      const song = new Song({
        bpm: 120,
        sections: [{
          scale: new Scale([3,2,3,3,2,3,3], new PitchClass(0,19)), // major-ish scale in 19-TET
          length: 4,
          harmony: {
            chords: [CHORDS.TRIAD_PLUS_8(0), CHORDS.TRIAD_PLUS_8(3)],
            durations: [2],
          },
          parts: [{
            mode: 'chord',
            octave: 3,
            pitches: [0,1],
            looped: true,
          }]
        }]
      });
      assert.deepEqual(song.toJSON(), {
        "bpm": 120,
        "tracks": [
          [
            note({ time: 0, pitch: 76 }),
            note({ time: 0, pitch: 81 }),
            note({ time: 0, pitch: 87 }),
            note({ time: 0, pitch: 95 }),
            note({ time: 1, pitch: 81 }),
            note({ time: 1, pitch: 87 }),
            note({ time: 1, pitch: 95 }),
            note({ time: 1, pitch: 100 }),
            note({ time: 2, pitch: 84 }),
            note({ time: 2, pitch: 89 }),
            note({ time: 2, pitch: 95 }),
            note({ time: 2, pitch: 103 }),
            note({ time: 3, pitch: 89 }),
            note({ time: 3, pitch: 95 }),
            note({ time: 3, pitch: 103 }),
            note({ time: 3, pitch: 108 }),
          ],
        ],
      });
    });
  });

  describe('[Symbol.iterator]()', () => {

      it("yields the song's events one by one", () => {
      const song = new Song({
        bpm: 120,
        sections: [{
          scale: SCALES.MAJOR(C),
          length: 8,
          parts: [{
            mode: 'scale',
            pitches: [0, 1, 2, 3, 4, 5, 6, 7, 8],
          }]
        }]
      });
      assert.deepEqual([...song], [
        { type: 'bpm', value: 120 },
        note({ time: 0, pitch: 60 }),
        note({ time: 1, pitch: 62 }),
        note({ time: 2, pitch: 64 }),
        note({ time: 3, pitch: 65 }),
        note({ time: 4, pitch: 67 }),
        note({ time: 5, pitch: 69 }),
        note({ time: 6, pitch: 71 }),
        note({ time: 7, pitch: 72 }),
      ]);
    });
  });
});
