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
    let callbacks = this.schedule.get(time);
    if (!callbacks) {
      callbacks = [];
      this.schedule.set(time, callbacks);
    }
    callbacks.push(callback);
  }

  start() {
    this.times = [...this.schedule.keys()].sort((a,b) => a-b);
    this.startTime = new Date().getTime();
    this.tick();
  }

  stop() {
    if (this.timeout) clearTimeout(this.timeout);
  }

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
      callbacks.forEach(callback => callback.call());
    }
    this.timeout = setTimeout(() => this.tick(), 1);
  }

}

module.exports = Scheduler;
