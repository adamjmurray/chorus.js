const assert = require('assert');
const { Harmony } = require('../../index');

describe('Harmony', () => {

  describe('constructor()', () => {
    it("sets the length from the sum of the durations", () => {
      assert.equal(new Harmony({ durations: [1,2,3] }).length, 6);
    });
  });
});
