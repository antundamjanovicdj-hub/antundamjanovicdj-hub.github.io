import TemporalClock from './TemporalClock.js';
import { createTemporalState } from './TemporalState.js';

class TemporalBrain {

  constructor() {
    if (TemporalBrain.instance) {
      return TemporalBrain.instance;
    }

    this.clock = new TemporalClock();
    this.subscribers = new Set();
    this.state = createTemporalState();

    this.clock.subscribe(this.onTick.bind(this));
    this.clock.start();
    this.obligations = [];

    TemporalBrain.instance = this;
  }

  onTick(now) {

  let pointer = null;
  let past = [];
  let future = [];

  const sorted = [...this.obligations]
    .filter(o => o.dateTime)
    .sort((a, b) => new Date(a.dateTime) - new Date(b.dateTime));

  for (let i = 0; i < sorted.length; i++) {
    const time = new Date(sorted[i].dateTime).getTime();

    if (time <= now) {
      past.push(sorted[i]);
      pointer = i;
    } else {
      future.push(sorted[i]);
    }
  }

  const newState = Object.freeze({
  now,
  pointer,
  past,
  future,
  nextChangeAt:
    future.length > 0 ? future[0].__time || new Date(future[0].dateTime).getTime() : null
});

// 🫀 emit only if temporal reality changed
if (
  !this.state ||
  this.state.pointer !== newState.pointer ||
  this.state.nextChangeAt !== newState.nextChangeAt
) {
  this.state = newState;
  this.emit();
}
}

  subscribe(fn) {

  this.subscribers.add(fn);

  // 🫀 instant state delivery (late subscriber fix)
  if (this.state) {
    fn(this.state);
  }
}

  unsubscribe(fn) {
    this.subscribers.delete(fn);
  }

  emit() {
    this.subscribers.forEach(fn => fn(this.state));
  }
setObligations(list) {

  this.obligations = Array.isArray(list) ? list : [];

  // 🫀 instant temporal recompute
  this.onTick(Date.now());
}

getState() {
  return this.state;
}

}

export default new TemporalBrain();