import { describe, expect, it } from "vitest";
import { hasAllowedFileSignature, safeUploadFilename } from "./uploadValidation";

describe("upload validation", () => {
  it.each([
    [Buffer.from([0xff, 0xd8, 0xff, 0x00]), "image/jpeg"],
    [Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]), "image/png"],
    [Buffer.from("RIFF0000WEBP"), "image/webp"],
    [Buffer.from("%PDF-1.7"), "application/pdf"],
  ])("accepts an allowed %s signature", (buffer, mimeType) => {
    expect(hasAllowedFileSignature(buffer as Buffer, mimeType as string)).toBe(true);
  });

  it("rejects content whose signature does not match its declared type", () => {
    expect(hasAllowedFileSignature(Buffer.from("<script>alert(1)</script>"), "image/png")).toBe(false);
  });

  it("normalizes unsafe upload filenames", () => {
    expect(safeUploadFilename("../../2026 Dharma Circle final?.jpg")).toBe("..-..-2026-Dharma-Circle-final-.jpg");
  });
});
