const assert = require('assert');
const Scheduler = require('../../src/midi/scheduler');
const { sleep } = require('../../src/utils');

describe('Scheduler', () => {

  describe('constructor()', () => {

    it('accepts a bpm option', () => {
      assert.equal(new Scheduler({ bpm: 99 }).bpm, 99);
    });

    it('defaults bpm to 120', () => {
      assert.equal(new Scheduler().bpm, 120);
    });
  });

  describe('at(time, callback)', () => {

    it('throws a TypeError if the time argument is not a Number', () => {
      assert.throws(() => new Scheduler().at('1', () => ({})), TypeError);
    });

    it('throws a TypeError if the callback argument is not a Function', () => {
      assert.throws(() =>  new Scheduler().at(1, 1), TypeError);
    });
  });

  describe('start()', () => {

    it('runs the scheduler', () => {
      let events = [];
      const scheduler = new Scheduler({ bpm: 60000 });
      scheduler.at(3, () => events.push(3));
      scheduler.at(2, () => events.push(2));
      scheduler.at(1, () => events.push(1));
      scheduler.start();
      return sleep(10).then(() => {
        assert.deepEqual(events, [1,2,3]);
      })
    });
  });

  describe('clear()', () => {

    it('clears the schedule', () => {
      let events = [];
      const scheduler = new Scheduler({ bpm: 60000 });
      scheduler.at(3, () => events.push(3));
      scheduler.at(2, () => events.push(2));
      scheduler.at(1, () => events.push(1));
      scheduler.clear();
      scheduler.start();
      return sleep(10).then(() => {
        assert.deepEqual(events, []);
      })
    });
  });

  describe('stop()', () => {

    it('stops the schedule', () => {
      let events = [];
      const scheduler = new Scheduler({ bpm: 10000 });
      scheduler.at(3, () => events.push(3));
      scheduler.at(2, () => events.push(2));
      scheduler.at(1, () => events.push(1));
      scheduler.start();
      scheduler.stop();
      return sleep(20).then(() => {
        assert.deepEqual(events, []);
      })
    });

    it("doesn't blow up if the scheduler wasn't started", () => {
      new Scheduler().stop();
    });
  });
});
