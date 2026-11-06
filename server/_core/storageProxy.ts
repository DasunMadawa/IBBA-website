import type { Express } from "express";
import { access } from "node:fs/promises";
import path from "node:path";
import { ENV } from "./env";
import { getPortableS3Config, storageGetSignedUrl } from "../storage";

export function resolveLocalStorageFile(key: string, root = path.resolve(process.cwd(), "dist/public/manus-storage")) {
  const resolved = path.resolve(root, key);
  return resolved.startsWith(`${root}${path.sep}`) ? resolved : null;
}

export function registerStorageProxy(app: Express) {
  app.get("/manus-storage/*", async (req, res) => {
    const key = (req.params as Record<string, string>)[0];
    if (!key) {
      res.status(400).send("Missing storage key");
      return;
    }

    const localFile = resolveLocalStorageFile(key);
    if (!localFile) {
      res.status(400).send("Invalid storage key");
      return;
    }

    try {
      await access(localFile);
      res.set("Cache-Control", "public, max-age=31536000, immutable");
      res.sendFile(localFile);
      return;
    } catch {
      // Continue to the configured remote storage provider.
    }

    if (getPortableS3Config()) {
      try {
        res.set("Cache-Control", "private, no-store");
        res.redirect(307, await storageGetSignedUrl(key));
      } catch (err) {
        console.error("[StorageProxy] portable S3 failed:", err);
        res.status(502).send("Storage backend error");
      }
      return;
    }

    if (!ENV.forgeApiUrl || !ENV.forgeApiKey) {
      res.status(404).send("Storage file not found");
      return;
    }

    try {
      const forgeUrl = new URL(
        "v1/storage/presign/get",
        ENV.forgeApiUrl.replace(/\/+$/, "") + "/",
      );
      forgeUrl.searchParams.set("path", key);

      const forgeResp = await fetch(forgeUrl, {
        headers: { Authorization: `Bearer ${ENV.forgeApiKey}` },
      });

      if (!forgeResp.ok) {
        const body = await forgeResp.text().catch(() => "");
        console.error(`[StorageProxy] forge error: ${forgeResp.status} ${body}`);
        res.status(502).send("Storage backend error");
        return;
      }

      const { url } = (await forgeResp.json()) as { url: string };
      if (!url) {
        res.status(502).send("Empty signed URL from backend");
        return;
      }

      res.set("Cache-Control", "no-store");
      res.redirect(307, url);
    } catch (err) {
      console.error("[StorageProxy] failed:", err);
      res.status(502).send("Storage proxy error");
    }
  });
}
