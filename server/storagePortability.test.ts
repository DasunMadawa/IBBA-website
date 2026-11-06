import { describe, expect, it } from "vitest";
import { getPortableS3Config } from "./storage";

describe("portable S3 configuration", () => {
  it("stays disabled unless every required private setting is present", () => {
    expect(getPortableS3Config({ S3_ENDPOINT: "https://objects.example.org" })).toBeNull();
  });

  it("normalizes a complete S3-compatible staging configuration", () => {
    expect(getPortableS3Config({
      S3_ENDPOINT: "https://objects.example.org/",
      S3_REGION: "us-west-2",
      S3_BUCKET: "ibaa-staging",
      S3_ACCESS_KEY_ID: "access-key",
      S3_SECRET_ACCESS_KEY: "secret-key",
      S3_FORCE_PATH_STYLE: "true",
    })).toEqual({
      endpoint: "https://objects.example.org",
      region: "us-west-2",
      bucket: "ibaa-staging",
      accessKeyId: "access-key",
      secretAccessKey: "secret-key",
      forcePathStyle: true,
    });
  });
});
