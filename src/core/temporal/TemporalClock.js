class TemporalClock {

  constructor() {
    this.listeners = new Set();
    this.timer = null;
  }

  subscribe(fn) {
    this.listeners.add(fn);
  }

  unsubscribe(fn) {
    this.listeners.delete(fn);
  }

  start() {
    this.stop();

    this.timer = setInterval(() => {
      const now = Date.now();
      this.listeners.forEach(l => l(now));
    }, 1000);
  }

  stop() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

}

export default TemporalClock;