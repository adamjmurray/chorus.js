const expect = require('chai').expect;
const midifile = require('../../src/file');
const readMIDIFile = midifile.readMIDIFile;

describe('file reader', () => {
  it('parses pitch classes', () => {
    return readMIDIFile(`${__dirname}/../assets/test1.mid`)
      .then(data => {
        expect(data).to.deep.equal({
          "header": {
            "format": 0,
            "ntracks": 1,
            "division": 96
          },
          "tracks": [
            {
              "0": [
                {
                  "type": "sequence-name",
                  "text": "\u0000"
                },
                {
                  "type": "time-signature",
                  "numerator": 4,
                  "denominator": 4
                },
                {
                  "type": "time-signature",
                  "numerator": 4,
                  "denominator": 4
                },
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
        });
      })
  });
});
