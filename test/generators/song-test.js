const assert = require('assert');
const { Song, SCALES } = require('../../src');

describe('Song', () => {

  describe('toJSON()', () => {
    it('can product MIDI JSON', () => {
      const song = new Song({
        bpm: 120,
        sections: [{
          scale: SCALES.MAJOR.C,
          tracks: [{
            mode: 'scale',
            rate: 1/4,
            rhythm: 'X==.x==.x=..x...',
            pitches: [0, 1, 2, 3],
          }]
        }]
      });
      assert.deepEqual(song.toJSON(), {
        "bpm": 120,
        "tracks": [
          [
            {
              "time": 0,
              "type": "note",
              "pitch": 60,
              "velocity": 127,
              "duration": 0.7424999999999999,
              "release": 100,
              "channel": 1
            },
            {
              "time": 1,
              "type": "note",
              "pitch": 62,
              "velocity": 89,
              "duration": 0.7424999999999999,
              "release": 100,
              "channel": 1
            },
            {
              "time": 2,
              "type": "note",
              "pitch": 64,
              "velocity": 89,
              "duration": 0.495,
              "release": 100,
              "channel": 1
            },
            {
              "time": 3,
              "type": "note",
              "pitch": 65,
              "velocity": 89,
              "duration": 0.2475,
              "release": 100,
              "channel": 1
            }
          ]
        ]
      });
    });
  });
});
