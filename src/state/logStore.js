/**
 * Log store — a thin wrapper over localStorage holding the collected card
 * IDs as a JSON array under a single key. If localStorage is unavailable or
 * the stored JSON is corrupt, falls back to an in-memory list so the app
 * still runs; it simply won't persist that session (spec.md > Important
 * Failure Modes).
 */
const KEY = 'matchday-hop:log';

let memoryFallback = null; // used only if localStorage is unusable

function canUseStorage() {
  try {
    const t = '__mh_test__';
    window.localStorage.setItem(t, '1');
    window.localStorage.removeItem(t);
    return true;
  } catch (e) {
    return false;
  }
}

const usingStorage = canUseStorage();
if (!usingStorage) memoryFallback = [];

/** Return the array of collected card IDs (de-duplicated, order preserved). */
export function getCollected() {
  if (!usingStorage) return [...memoryFallback];
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    // Corrupt JSON — reset to empty rather than crash.
    return [];
  }
}

/** Add a card ID if not already collected. Returns the updated list. */
export function addCard(id) {
  const list = getCollected();
  if (!list.includes(id)) list.push(id);
  if (usingStorage) {
    try {
      window.localStorage.setItem(KEY, JSON.stringify(list));
    } catch (e) {
      /* ignore write failure; stays in the returned list for this session */
    }
  } else {
    memoryFallback = list;
  }
  return list;
}

/** True if persistence is backed by localStorage (false = session-only). */
export function isPersistent() {
  return usingStorage;
}
