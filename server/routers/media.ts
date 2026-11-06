import { z } from "zod";
import { adminProcedure, router } from "../_core/trpc";
import { createMediaAsset, listMediaAssets, updateMediaAssetMetadata } from "../mediaDb";
import { storagePut } from "../storage";
import { hasAllowedFileSignature, safeUploadFilename } from "../uploadValidation";

const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;
const ALLOWED_TYPES = new Map([
  ["image/jpeg", "image"],
  ["image/png", "image"],
  ["image/webp", "image"],
  ["application/pdf", "document"],
] as const);

export const mediaRouter = router({
  adminList: adminProcedure.query(() => listMediaAssets()),
  upload: adminProcedure.input(z.object({
    originalName: z.string().trim().min(1).max(255),
    mimeType: z.enum(["image/jpeg", "image/png", "image/webp", "application/pdf"]),
    base64: z.string().min(4).max(15_000_000),
    altText: z.string().trim().max(1000).optional().nullable(),
    caption: z.string().trim().max(2000).optional().nullable(),
  })).mutation(async ({ ctx, input }) => {
    const buffer = Buffer.from(input.base64, "base64");
    const mediaKind = ALLOWED_TYPES.get(input.mimeType);
    if (!mediaKind || !hasAllowedFileSignature(buffer, input.mimeType)) throw new Error("The file content does not match an allowed image or PDF type.");
    if (buffer.byteLength > MAX_UPLOAD_BYTES) throw new Error("Files must be 10 MB or smaller.");
    if (mediaKind === "image" && !input.altText?.trim()) throw new Error("Alternative text is required for images.");

    const stored = await storagePut(`admin/${ctx.user.id}/${mediaKind}/${Date.now()}-${safeUploadFilename(input.originalName)}`, buffer, input.mimeType);
    const id = await createMediaAsset({
      storageKey: stored.key,
      url: stored.url,
      originalName: input.originalName,
      mimeType: input.mimeType,
      sizeBytes: buffer.byteLength,
      mediaKind,
      altText: input.altText || null,
      caption: input.caption || null,
      uploadedBy: ctx.user.id,
    });
    return { id, ...stored };
  }),
  updateMetadata: adminProcedure.input(z.object({
    id: z.number().int().positive(),
    altText: z.string().trim().max(1000).optional().nullable(),
    caption: z.string().trim().max(2000).optional().nullable(),
  })).mutation(async ({ input }) => {
    await updateMediaAssetMetadata(input.id, { altText: input.altText || null, caption: input.caption || null });
    return { success: true } as const;
  }),
});
