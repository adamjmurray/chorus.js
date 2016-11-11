const assert = require('assert');
const proxyquire = require('proxyquire');
const { MIDIOut } = proxyquire('../../src/midi', require('./midi-stub'));

describe('MIDIOut', () => {

  let processCallbacks = {};

  beforeEach(() => {
    process.on = (event, callback) => {
      processCallbacks[event] = callback
    };
  });

  describe('constructor()', () => {
    it('creates a midi output', () => {
      assert(new MIDIOut().output);
    });

    it('does not open a port automatically', () => {
      assert(!new MIDIOut().isOpen);
    });

    it('accepts a defaultDuration option', () => {
      assert.equal(new MIDIOut({ defaultDuration: 1000 }).defaultDuration, 1000);
    });

    it('defaults defaultDuration to 500', () => {
      assert.equal(new MIDIOut({ defaultDuration: 500 }).defaultDuration, 500);
    });

    it('sets a process SIGINT callback', () => {
      let exitCode = null;
      process.exit = code => {
        exitCode = code
      };
      new MIDIOut();
      processCallbacks.SIGINT();
      assert.equal(exitCode, 130);
    });

    it('sets a process exit callback that automatically closes the port', () => {
      const midiOut = new MIDIOut();
      midiOut.open();
      assert(midiOut.isOpen);
      processCallbacks.exit();
      assert(!midiOut.isOpen);
    });

    it('sets a process exit callback that sends all note off messages', () => {
      const midiOut = new MIDIOut();
      midiOut.open();
      assert(midiOut.isOpen);
      processCallbacks.exit();
      const expectedBytes = [];
      for (let channel=1; channel <= 16; channel++) {
        for (let pitch=0; pitch < 128; pitch++) {
          expectedBytes.push([0x80|(channel-1), pitch, 0])
        }
      }
      assert.deepEqual(midiOut.output.sentBytes, expectedBytes);
    })
  });

  describe('ports()', () => {
    it('returns the input port names', () => {
      assert.deepEqual(new MIDIOut().ports(), ['output-stub-1', 'output-stub-2']);
    });
  });

  describe('open()', () => {
    it('it opens the port with the given index, if it exists', () => {
      const midiOut = new MIDIOut();
      assert(midiOut.open(1));
      assert(midiOut.isOpen);
      assert.equal(midiOut.portIndex, 1);
      assert.equal(midiOut.portName, 'output-stub-2');
    });

    it('defaults to port index 0 if no arguments are given', () => {
      const midiOut = new MIDIOut();
      assert(midiOut.open());
      assert(midiOut.isOpen);
      assert.equal(midiOut.portIndex, 0);
      assert.equal(midiOut.portName, 'output-stub-1');
    });

    it('it opens the port with the given port name, if it exists', () => {
      const midiOut = new MIDIOut();
      assert(midiOut.open('output-stub-2'));
      assert(midiOut.isOpen);
      assert.equal(midiOut.portIndex, 1);
      assert.equal(midiOut.portName, 'output-stub-2');
    });

    it('it opens the port name matching with the given RegExp, if it exists', () => {
      const midiOut = new MIDIOut();
      assert(midiOut.open(/stub-2/));
      assert(midiOut.isOpen);
      assert.equal(midiOut.portIndex, 1);
      assert.equal(midiOut.portName, 'output-stub-2');
    });

    it("returns false if the port doesn't exist", () => {
      const midiOut = new MIDIOut();
      assert(!midiOut.open(-1));
      assert(!midiOut.open(/invalid/));
      assert(!midiOut.open('invalid'));
    });

    it("returns false if the port is already open", () => {
      const midiOut = new MIDIOut();
      midiOut.open(1);
      assert(!midiOut.open(1));
    });
  });

  describe('openByPortIndex()', () => {
    it('opens the port with the given index, if it exists', () => {
      const midiOut = new MIDIOut();
      assert(midiOut.openByPortIndex(1));
      assert(midiOut.isOpen);
      assert.equal(midiOut.portIndex, 1);
      assert.equal(midiOut.portName, 'output-stub-2');
    });

    it("returns false if the port doesn't exist", () => {
      const midiOut = new MIDIOut();
      assert(!midiOut.openByPortIndex(-1));
    });

    it("returns false if the port is already open", () => {
      const midiOut = new MIDIOut();
      midiOut.openByPortIndex(1);
      assert(!midiOut.openByPortIndex(1));
    });
  });

  describe('close()', () => {
    it('closes any open ports', () => {
      const midiOut = new MIDIOut();
      assert(midiOut.open(1));
      assert(midiOut.close());
      assert(!midiOut.isOpen);
      assert(!midiOut.portIndex);
      assert(!midiOut.portName);
    });

    it("does nothing if the port isn't open", () => {
      const midiOut = new MIDIOut();
      assert(midiOut.close());
    });
  });

  describe('send()', () => {
    it('sends the given bytes', () => {
      const midiOut = new MIDIOut();
      midiOut.send(1,2,3);
      assert.deepEqual(midiOut.output.sentBytes, [[1,2,3]]);
    });
  });

  describe('noteOn()', () => {
    it('sends a MIDI note-on message', () => {
      const midiOut = new MIDIOut();
      midiOut.noteOn(60, 100, 2);
      assert.deepEqual(midiOut.output.sentBytes, [[0x90|1, 60, 100]]);
    });
  });

  describe('noteOff()', () => {
    it('sends a MIDI note-off message', () => {
      const midiOut = new MIDIOut();
      midiOut.noteOff(55, 99, 3);
      assert.deepEqual(midiOut.output.sentBytes, [[0x80|2, 55, 99]]);
    });
  });

  describe('note()', () => {
    it('sends a note-on message, and then a note-off after the given duration', done => {
      const midiOut = new MIDIOut();
      midiOut.note(70, 120, 0, 4);
      assert.deepEqual(midiOut.output.sentBytes, [[0x90|3, 70, 120]]);
      setTimeout(() => {
        assert.deepEqual(midiOut.output.sentBytes, [[0x90|3, 70, 120], [0x80|3, 70, 120]]);
        done();
      }, 1);
    });

    it('uses the defaultDuration and channel 1 if not specified', done => {
      const midiOut = new MIDIOut({ defaultDuration: 0 });
      midiOut.note(70, 120);
      assert.deepEqual(midiOut.output.sentBytes, [[0x90, 70, 120]]);
      setTimeout(() => {
        assert.deepEqual(midiOut.output.sentBytes, [[0x90, 70, 120], [0x80, 70, 120]]);
        done();
      }, 1);
    });
  });

  describe('allNotesOff()', () => {
    it('it sends a note-off message to for every pitch on every channel', () => {
      const midiOut = new MIDIOut();
      const expectedBytes = [];
      for (let channel=1; channel <= 16; channel++) {
        for (let pitch=0; pitch < 128; pitch++) {
          expectedBytes.push([0x80|(channel-1), pitch, 0])
        }
      }
      midiOut.allNotesOff();
      assert.deepEqual(midiOut.output.sentBytes, expectedBytes);
    });
  });

  describe.skip('play()'); // TODO
});
