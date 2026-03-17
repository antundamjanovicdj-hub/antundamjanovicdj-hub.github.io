// ===== TEMPORAL BRIDGE (ENGINE BOUNDARY) =====

import Temporal from './index.js';
import { obligationDB } from '/core/services/db.js';

export async function getFreshTemporalState() {

  const all = await obligationDB.getAll();

  const obligations = all.filter(o => o.type !== 'shopping');

  Temporal.setObligations(obligations);

  const temporalState = Temporal.getState?.() || null;

  return {
    all,
    obligations,
    temporalState
  };
}