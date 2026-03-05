export function createTemporalState() {
  return Object.freeze({
    now: null,
    pointer: null,
    past: [],
    future: [],
    nextChangeAt: null
  });
}