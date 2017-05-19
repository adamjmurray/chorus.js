/**
 * Schedules functions to occur at a given time in the future, relative to the start time.
 * Can be used to play music in realtime.
 */
class Scheduler {

  constructor({ bpm=120 } = {}) {
    this.schedule = new Map();
    this.bpm = bpm;
  }

  /**
   * Delete all scheduled callbacks
   */
  clear() {
    this.schedule.clear();
  }

  /**
   * Schedule a callback to run.
   * Note, you may call this repeatedly with the same time parameter. It will append to any existing callbacks.
   * @param time {Number} - Time in milliseconds, relative to when {@link Scheduler#start scheduler.start()} is called.
   * @param callback {Function} - The code to execute at the scheduled time.
   */
  at(time, callback) {
    if (typeof time !== 'number') throw new TypeError('time must be a number');
    if (typeof callback !== 'function') throw new TypeError('callback must be a function');
    const timeInBeats = time * 60000/this.bpm;
    let callbacks = this.schedule.get(timeInBeats);
    if (!callbacks) {
      callbacks = [];
      this.schedule.set(timeInBeats, callbacks);
    }
    callbacks.push(callback);
  }

  /**
   * Run the scheduler and execute the callbacks as scheduled.
   */
  start() {
    this.times = [...this.schedule.keys()].sort((a,b) => a-b);
    this.startTime = new Date().getTime();
    this.tick();
  }

  /**
   * Stop the scheduler.
   */
  stop() {
    if (this.timeout) clearTimeout(this.timeout);
  }

  /**
   * @private
   */
  tick() {
    if (!this.nextTime) {
      this.nextSchedule = this.times.shift();
      if (this.nextSchedule == null) return;
      this.nextTime = this.startTime + this.nextSchedule;
    }
    if (this.nextTime <= new Date().getTime()) {
      const callbacks = this.schedule.get(this.nextSchedule) || [];
      this.nextSchedule = null;
      this.nextTime = null;
      callbacks.forEach(callback => callback.call(this.nextSchedule));
    }
    this.timeout = setTimeout(() => this.tick(), 1);
  }

}

module.exports = Scheduler;
