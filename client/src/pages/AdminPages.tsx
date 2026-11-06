import { useAuth } from "@/_core/hooks/useAuth";
import DashboardLayout from "@/components/DashboardLayout";
import { SecureYouTubeEmbed } from "@/components/site/SecureYouTubeEmbed";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";
import { normalizeYouTubeUrl } from "@shared/youtube";
import { CheckCircle2, FileText, ImageIcon, Loader2, Pencil, Plus, Trash2, UploadCloud } from "lucide-react";
import React from "react";
import { useMemo, useRef, useState } from "react";
import { toast } from "sonner";

type EntryForm = {
  id?: number;
  title: string;
  slug: string;
  excerpt: string;
  body: string;
  contentType: "news" | "media";
  status: "draft" | "published";
  authorName: string;
  publicationDate: string;
  youtubeUrl: string;
  youtubeTitle: string;
  featuredMediaId: string;
  attachmentMediaIds: string[];
  legacyUrl: string;
  categories: string;
};

type FieldErrors = Record<string, string>;

const emptyForm: EntryForm = {
  title: "",
  slug: "",
  excerpt: "",
  body: "",
  contentType: "news",
  status: "draft",
  authorName: "IBAA Editorial Team",
  publicationDate: "",
  youtubeUrl: "",
  youtubeTitle: "",
  featuredMediaId: "none",
  attachmentMediaIds: [],
  legacyUrl: "",
  categories: "News",
};

const contentFieldIds: Record<string, string> = {
  title: "entry-title",
  slug: "entry-slug",
  excerpt: "entry-excerpt",
  body: "entry-body",
  authorName: "entry-author",
  youtubeUrl: "entry-youtube",
  youtubeTitle: "entry-youtube-title",
  legacyUrl: "entry-legacy",
};

function slugify(value: string) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function toLocalInput(milliseconds: number | null) {
  if (!milliseconds) return "";
  const date = new Date(milliseconds);
  return new Date(date.getTime() - date.getTimezoneOffset() * 60_000).toISOString().slice(0, 16);
}

function errorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Something went wrong. Please try again.";
}

function validateEntryForm(form: EntryForm): FieldErrors {
  const errors: FieldErrors = {};
  if (form.title.trim().length < 3) errors.title = "Enter a title with at least 3 characters.";
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(form.slug)) errors.slug = "Use lowercase words separated by hyphens.";
  if (form.excerpt.trim().length < 10) errors.excerpt = "Enter a summary with at least 10 characters.";
  if (form.body.trim().length < 20) errors.body = "Enter an article body with at least 20 characters.";
  if (form.authorName.trim().length < 2) errors.authorName = "Enter the public author name.";
  if (form.youtubeUrl && !normalizeYouTubeUrl(form.youtubeUrl)) errors.youtubeUrl = "Use a valid HTTPS YouTube watch, youtu.be, shorts, or embed URL.";
  if (form.youtubeUrl && !form.youtubeTitle.trim()) errors.youtubeTitle = "Enter an accessible title for this video.";
  if (form.legacyUrl) {
    try {
      const url = new URL(form.legacyUrl);
      if (url.protocol !== "https:") errors.legacyUrl = "Use a secure legacy URL beginning with https://.";
    } catch {
      errors.legacyUrl = "Enter a complete legacy URL beginning with https://.";
    }
  }
  return errors;
}

function FieldError({ id, message }: { id: string; message?: string }) {
  return message ? <p id={id} className="admin-field-error" role="alert">{message}</p> : null;
}

function QueryError({ title, message, retry }: { title: string; message: string; retry: () => void }) {
  return <div className="admin-query-error" role="alert"><strong>{title}</strong><span>{message}</span><Button type="button" variant="outline" onClick={retry}>Try again</Button></div>;
}

function AdminHeader({ eyebrow, title, intro }: { eyebrow: string; title: string; intro: string }) {
  return <header className="admin-header"><div><p>{eyebrow}</p><h1>{title}</h1><span>{intro}</span></div><a href="/news-media" target="_blank" rel="noreferrer">View public news</a></header>;
}

export function AdminContentPage() {
  const { user } = useAuth();
  const utils = trpc.useUtils();
  const entries = trpc.content.adminList.useQuery(undefined, { enabled: user?.role === "admin" });
  const media = trpc.media.adminList.useQuery(undefined, { enabled: user?.role === "admin" });
  const [form, setForm] = useState<EntryForm>(emptyForm);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const deleteTriggerRef = useRef<HTMLButtonElement | null>(null);
  const selectedMedia = useMemo(() => media.data?.find(asset => asset.id === Number(form.featuredMediaId)), [media.data, form.featuredMediaId]);
  const documentAssets = media.data?.filter(asset => asset.mediaKind === "document") ?? [];

  const save = trpc.content.save.useMutation({
    onSuccess: async () => {
      toast.success(form.id ? "Entry updated" : "Entry created");
      await utils.content.adminList.invalidate();
      await utils.content.listPublished.invalidate();
      setForm(emptyForm);
      setFieldErrors({});
    },
    onError: error => toast.error(error.message),
  });
  const status = trpc.content.setStatus.useMutation({
    onSuccess: async () => {
      toast.success("Publishing status updated");
      await utils.content.adminList.invalidate();
      await utils.content.listPublished.invalidate();
    },
    onError: error => toast.error(error.message),
  });
  const remove = trpc.content.remove.useMutation({
    onSuccess: async () => {
      toast.success("Entry deleted");
      setDeleteId(null);
      await utils.content.adminList.invalidate();
      await utils.content.listPublished.invalidate();
    },
    onError: error => toast.error(error.message),
  });

  const editEntry = (entry: NonNullable<typeof entries.data>[number]) => {
    setForm({
      id: entry.id,
      title: entry.title,
      slug: entry.slug,
      excerpt: entry.excerpt,
      body: entry.body,
      contentType: entry.contentType,
      status: entry.status,
      authorName: entry.authorName,
      publicationDate: toLocalInput(entry.publishedAt),
      youtubeUrl: entry.youtubeUrl ?? "",
      youtubeTitle: entry.youtubeTitle ?? "",
      featuredMediaId: entry.featuredMediaId?.toString() ?? "none",
      attachmentMediaIds: entry.attachments.map(asset => asset.id.toString()),
      legacyUrl: entry.legacyUrl ?? "",
      categories: entry.categories.join(", "),
    });
    setFieldErrors({});
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
  };

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    const errors = validateEntryForm(form);
    setFieldErrors(errors);
    const firstError = Object.keys(errors)[0];
    if (firstError) {
      document.getElementById(contentFieldIds[firstError])?.focus();
      return;
    }
    save.mutate({
      id: form.id,
      title: form.title,
      slug: form.slug,
      excerpt: form.excerpt,
      body: form.body,
      contentType: form.contentType,
      status: form.status,
      authorName: form.authorName,
      publishedAt: form.publicationDate ? new Date(form.publicationDate).getTime() : null,
      youtubeUrl: form.youtubeUrl || null,
      youtubeTitle: form.youtubeTitle || null,
      featuredMediaId: form.featuredMediaId === "none" ? null : Number(form.featuredMediaId),
      attachmentMediaIds: form.attachmentMediaIds.map(Number),
      legacyUrl: form.legacyUrl || null,
      categoryNames: form.categories.split(",").map(value => value.trim()).filter(Boolean),
    });
  };

  return <DashboardLayout><div className="admin-page">
    <AdminHeader eyebrow="Publishing" title="News & media" intro="Create, preview, publish, and preserve IBAA’s public record." />
    {media.isError ? <QueryError title="Media library could not be loaded." message={media.error.message} retry={() => void media.refetch()} /> : null}

    <div className="admin-editor-grid">
      <form className="admin-form" onSubmit={submit} noValidate>
        <div className="admin-form-title"><div><p>{form.id ? "Edit entry" : "New entry"}</p><h2>{form.id ? form.title || "Untitled entry" : "Draft a story"}</h2></div>{form.id ? <Button type="button" variant="outline" onClick={() => { setForm(emptyForm); setFieldErrors({}); }}><Plus />New</Button> : null}</div>
        <div className="admin-two-columns">
          <label><Label htmlFor="entry-type">Content type</Label><Select value={form.contentType} onValueChange={(value: "news" | "media") => setForm(current => ({ ...current, contentType: value }))}><SelectTrigger id="entry-type"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="news">News</SelectItem><SelectItem value="media">Media</SelectItem></SelectContent></Select></label>
          <label><Label htmlFor="entry-status">Status</Label><Select value={form.status} onValueChange={(value: "draft" | "published") => setForm(current => ({ ...current, status: value }))}><SelectTrigger id="entry-status"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="draft">Draft</SelectItem><SelectItem value="published">Published</SelectItem></SelectContent></Select></label>
        </div>
        <label><Label htmlFor="entry-title">Title</Label><Input id="entry-title" value={form.title} onChange={event => setForm(current => ({ ...current, title: event.target.value, slug: current.id ? current.slug : slugify(event.target.value) }))} aria-invalid={Boolean(fieldErrors.title)} aria-describedby={fieldErrors.title ? "entry-title-error" : undefined} /><FieldError id="entry-title-error" message={fieldErrors.title} /></label>
        <label><Label htmlFor="entry-slug">URL slug</Label><Input id="entry-slug" value={form.slug} onChange={event => setForm(current => ({ ...current, slug: slugify(event.target.value) }))} aria-invalid={Boolean(fieldErrors.slug)} aria-describedby={fieldErrors.slug ? "entry-slug-error" : undefined} /><small>/news/{form.slug || "your-story"}</small><FieldError id="entry-slug-error" message={fieldErrors.slug} /></label>
        <label><Label htmlFor="entry-excerpt">Short summary</Label><Textarea id="entry-excerpt" value={form.excerpt} onChange={event => setForm(current => ({ ...current, excerpt: event.target.value }))} rows={3} aria-invalid={Boolean(fieldErrors.excerpt)} aria-describedby={fieldErrors.excerpt ? "entry-excerpt-error" : undefined} /><FieldError id="entry-excerpt-error" message={fieldErrors.excerpt} /></label>
        <label><Label htmlFor="entry-body">Article body</Label><Textarea id="entry-body" value={form.body} onChange={event => setForm(current => ({ ...current, body: event.target.value }))} rows={12} aria-invalid={Boolean(fieldErrors.body)} aria-describedby={fieldErrors.body ? "entry-body-error" : undefined} /><small>Separate paragraphs with a blank line. Plain text is used to keep publishing secure and predictable.</small><FieldError id="entry-body-error" message={fieldErrors.body} /></label>
        <div className="admin-two-columns">
          <label><Label htmlFor="entry-author">Author name</Label><Input id="entry-author" value={form.authorName} onChange={event => setForm(current => ({ ...current, authorName: event.target.value }))} aria-invalid={Boolean(fieldErrors.authorName)} aria-describedby={fieldErrors.authorName ? "entry-author-error" : undefined} /><FieldError id="entry-author-error" message={fieldErrors.authorName} /></label>
          <label><Label htmlFor="entry-date">Publication date</Label><Input id="entry-date" type="datetime-local" value={form.publicationDate} onChange={event => setForm(current => ({ ...current, publicationDate: event.target.value }))} /></label>
        </div>
        <label><Label htmlFor="entry-categories">Categories</Label><Input id="entry-categories" value={form.categories} onChange={event => setForm(current => ({ ...current, categories: event.target.value }))} placeholder="News, Study Circles" /><small>Separate categories with commas.</small></label>
        <label><Label htmlFor="entry-media">Featured image</Label><Select value={form.featuredMediaId} onValueChange={value => setForm(current => ({ ...current, featuredMediaId: value }))}><SelectTrigger id="entry-media"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="none">No featured image</SelectItem>{media.data?.filter(asset => asset.mediaKind === "image").map(asset => <SelectItem key={asset.id} value={asset.id.toString()}>{asset.originalName}</SelectItem>)}</SelectContent></Select><small>Upload reusable images in the Media library.</small></label>

        <fieldset className="admin-fieldset"><legend>Downloadable document attachments</legend>{documentAssets.length ? <div className="admin-attachment-options">{documentAssets.map(asset => <label key={asset.id}><input type="checkbox" checked={form.attachmentMediaIds.includes(asset.id.toString())} onChange={event => setForm(current => ({ ...current, attachmentMediaIds: event.target.checked ? [...current.attachmentMediaIds, asset.id.toString()] : current.attachmentMediaIds.filter(id => id !== asset.id.toString()) }))} /><span><strong>{asset.originalName}</strong><small>{asset.caption || "PDF document"}</small></span></label>)}</div> : <p className="admin-field-help">No PDF documents are available. Upload one in the Media library, then return to attach it.</p>}</fieldset>

        <fieldset className="admin-fieldset"><legend>Optional YouTube video</legend>
          <label><Label htmlFor="entry-youtube">YouTube URL</Label><Input id="entry-youtube" type="url" value={form.youtubeUrl} onChange={event => setForm(current => ({ ...current, youtubeUrl: event.target.value }))} placeholder="https://www.youtube.com/watch?v=…" aria-invalid={Boolean(fieldErrors.youtubeUrl)} aria-describedby={fieldErrors.youtubeUrl ? "entry-youtube-error" : undefined} /><FieldError id="entry-youtube-error" message={fieldErrors.youtubeUrl} /></label>
          <label><Label htmlFor="entry-youtube-title">Accessible video title</Label><Input id="entry-youtube-title" value={form.youtubeTitle} onChange={event => setForm(current => ({ ...current, youtubeTitle: event.target.value }))} aria-invalid={Boolean(fieldErrors.youtubeTitle)} aria-describedby={fieldErrors.youtubeTitle ? "entry-youtube-title-error" : undefined} /><small>Required whenever a YouTube URL is present.</small><FieldError id="entry-youtube-title-error" message={fieldErrors.youtubeTitle} /></label>
        </fieldset>
        <label><Label htmlFor="entry-legacy">Original legacy URL</Label><Input id="entry-legacy" type="url" value={form.legacyUrl} onChange={event => setForm(current => ({ ...current, legacyUrl: event.target.value }))} placeholder="https://www.ibaa.org/index.php/…" aria-invalid={Boolean(fieldErrors.legacyUrl)} aria-describedby={fieldErrors.legacyUrl ? "entry-legacy-error" : undefined} /><FieldError id="entry-legacy-error" message={fieldErrors.legacyUrl} /></label>
        <div className="admin-form-actions"><Button type="submit" disabled={save.isPending}>{save.isPending ? <Loader2 className="animate-spin" /> : <CheckCircle2 />}{form.id ? "Save changes" : "Create entry"}</Button><span>{form.status === "published" ? "Saving will make this entry public." : "Drafts remain private to administrators."}</span></div>
      </form>

      <aside className="admin-preview" aria-labelledby="preview-title">
        <p>Live preview</p><h2 id="preview-title">{form.title || "Your title will appear here"}</h2><div className="admin-preview-meta">{form.publicationDate ? new Date(form.publicationDate).toLocaleString() : "Publication date not set"} · {form.authorName}</div>
        {selectedMedia ? <figure><img src={selectedMedia.url} alt={selectedMedia.altText ?? ""} /><figcaption>{selectedMedia.caption}</figcaption></figure> : <div className="admin-preview-placeholder"><ImageIcon /><span>No featured image selected</span></div>}
        <p className="admin-preview-excerpt">{form.excerpt || "The short summary will introduce the entry."}</p>
        {form.youtubeUrl ? <SecureYouTubeEmbed url={form.youtubeUrl} title={form.youtubeTitle} /> : null}
        <div className="admin-preview-body">{(form.body || "Start writing to preview article paragraphs.").split(/\n\s*\n/).map((paragraph, index) => <p key={index}>{paragraph}</p>)}</div>
        {form.attachmentMediaIds.length ? <div className="admin-preview-attachments"><strong>Downloads</strong>{documentAssets.filter(asset => form.attachmentMediaIds.includes(asset.id.toString())).map(asset => <span key={asset.id}>{asset.originalName}</span>)}</div> : null}
      </aside>
    </div>

    <section className="admin-list" aria-labelledby="managed-entries-title">
      <div className="admin-section-title"><div><p>Managed entries</p><h2 id="managed-entries-title">Drafts and published stories</h2></div><span>{entries.data?.length ?? 0} entries</span></div>
      {entries.isError ? <QueryError title="Managed entries could not be loaded." message={entries.error.message} retry={() => void entries.refetch()} /> : entries.isLoading ? <div className="admin-loading"><Loader2 className="animate-spin" />Loading entries</div> : entries.data?.length ? <div className="admin-entry-list">{entries.data.map(entry => <article key={entry.id}><div><span className={`admin-status admin-status-${entry.status}`}>{entry.status}</span><p>{entry.contentType} · {entry.categories.join(" · ") || "Uncategorized"}</p><h3>{entry.title}</h3><small>Updated {new Date(entry.updatedAt).toLocaleString()} · {entry.attachments.length} downloads</small></div><div className="admin-entry-actions"><Button variant="outline" onClick={() => editEntry(entry)}><Pencil />Edit</Button><Button variant="outline" onClick={() => status.mutate({ id: entry.id, status: entry.status === "published" ? "draft" : "published" })}>{entry.status === "published" ? "Unpublish" : "Publish"}</Button><Button variant="ghost" className="text-destructive" onClick={event => { deleteTriggerRef.current = event.currentTarget; setDeleteId(entry.id); }}><Trash2 />Delete</Button></div></article>)}</div> : <div className="admin-empty"><FileText /><h3>No managed entries yet</h3><p>Create the first draft with the form above. The verified legacy archive remains visible on the public site.</p></div>}
    </section>
    <AlertDialog open={deleteId !== null} onOpenChange={open => !open && setDeleteId(null)}><AlertDialogContent onCloseAutoFocus={event => { event.preventDefault(); deleteTriggerRef.current?.focus(); }}><AlertDialogHeader><AlertDialogTitle>Delete this entry?</AlertDialogTitle><AlertDialogDescription>This permanently removes the database record. Uploaded media will remain available in the reusable media library.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={() => deleteId && remove.mutate({ id: deleteId })}>Delete entry</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog>
  </div></DashboardLayout>;
}

function readFileAsBase64(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result).split(",")[1] ?? "");
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

const allowedUploadTypes = ["image/jpeg", "image/png", "image/webp", "application/pdf"] as const;
type AllowedUploadType = typeof allowedUploadTypes[number];

export function AdminMediaPage() {
  const { user } = useAuth();
  const utils = trpc.useUtils();
  const assets = trpc.media.adminList.useQuery(undefined, { enabled: user?.role === "admin" });
  const [file, setFile] = useState<File | null>(null);
  const [altText, setAltText] = useState("");
  const [caption, setCaption] = useState("");
  const [uploadError, setUploadError] = useState("");
  const upload = trpc.media.upload.useMutation({
    onSuccess: async () => {
      toast.success("Media uploaded to secure cloud storage");
      setFile(null); setAltText(""); setCaption(""); setUploadError("");
      const input = document.getElementById("media-file") as HTMLInputElement | null;
      if (input) input.value = "";
      await utils.media.adminList.invalidate();
    },
    onError: error => {
      setUploadError(error.message);
      toast.error(error.message);
    },
  });

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!file) return setUploadError("Choose a JPEG, PNG, WebP, or PDF file.");
    if (!allowedUploadTypes.includes(file.type as AllowedUploadType)) return setUploadError("This file type is not allowed. Choose a JPEG, PNG, WebP, or PDF.");
    if (file.size > 10 * 1024 * 1024) return setUploadError("Files must be 10 MB or smaller.");
    if (file.type.startsWith("image/") && !altText.trim()) return setUploadError("Alternative text is required for photographs and graphics.");
    setUploadError("");
    try {
      const base64 = await readFileAsBase64(file);
      upload.mutate({ originalName: file.name, mimeType: file.type as AllowedUploadType, base64, altText: altText || null, caption: caption || null });
    } catch (error) {
      setUploadError(errorMessage(error));
    }
  };

  return <DashboardLayout><div className="admin-page">
    <AdminHeader eyebrow="Cloud storage" title="Media library" intro="Upload and reuse photographs and PDF documents without bundling them with the website." />
    {assets.isError ? <QueryError title="Media files could not be loaded." message={assets.error.message} retry={() => void assets.refetch()} /> : null}
    <form className="media-upload" onSubmit={submit} noValidate>
      <div><UploadCloud /><h2>Upload a file</h2><p>JPEG, PNG, WebP, or PDF. Maximum 10 MB. File signatures are verified by the server.</p></div>
      <label><Label htmlFor="media-file">Choose file</Label><Input id="media-file" type="file" accept="image/jpeg,image/png,image/webp,application/pdf" onChange={event => { setFile(event.target.files?.[0] ?? null); setUploadError(""); }} aria-invalid={Boolean(uploadError)} aria-describedby={uploadError ? "media-upload-error" : undefined} /></label>
      <label><Label htmlFor="media-alt">Alternative text</Label><Input id="media-alt" value={altText} onChange={event => setAltText(event.target.value)} placeholder="Describe the image’s meaningful content" aria-invalid={Boolean(uploadError && file?.type.startsWith("image/"))} aria-describedby={uploadError ? "media-upload-error" : undefined} /><small>Required for photographs and graphics; not used for PDFs.</small></label>
      <label><Label htmlFor="media-caption">Caption or document context</Label><Textarea id="media-caption" value={caption} onChange={event => setCaption(event.target.value)} rows={3} /></label>
      <div className="media-upload-action"><Button type="submit" disabled={upload.isPending}>{upload.isPending ? <Loader2 className="animate-spin" /> : <UploadCloud />}Upload to cloud storage</Button>{uploadError ? <p id="media-upload-error" className="admin-field-error" role="alert">{uploadError}</p> : null}</div>
    </form>
    <section className="media-library" aria-labelledby="media-library-title"><div className="admin-section-title"><div><p>Reusable assets</p><h2 id="media-library-title">Photographs and documents</h2></div><span>{assets.data?.length ?? 0} files</span></div>{assets.isLoading ? <div className="admin-loading"><Loader2 className="animate-spin" />Loading media</div> : assets.data?.length ? <div className="media-library-grid">{assets.data.map(asset => <article key={asset.id}>{asset.mediaKind === "image" ? <img src={asset.url} alt={asset.altText ?? ""} /> : <div className="document-preview"><FileText /><span>PDF</span></div>}<div><p>{asset.mediaKind}</p><h3>{asset.originalName}</h3><span>{(asset.sizeBytes / 1024 / 1024).toFixed(2)} MB · {new Date(asset.createdAt).toLocaleDateString()}</span>{asset.altText ? <small>Alt: {asset.altText}</small> : null}{asset.caption ? <small>{asset.caption}</small> : null}<a href={asset.url} target="_blank" rel="noreferrer">Open file</a></div></article>)}</div> : !assets.isError ? <div className="admin-empty"><ImageIcon /><h3>No uploaded media yet</h3><p>Upload a photograph or PDF above to make it reusable in future entries.</p></div> : null}</section>
  </div></DashboardLayout>;
}
