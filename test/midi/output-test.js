const assert = require('assert');
const proxyquire = require('proxyquire');
const { Output } = proxyquire('../../midi', require('./midi-stub'));

describe('MidiOut', () => {

  describe('select()', () => {
    it('it interactively selects an output', () => {
      return Output.select()
        .then(midiOut => {
          // the stub selects this port:
          assert.equal(midiOut.portName, 'output-stub-1');
        });
    });
  });
});
