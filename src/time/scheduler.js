class Scheduler {

  constructor() {
    this.schedule = new Map();
  }

  clear() {
    this.schedule.clear();
  }

  at(time, callback) {
    if (typeof time !== 'number') throw new TypeError('time must be a number');
    if (typeof callback !== 'function') throw new TypeError('callback must be a function');
    let callbacks;
    if (this.schedule.has(time)) {
      callbacks = this.schedule.get(time);
    } else {
      callbacks = [];
      this.schedule.set(time, callbacks);
    }
    callbacks.push(callback);
  }

  start() {
    this.times = [...this.schedule.keys()].sort();
    this.startTime = new Date().getTime();
    this.tick();
  }

  stop() {
    if (this.timeout) clearTimeout(this.timeout);
  }

  tick() {
    if (!this.nextTime) {
      this.nextSchedule = this.times.shift();
      this.nextTime = this.startTime + this.nextSchedule;
    }
    if (!this.nextTime) return;
    if (this.nextTime <= new Date().getTime()) {
      const callbacks = this.schedule.get(this.nextSchedule) || [];
      this.nextTime = null;
      this.nextSchedule = null;
      for (const callback of callbacks) {
        callback();
      }
    }
    this.timeout = setTimeout(() => this.tick(), 1);
  }

}

module.exports = Scheduler;
