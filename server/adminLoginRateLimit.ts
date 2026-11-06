type Attempt = { count: number; resetAt: number };

const attempts = new Map<string, Attempt>();
const WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 5;

export function adminLoginKey(ip: string | undefined, email: string) {
  return `${ip || "unknown"}:${email.trim().toLowerCase()}`;
}

export function assertAdminLoginAllowed(key: string, now = Date.now()) {
  const entry = attempts.get(key);
  if (!entry || entry.resetAt <= now) {
    attempts.delete(key);
    return;
  }
  if (entry.count >= MAX_ATTEMPTS) throw new Error("Too many sign-in attempts. Please wait 15 minutes and try again.");
}

export function recordAdminLoginFailure(key: string, now = Date.now()) {
  const entry = attempts.get(key);
  if (!entry || entry.resetAt <= now) {
    attempts.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return;
  }
  attempts.set(key, { ...entry, count: entry.count + 1 });
}

export function clearAdminLoginFailures(key: string) {
  attempts.delete(key);
}

export function resetAdminLoginRateLimitForTests() {
  attempts.clear();
}
