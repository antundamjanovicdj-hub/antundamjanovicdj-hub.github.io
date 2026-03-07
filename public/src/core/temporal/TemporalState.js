// src/core/temporal/TemporalState.js
// LifeKompas — Temporal State Factory

export function createTemporalState() {
  return Object.freeze({
    now: null,
    pointer: null,
    pointerPosition: null, // 'before' | 'on' | 'between' | 'after'
    past: [],
    future: [],
    nextChangeAt: null,
    midnightAt: null,
    progressPercent: 0
  });
}