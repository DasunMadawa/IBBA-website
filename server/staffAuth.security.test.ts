import { describe, expect, it } from "vitest";
import { adminLoginKey, assertAdminLoginAllowed, recordAdminLoginFailure, resetAdminLoginRateLimitForTests } from "./adminLoginRateLimit";
import { createPasswordHash, staffCookieOptions, verifyPasswordHash } from "./staffAuth";

describe("staff administrator authentication", () => {
  it("stores a salted scrypt hash and verifies only the correct password", async () => {
    const hash = await createPasswordHash("A-long-temporary-password!42");
    expect(hash).toMatch(/^scrypt\$[a-f0-9]{32}\$[a-f0-9]{128}$/);
    expect(await verifyPasswordHash("A-long-temporary-password!42", hash)).toBe(true);
    expect(await verifyPasswordHash("wrong-password", hash)).toBe(false);
  });

  it("uses HttpOnly strict cookies and Secure on forwarded HTTPS", () => {
    const options = staffCookieOptions({ protocol: "http", headers: { "x-forwarded-proto": "https" } } as never);
    expect(options).toMatchObject({ httpOnly: true, sameSite: "strict", secure: true, path: "/" });
  });

  it("blocks the sixth failed login within the bounded window", () => {
    resetAdminLoginRateLimitForTests();
    const key = adminLoginKey("127.0.0.1", "admin@example.org");
    for (let index = 0; index < 5; index += 1) recordAdminLoginFailure(key, 1000);
    expect(() => assertAdminLoginAllowed(key, 1001)).toThrow(/Too many sign-in attempts/);
  });
});
