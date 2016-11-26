const MidiFile = require('../../src/midi/file');
const assert = require('assert');
const fs = require('fs');

describe('MidiFile.write()', () => {

  const tmpFolder = 'tmp';

  before(() => fs.existsSync(tmpFolder) ? null : fs.mkdirSync(tmpFolder));

  it('writes MIDI files', () => {
    const json = {
      bpm: 110.5,
      tracks: [
        [
          {
            time: 0,
            type: 'note',
            pitch: 60,
            velocity: 94,
            duration: 1,
            release: 64,
            channel: 1
          },
          {
            time: 1,
            type: 'note',
            pitch: 62,
            velocity: 107,
            duration: 0.5,
            release: 64,
            channel: 1,
          },
          {
            time: 2,
            type: 'note',
            pitch: 64,
            velocity: 112,
            duration: 1.5,
            release: 64,
            channel: 1,
          },
          {
            time: 2.5,
            type: 'note',
            pitch: 67,
            velocity: 51,
            duration: 0.625,
            release: 64,
            channel: 1,
          },
          {
            time: 3.5,
            type: 'track-end',
          },
        ]
      ]
    };
    const midiFile = new MidiFile(`${tmpFolder}/write-test.mid`);
    return midiFile.write(json)
      .then(() => midiFile.read())
      .then(reloadedJson => {
        assert.deepEqual(reloadedJson, {
          "header": {
            "format": 1,
            "ntracks": 2,
            "division": 960
          },
          "tracks": [
            [
              {
                "type": "tempo",
                "bpm": 110.5,
                "time": 0
              }
            ],
            [
              {
                "type": "note",
                "pitch": 60,
                "velocity": 94,
                "duration": 1,
                "release": 64,
                "channel": 1,
                "time": 0
              },
              {
                "type": "note",
                "pitch": 62,
                "velocity": 107,
                "duration": 0.5,
                "release": 64,
                "channel": 1,
                "time": 1
              },
              {
                "type": "note",
                "pitch": 64,
                "velocity": 112,
                "duration": 1.5,
                "release": 64,
                "channel": 1,
                "time": 2
              },
              {
                "type": "note",
                "pitch": 67,
                "velocity": 51,
                "duration": 0.625,
                "release": 64,
                "channel": 1,
                "time": 2.5
              },
              {
                "type": "track-end",
                "time": 3.5
              }
            ]
          ]
        })
      });
  });
});
