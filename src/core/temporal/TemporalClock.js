// src/core/temporal/TemporalClock.js
// LifeKompas — Temporal Clock with Minute Safety Refresh

class TemporalClock {

  constructor() {
    this.listeners = new Set();
    this.timer = null;
    this.minuteTimer = null;
    this.nextEventTimer = null;
  }

  subscribe(fn) {
    this.listeners.add(fn);
  }

  unsubscribe(fn) {
    this.listeners.delete(fn);
  }

  start() {
    this.stop();

    // Main tick every second
    this.timer = setInterval(() => {
      const now = Date.now();
      this.listeners.forEach(l => l(now));
    }, 1000);

    // Minute safety refresh (every 60 seconds)
    this.minuteTimer = setInterval(() => {
      const now = Date.now();
      this.listeners.forEach(l => l(now));
    }, 60000);
  }

  stop() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
    if (this.minuteTimer) {
      clearInterval(this.minuteTimer);
      this.minuteTimer = null;
    }
    if (this.nextEventTimer) {
      clearTimeout(this.nextEventTimer);
      this.nextEventTimer = null;
    }
  }

  // Schedule precise update at specific time
  scheduleAt(timestamp, callback) {
    if (this.nextEventTimer) {
      clearTimeout(this.nextEventTimer);
    }

    const delay = timestamp - Date.now();
    if (delay > 0 && delay < 86400000) { // max 24h ahead
      this.nextEventTimer = setTimeout(() => {
        callback(timestamp);
        this.listeners.forEach(l => l(Date.now()));
      }, delay);
    }
  }

}

export default TemporalClock;
