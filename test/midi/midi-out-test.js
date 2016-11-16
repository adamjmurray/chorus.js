const assert = require('assert');
const proxyquire = require('proxyquire').noPreserveCache();
const { MidiOut } = proxyquire('../../src/midi', require('./midi-stub'));
const { Song } = require('../../src');
const { sleep } = require('../../src/utils');

describe('MidiOut', () => {

  let processCallbacks = {};

  beforeEach(() => {
    process.on = (event, callback) => {
      processCallbacks[event] = callback
    };
  });

  describe('constructor()', () => {
    it('creates a midi output', () => {
      assert(new MidiOut().output);
    });

    it('does not open a port automatically', () => {
      assert(!new MidiOut().isOpen);
    });

    it('accepts a defaultDuration option', () => {
      assert.equal(new MidiOut({ defaultDuration: 1000 }).defaultDuration, 1000);
    });

    it('defaults defaultDuration to 500', () => {
      assert.equal(new MidiOut({ defaultDuration: 500 }).defaultDuration, 500);
    });

    it('sets a process SIGINT callback', done => {
      let exitCode = null;
      process.exit = code => {
        exitCode = code
      };
      new MidiOut();
      processCallbacks.SIGINT();
      setTimeout(() => { assert.equal(exitCode, 130); done(); }, 0);
    });

    it('sets a process exit callback that automatically closes the port', () => {
      const midiOut = new MidiOut();
      midiOut.open();
      assert(midiOut.isOpen);
      processCallbacks.exit();
      assert(!midiOut.isOpen);
    });

    it('sets a process beforeExit callback that sends all note off messages if the output is open', done => {
      const midiOut = new MidiOut();
      midiOut.open();
      assert(midiOut.isOpen);
      processCallbacks.beforeExit();
      const expectedBytes = [];
      for (let channel=1; channel <= 16; channel++) {
        for (let pitch=0; pitch < 128; pitch++) {
          expectedBytes.push([0x80|(channel-1), pitch, 0])
        }
      }
      setTimeout(() => { assert.deepEqual(midiOut.output.sentBytes, expectedBytes); done(); }, 100);
    })
  });

  describe('ports()', () => {
    it('returns the input port names', () => {
      assert.deepEqual(new MidiOut().ports(), ['output-stub-1', 'output-stub-2']);
    });
  });

  describe('open()', () => {
    it('it opens the port with the given index, if it exists', () => {
      const midiOut = new MidiOut();
      assert(midiOut.open(1));
      assert(midiOut.isOpen);
      assert.equal(midiOut.portIndex, 1);
      assert.equal(midiOut.portName, 'output-stub-2');
    });

    it('defaults to port index 0 if no arguments are given', () => {
      const midiOut = new MidiOut();
      assert(midiOut.open());
      assert(midiOut.isOpen);
      assert.equal(midiOut.portIndex, 0);
      assert.equal(midiOut.portName, 'output-stub-1');
    });

    it('it opens the port with the given port name, if it exists', () => {
      const midiOut = new MidiOut();
      assert(midiOut.open('output-stub-2'));
      assert(midiOut.isOpen);
      assert.equal(midiOut.portIndex, 1);
      assert.equal(midiOut.portName, 'output-stub-2');
    });

    it('it opens the port name matching with the given RegExp, if it exists', () => {
      const midiOut = new MidiOut();
      assert(midiOut.open(/stub-2/));
      assert(midiOut.isOpen);
      assert.equal(midiOut.portIndex, 1);
      assert.equal(midiOut.portName, 'output-stub-2');
    });

    it("returns false if the port doesn't exist", () => {
      const midiOut = new MidiOut();
      assert(!midiOut.open(-1));
      assert(!midiOut.open(/invalid/));
      assert(!midiOut.open('invalid'));
    });

    it("returns false if the port is already open", () => {
      const midiOut = new MidiOut();
      midiOut.open(1);
      assert(!midiOut.open(1));
    });
  });

  describe('openByPortIndex()', () => {
    it('opens the port with the given index, if it exists', () => {
      const midiOut = new MidiOut();
      assert(midiOut.openByPortIndex(1));
      assert(midiOut.isOpen);
      assert.equal(midiOut.portIndex, 1);
      assert.equal(midiOut.portName, 'output-stub-2');
    });

    it("returns false if the port doesn't exist", () => {
      const midiOut = new MidiOut();
      assert(!midiOut.openByPortIndex(-1));
    });

    it("returns false if the port is already open", () => {
      const midiOut = new MidiOut();
      midiOut.openByPortIndex(1);
      assert(!midiOut.openByPortIndex(1));
    });
  });

  describe('select()', () => {
    it('it interactively selects an output', () => {
      return MidiOut.select()
        .then(midiOut => {
          // the stub selects this port:
          assert.equal(midiOut.portName, 'output-stub-1');
        });
    });
  });

  describe('close()', () => {
    it('closes any open ports', () => {
      const midiOut = new MidiOut();
      assert(midiOut.open(1));
      assert(midiOut.close());
      assert(!midiOut.isOpen);
      assert(!midiOut.portIndex);
      assert(!midiOut.portName);
    });

    it("does nothing if the port isn't open", () => {
      const midiOut = new MidiOut();
      assert(midiOut.close());
    });
  });

  describe('send()', () => {
    it('sends the given bytes', () => {
      const midiOut = new MidiOut();
      midiOut.send(1,2,3);
      assert.deepEqual(midiOut.output.sentBytes, [[1,2,3]]);
    });
  });

  describe('noteOn()', () => {
    it('sends a MIDI note-on message', () => {
      const midiOut = new MidiOut();
      midiOut.noteOn(60, 100, 2);
      assert.deepEqual(midiOut.output.sentBytes, [[0x90|1, 60, 100]]);
    });

    it('defaults velocity to 70 and channel to 1', () => {
      const midiOut = new MidiOut();
      midiOut.noteOn(60);
      assert.deepEqual(midiOut.output.sentBytes, [[0x90, 60, 70]]);
    });
  });

  describe('noteOff()', () => {
    it('sends a MIDI note-off message', () => {
      const midiOut = new MidiOut();
      midiOut.noteOff(55, 99, 3);
      assert.deepEqual(midiOut.output.sentBytes, [[0x80|2, 55, 99]]);
    });

    it('defaults velocity to 70 and channel to 1', () => {
      const midiOut = new MidiOut();
      midiOut.noteOff(55);
      assert.deepEqual(midiOut.output.sentBytes, [[0x80, 55, 70]]);
    });
  });

  describe('note()', () => {
    it('sends a note-on message, and then a note-off after the given duration', done => {
      const midiOut = new MidiOut();
      midiOut.note(70, 120, 0, 4);
      assert.deepEqual(midiOut.output.sentBytes, [[0x90|3, 70, 120]]);
      setTimeout(() => {
        assert.deepEqual(midiOut.output.sentBytes, [[0x90|3, 70, 120], [0x80|3, 70, 120]]);
        done();
      }, 1);
    });

    it('uses the defaultDuration, velocity 70, and channel 1 if not specified', done => {
      const midiOut = new MidiOut({ defaultDuration: 0 });
      midiOut.note(72);
      assert.deepEqual(midiOut.output.sentBytes, [[0x90, 72, 70]]);
      setTimeout(() => {
        assert.deepEqual(midiOut.output.sentBytes, [[0x90, 72, 70], [0x80, 72, 70]]);
        done();
      }, 1);
    });
  });

  describe('allNotesOff(channel)', () => {
    it('it sends a note-off message to for every pitch on the given channel if the output is open', () => {
      const midiOut = new MidiOut();
      midiOut.open();
      const expectedBytes = [];
      for (let pitch=0; pitch < 128; pitch++) {
        expectedBytes.push([0x80|2, pitch, 0])
      }
      midiOut.allNotesOff(3);
      assert.deepEqual(midiOut.output.sentBytes, expectedBytes);
    });

    it('does nothing if the output is closed', () => {
      const midiOut = new MidiOut();
      midiOut.allNotesOff(3);
      assert.deepEqual(midiOut.output.sentBytes, []);
    });
  });

  describe('panic()', () => {
    it('it asynchronously sends a note-off message to for every pitch on every channel if the output is open', () => {
      const midiOut = new MidiOut();
      midiOut.open();
      const expectedBytes = [];
      for (let channel=1; channel <= 16; channel++) {
        for (let pitch=0; pitch < 128; pitch++) {
          expectedBytes.push([0x80|(channel-1), pitch, 0])
        }
      }
      return midiOut.panic().then(() => assert.deepEqual(midiOut.output.sentBytes, expectedBytes));
    });

    it('does nothing if the output is closed', () => {
      const midiOut = new MidiOut();
      midiOut.panic();
      return midiOut.panic().then(() => assert.deepEqual(midiOut.output.sentBytes, []));
    });
  });

  describe('play()', () => {

    context('with Song argument', () => {

      it("schedules legato notes' note-off events before the next note-on", () => {
        const song = new Song({
          bpm: 10000, // so we don't have to sleep for long
          sections: [{
            parts: [{
              rhythm: 'X'.repeat(8),
              pitches: [60],
            }]
          }]
        });
        const expectedBytes = [
          [0x90, 60, 127], [0x80, 60, 127],
          [0x90, 60, 127], [0x80, 60, 127],
          [0x90, 60, 127], [0x80, 60, 127],
          [0x90, 60, 127], [0x80, 60, 127],
          [0x90, 60, 127], [0x80, 60, 127],
          [0x90, 60, 127], [0x80, 60, 127],
          [0x90, 60, 127], [0x80, 60, 127],
          [0x90, 60, 127], [0x80, 60, 127],
        ];
        const midiOut = new MidiOut();
        midiOut.play(song);
        return sleep(50).then(() => {
          assert.deepEqual(midiOut.output.sentBytes, expectedBytes);
        });
      });
    });

    context('with JSON argument', () => {

      it("schedules legato notes' note-off events before the next note-on", () => {
        const song = new Song({
          bpm: 10000, // so we don't have to sleep for long
          sections: [{
            parts: [{
              rate: 1,
              rhythm: 'X'.repeat(8),
              pitches: [60, 60, 60, 60],
            }]
          }]
        });
        const expectedBytes = [
          [0x90, 60, 127], [0x80, 60, 127],
          [0x90, 60, 127], [0x80, 60, 127],
          [0x90, 60, 127], [0x80, 60, 127],
          [0x90, 60, 127], [0x80, 60, 127],
          [0x90, 60, 127], [0x80, 60, 127],
          [0x90, 60, 127], [0x80, 60, 127],
          [0x90, 60, 127], [0x80, 60, 127],
          [0x90, 60, 127], [0x80, 60, 127],
        ];
        const midiOut = new MidiOut();
        midiOut.play(song.toJSON());
        return sleep(50).then(() => {
          assert.deepEqual(midiOut.output.sentBytes, expectedBytes);
        });
      });
    });
  });
});
