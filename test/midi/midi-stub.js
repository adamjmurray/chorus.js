const assert = require('assert');

module.exports = {
  midi: {
    '@global': true,

    '@noCallThru': true,

    input: function() {
      return {
        getPortCount: () => 2,

        getPortName: index => ['input-stub-1', 'input-stub-2'][index],

        openPort(index) {
          return !!this.getPortName(index);
        },

        closePort: () => {},

        callbacks: [],

        on(event, callback) {
          assert.equal(event, 'message');
          this.callbacks.push(callback);
        },

        testMessage(deltaTime, message) {
          this.callbacks.forEach(callback => callback(deltaTime, message));
        },
      };
    },

    output: function() {
      return {
        getPortCount: () => 2,

        getPortName: index => ['output-stub-1', 'output-stub-2'][index],

        openPort(index) {
          return !!this.getPortName(index);
        },

        closePort: () => {},

        sentBytes: [],

        sendMessage(bytes) {
          this.sentBytes.push(bytes);
        },
      };
    },
  },

  // For testing MidiOut.select() / select-output
  readline: {
    '@global': true,
    '@noCallThru': true,

    createInterface: function(options) {
      assert.equal(options.input, process.stdin);
      assert.equal(options.output, process.stdout);
      return {
        question(message, callback) {
          assert.equal(message, 'Which port? ');
          callback('output-stub-1');
        } ,
        close() {
          this.closed = true;
        },
      };
    },
  },
};
