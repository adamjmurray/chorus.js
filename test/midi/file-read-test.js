const assert = require('assert');
const MIDIFile = require('../../src/midi/file');

describe('MIDIFile.read()', () => {
  it('parses pitch classes', () => {
    return new MIDIFile(`${__dirname}/../assets/test1.mid`)
      .read()
      .then(data => {
        assert.deepEqual(data, {
          "header": {
            "format": 0,
            "ntracks": 1,
            "division": 96
          },
          "tracks": [
            [
              {
                "time": 0,
                "type": "sequence-name",
                "text": "\u0000"
              },
              {
                "time": 0,
                "type": "time-signature",
                "numerator": 4,
                "denominator": 4
              },
              {
                "time": 0,
                "type": "time-signature",
                "numerator": 4,
                "denominator": 4
              },
              {
                "time": 0,
                "type": "note",
                "pitch": 60,
                "velocity": 94,
                "duration": 1,
                "release": 64,
                "channel": 1
              },
              {
                "time": 1,
                "type": "note",
                "pitch": 62,
                "velocity": 107,
                "duration": 0.5,
                "release": 64,
                "channel": 1
              },
              {
                "time": 2,
                "type": "note",
                "pitch": 64,
                "velocity": 112,
                "duration": 1.5,
                "release": 64,
                "channel": 1
              },
              {
                "time": 2.5,
                "type": "note",
                "pitch": 67,
                "velocity": 51,
                "duration": 0.625,
                "release": 64,
                "channel": 1
              },
              {
                "time": 3.5,
                "type": "track-end"
              }
            ]
          ]
        });
      })
  });
});
