const assert = require('assert');
const proxyquire = require('proxyquire');
const { MidiIn } = proxyquire('../../midi', require('./midi-stub'));

describe('MidiIn', () => {

  let processCallbacks = {};

  beforeEach(() => {
    process.on = (event, callback) => { processCallbacks[event] = callback };
  });

  describe('constructor()', () => {
    it('creates a midi input', () => {
      assert(new MidiIn().input);
    });

    it('does not open a port automatically', () => {
      assert(!new MidiIn().isOpen);
    });

    it('sets a process SIGINT callback', () => {
      let exitCode = null;
      process.exit = code => { exitCode = code };
      new MidiIn();
      processCallbacks.SIGINT();
      assert.equal(exitCode, 130);
    });

    it('sets a process exit callback that automatically closes the port', () => {
      const midiIn = new MidiIn();
      midiIn.open();
      assert(midiIn.isOpen);
      processCallbacks.exit();
      assert(!midiIn.isOpen);
    });
  });

  describe('ports()', () => {
    it('returns the input port names', () => {
      assert.deepEqual(new MidiIn().ports(), ['input-stub-1', 'input-stub-2']);
    });
  });

  describe('open()', () => {
    it('it opens the port with the given index, if it exists', () => {
      const midiIn = new MidiIn();
      assert(midiIn.open(1));
      assert(midiIn.isOpen);
      assert.equal(midiIn.portIndex, 1);
      assert.equal(midiIn.portName, 'input-stub-2');
    });

    it('defaults to port index 0 if no arguments are given', () => {
      const midiIn = new MidiIn();
      assert(midiIn.open());
      assert(midiIn.isOpen);
      assert.equal(midiIn.portIndex, 0);
      assert.equal(midiIn.portName, 'input-stub-1');
    });

    it('it opens the port with the given port name, if it exists', () => {
      const midiIn = new MidiIn();
      assert(midiIn.open('input-stub-2'));
      assert(midiIn.isOpen);
      assert.equal(midiIn.portIndex, 1);
      assert.equal(midiIn.portName, 'input-stub-2');
    });

    it('it opens the port name matching with the given RegExp, if it exists', () => {
      const midiIn = new MidiIn();
      assert(midiIn.open(/stub-2/));
      assert(midiIn.isOpen);
      assert.equal(midiIn.portIndex, 1);
      assert.equal(midiIn.portName, 'input-stub-2');
    });

    it("returns false if the port doesn't exist", () => {
      const midiIn = new MidiIn();
      assert(!midiIn.open(-1));
      assert(!midiIn.open(/invalid/));
      assert(!midiIn.open('invalid'));
    });

    it("returns false if the port is already open", () => {
      const midiIn = new MidiIn();
      midiIn.open(1);
      assert(!midiIn.open(1));
    });
  });

  describe('openByPortIndex()', () => {
    it('opens the port with the given index, if it exists', () => {
      const midiIn = new MidiIn();
      assert(midiIn.openByPortIndex(1));
      assert(midiIn.isOpen);
      assert.equal(midiIn.portIndex, 1);
      assert.equal(midiIn.portName, 'input-stub-2');
    });

    it("returns false if the port doesn't exist", () => {
      const midiIn = new MidiIn();
      assert(!midiIn.openByPortIndex(-1));
    });

    it("returns false if the port is already open", () => {
      const midiIn = new MidiIn();
      midiIn.openByPortIndex(1);
      assert(!midiIn.openByPortIndex(1));
    });
  });

  describe('close()', () => {
    it('closes any open ports', () => {
      const midiIn = new MidiIn();
      assert(midiIn.open(1));
      assert(midiIn.close());
      assert(!midiIn.isOpen);
      assert(!midiIn.portIndex);
      assert(!midiIn.portName);
    });

    it("does nothing if the port isn't open", () => {
      const midiIn = new MidiIn();
      assert(midiIn.close());
    });
  });

  describe('onMessage()', () => {
    it('register a callback function for incoming MIDI messages', () => {
      const midiIn = new MidiIn();
      let receivedMessage = null;
      midiIn.onMessage(message => { receivedMessage = message });
      midiIn.input.testMessage(0, 'note-on');
      assert.equal(receivedMessage, 'note-on');
    });
  })
});
