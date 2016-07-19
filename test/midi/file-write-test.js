const MIDIFile = require('../../src/midi/file');
const assert = require('assert');

describe('MIDIFile.write()', () => {
  it('parses pitch classes', () => {
    const json = {
      "header": {
        "format": 0,
        "ntracks": 1,
        "division": 960
      },
      "tracks": [
        [
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
    };
    const midiFile = new MIDIFile(`${__dirname}/../../tmp/write-test.mid`);
    return midiFile.write(json)
      .then(() => midiFile.read())
      .then(reloadedJson => assert.deepEqual(reloadedJson, json));
  });
});
