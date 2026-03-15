// src/core/temporal/TemporalBrain.js
// LifeKompas — Stabilized Temporal Engine
// ALL TEMPORAL ENGINE FIXES APPLIED

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
    this.obligations = [];
    this._lastMidnight = null;

    this.clock.subscribe(this.onTick.bind(this));
    this.clock.start();

    TemporalBrain.instance = this;
  }

  // ===== CORE TICK HANDLER =====
  onTick(now) {
    // Check for midnight transition
    this._checkMidnight(now);

    // Get only timed obligations (exclude "Kad stigneš") that are active
    const timedObligations = this.obligations.filter(o => o.dateTime && o.status !== 'done');
    
    // Sort by dateTime ASC
    const sorted = [...timedObligations].sort((a, b) => 
      new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime()
    );

    // Calculate temporal state
    const result = this._calculatePointer(sorted, now);

    // Calculate 24h progress
    const progressPercent = this._calculate24hProgress(now);

    // Calculate next midnight
    const midnightAt = this._getNextMidnight(now);

    // Build new state
    const newState = Object.freeze({
      now,
      pointer: result.pointer,
      pointerPosition: result.pointerPosition,
      past: result.past,
      future: result.future,
      nextChangeAt: result.nextChangeAt,
      midnightAt,
      progressPercent,
      timedObligations: sorted,
      allObligations: this.obligations
    });

    // Schedule precise update for next obligation
    if (newState.nextChangeAt) {
      this.clock.scheduleAt(newState.nextChangeAt, () => {
        console.log('[Temporal] Precise pointer update');
      });
    }

    // Schedule midnight transition
    // schedule midnight transition only once per day
if (midnightAt && this._scheduledMidnight !== midnightAt) {

  this._scheduledMidnight = midnightAt;

  this.clock.scheduleAt(midnightAt, () => {
    console.log('[Temporal] Midnight transition');
    this._onMidnight();
  });

}

    // Emit only if state changed
    if (this._hasStateChanged(newState)) {
      this.state = newState;
      this.emit();
    }
  }

  // ===== POINTER CALCULATION (STABILIZED) =====
  _calculatePointer(sorted, now) {

  let pointer = null;
  let pointerPosition = null;
  let past = [];
  let future = [];
  let nextChangeAt = null;

  if (!Array.isArray(sorted) || sorted.length === 0) {
    return { pointer: null, pointerPosition: null, past: [], future: [], nextChangeAt: null };
  }

  for (let i = 0; i < sorted.length; i++) {

    const ts = new Date(sorted[i].dateTime).getTime();

    if (ts < now) {
      past.push(sorted[i]);
    } else {
      future.push(sorted[i]);
    }

  }

  // BEFORE first obligation
  if (past.length === 0 && future.length > 0) {

    pointer = 0;
    pointerPosition = 'before';
    nextChangeAt = new Date(future[0].dateTime).getTime();

  }

  // BETWEEN obligations
  else if (past.length > 0 && future.length > 0) {

    pointer = past.length;
    pointerPosition = 'between';
    nextChangeAt = new Date(future[0].dateTime).getTime();

  }

  // AFTER last obligation
  else if (future.length === 0 && past.length > 0) {

    pointer = sorted.length - 1;
    pointerPosition = 'after';

  }

  return { pointer, pointerPosition, past, future, nextChangeAt };

}

  // ===== POINTER CLAMP SAFETY =====
  _clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  // ===== 24H PROGRESS =====
  _calculate24hProgress(now) {
    const date = new Date(now);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();

    const totalMinutes = hours * 60 + minutes + seconds / 60;
    const percent = (totalMinutes / 1440) * 100; // 1440 = 24 * 60

    return Math.round(percent * 10) / 10;
  }

  // ===== MIDNIGHT HELPERS =====
  _getTodayStart(now) {
    const d = new Date(now);
    d.setHours(0, 0, 0, 0);
    return d.getTime();
  }

  _getTodayEnd(now) {
    const d = new Date(now);
    d.setHours(23, 59, 59, 999);
    return d.getTime();
  }

  _getNextMidnight(now) {
    const d = new Date(now);
    d.setDate(d.getDate() + 1);
    d.setHours(0, 0, 0, 0);
    return d.getTime();
  }

  _checkMidnight(now) {
    const todayKey = new Date(now).toDateString();
    
    if (this._lastMidnight && this._lastMidnight !== todayKey) {
      this._onMidnight();
    }
    
    this._lastMidnight = todayKey;
  }

  _onMidnight() {
    console.log('[Temporal] Midnight - triggering day reload');
    
    // Emit midnight event for UI to handle
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('temporalMidnight'));
    }
  }

  // ===== STATE COMPARISON =====
  _hasStateChanged(newState) {
    if (!this.state) return true;

    const oldTimed = Array.isArray(this.state.timedObligations)
      ? this.state.timedObligations
      : [];

    const newTimed = Array.isArray(newState.timedObligations)
      ? newState.timedObligations
      : [];

    if (oldTimed.length !== newTimed.length) return true;

    for (let i = 0; i < newTimed.length; i++) {
      const oldOb = oldTimed[i];
      const newOb = newTimed[i];

      if (!oldOb || !newOb) return true;

      if (
        oldOb.id !== newOb.id ||
        oldOb.dateTime !== newOb.dateTime ||
        oldOb.status !== newOb.status
      ) {
        return true;
      }
    }

    return (
      this.state.pointer !== newState.pointer ||
      this.state.pointerPosition !== newState.pointerPosition ||
      this.state.nextChangeAt !== newState.nextChangeAt ||
      Math.abs((this.state.progressPercent || 0) - (newState.progressPercent || 0)) > 0.1
    );
  }

  // ===== SUBSCRIPTION SYSTEM =====
  subscribe(fn) {
    this.subscribers.add(fn);

    // Instant state delivery for late subscribers
    if (this.state) {
      fn(this.state);
    }
  }

  unsubscribe(fn) {
    this.subscribers.delete(fn);
  }

  emit() {
    this.subscribers.forEach(fn => {
      try {
        fn(this.state);
      } catch (e) {
        console.error('[Temporal] Subscriber error:', e);
      }
    });
  }

  // ===== DATA STATE (NOT DOM) =====
  setObligations(list) {
    this.obligations = Array.isArray(list) ? list : [];
    
    // Instant temporal recompute
    this.onTick(Date.now());
  }

  getState() {
    return this.state;
  }

  // ===== TRIGGER METHODS =====
  triggerDataChange() {
    this.onTick(Date.now());
  }

  triggerUIRender() {
    this.emit();
  }

}

export default new TemporalBrain();
