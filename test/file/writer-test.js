const { writeMIDIFile, readMIDIFile } = require('../../src/file');

describe('file writer', () => {
  it('parses pitch classes', () => {
    return writeMIDIFile(`${__dirname}/../../tmp/write-test.mid`, {
      "header": {
        "format": 0,
        "ntracks": 1,
        "division": 960
      },
      "tracks": [
        {
          "0": [
            {
              "type": "note",
              "pitch": 60,
              "velocity": 94,
              "duration": 1,
              "release": 64,
              "channel": 1
            }
          ],
          "1": [
            {
              "type": "note",
              "pitch": 62,
              "velocity": 107,
              "duration": 0.5,
              "release": 64,
              "channel": 1
            }
          ],
          "2": [
            {
              "type": "note",
              "pitch": 64,
              "velocity": 112,
              "duration": 1.5,
              "release": 64,
              "channel": 1
            }
          ],
          "2.5": [
            {
              "type": "note",
              "pitch": 67,
              "velocity": 51,
              "duration": 0.625,
              "release": 64,
              "channel": 1
            }
          ],
          "3.5": [
            {
              "type": "track-end"
            }
          ]
        }
      ]
    }).then(() => readMIDIFile(`${__dirname}/../../tmp/write-test.mid`))
      .then(json => console.log(JSON.stringify(json, null, 2)));
  });
});
