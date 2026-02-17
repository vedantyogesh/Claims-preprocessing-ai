// In-memory rate limiter — resets on page reload.
// In dev mode (import.meta.env.DEV) both limits are bypassed entirely
// so you can test freely. Active in production builds only.

const MAX_CALLS = 5;
const COOLDOWN_MS = 15_000; // 15-second cooldown between uploads

const IS_DEV = import.meta.env.DEV;

let callCount = 0;
let lastCallTime = 0;

export function checkRateLimit() {
  if (IS_DEV) return { allowed: true, reason: null };

  const now = Date.now();

  if (callCount >= MAX_CALLS) {
    return {
      allowed: false,
      reason: `Maximum ${MAX_CALLS} analyses per session reached. Refresh the page to continue.`,
    };
  }

  const elapsed = now - lastCallTime;
  if (lastCallTime > 0 && elapsed < COOLDOWN_MS) {
    const secs = Math.ceil((COOLDOWN_MS - elapsed) / 1000);
    return {
      allowed: false,
      reason: `Please wait ${secs}s before analysing another document.`,
    };
  }

  return { allowed: true, reason: null };
}

export function recordCall() {
  if (IS_DEV) return; // no-op in dev
  callCount += 1;
  lastCallTime = Date.now();
}
