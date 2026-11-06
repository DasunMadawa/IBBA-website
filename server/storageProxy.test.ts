import path from "node:path";
import { describe, expect, it } from "vitest";
import { resolveLocalStorageFile } from "./_core/storageProxy";

describe("local storage fallback", () => {
  const root = path.resolve("/tmp/ibaa-storage-test");

  it("resolves ordinary managed asset keys inside the configured root", () => {
    expect(resolveLocalStorageFile("ibaa-wordmark.webp", root)).toBe(path.join(root, "ibaa-wordmark.webp"));
  });

  it("rejects parent-directory traversal", () => {
    expect(resolveLocalStorageFile("../../etc/passwd", root)).toBeNull();
  });

  it("rejects an absolute path outside the configured root", () => {
    expect(resolveLocalStorageFile("/etc/passwd", root)).toBeNull();
  });
});
