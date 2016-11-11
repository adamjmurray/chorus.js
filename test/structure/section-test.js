const assert = require('assert');
const { Section, Harmony, Part  } = require('../../src');

describe('Section', () => {

  describe('constructor()', () => {
    it("doesn't blow up when given no arguments", () => {
      assert(new Section());
    });

    it('accepts a Harmony object for the harmony option', () => {
      const harmony = new Harmony();
      assert.equal(new Section({harmony}).harmony, harmony);
    });

    it('accepts an Array of Part objects for the parts option', () => {
      const part1 = new Part();
      const part2 = new Part();
      assert.deepEqual(new Section({ parts: [part1,part2] }).parts, [part1,part2]);
    });
  });

  describe('[Symbol.iterator]()', () => {
    it("doesn't blow up with no harmony", () => {
      // TODO: it does however blow up with an empty part!
      const section = new Section({ parts: [new Part({pitches:[60], rhythm:[1]})] });
      const iterator = section[Symbol.iterator]();
      assert.deepEqual(iterator.next(), {
        value: {
          time: 0,
          note: {pitch:60, intensity:0.7, duration:1, channel: 1},
          part:0,
        },
        done: false,
      });
      assert(iterator.next().done);
    });

    it("doesn't blow up when harmony is forcibly overwritten", () => {
      // Kind of a bogus test, but necessary to test all branches.
      const section = new Section({ parts: [new Part({pitches:[60], rhythm:[1]})] });
      section.harmony = [];
      const iterator = section[Symbol.iterator]();
      assert.deepEqual(iterator.next(), {
        value: {
          time: 0,
          note: {pitch:60, intensity:0.7, duration:1, channel: 1},
          part:0,
        },
        done: false,
      });
      assert(iterator.next().done);
    });
  });
});
