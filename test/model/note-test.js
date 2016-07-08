const assert = require('assert');
const Note = require('../../src/model/note');
const Pitch = require('../../src/model/pitch');

describe.only('Note', () => {
  describe('toJSON()', () => {
    it('works with pitch Numbers', () => {
      const note = new Note({ pitch: 60 });
      assert.deepEqual(note.toJSON(), {
        type: 'note',
        pitch: 60,
        velocity: 89,
        duration: 1,
        release: 100,
        channel: 1 });
    });

    it('works with pitches', () => {
      const note = new Note({ pitch: new Pitch(60) });
      assert.deepEqual(note.toJSON(), {
        type: 'note',
        pitch: 60,
        velocity: 89,
        duration: 1,
        release: 100,
        channel: 1 });
    });
  });
});
