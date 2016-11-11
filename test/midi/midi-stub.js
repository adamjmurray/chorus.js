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
        }
      };
    },
  },
};
