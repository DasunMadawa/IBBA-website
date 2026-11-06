import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { trpc } from "@/lib/trpc";
import { CheckCircle2, FileText, ImageIcon, Loader2, Pencil, Plus, Trash2, UploadCloud } from "lucide-react";
import React, { useRef, useState } from "react";
import { toast } from "sonner";

export type PublishingStatus = "draft" | "published";
export type PublishingTradition = "Theravada" | "Mahayana" | "Vajrayana";
export const traditionOptions: PublishingTradition[] = ["Theravada", "Mahayana", "Vajrayana"];

export function slugify(value: string) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export function dateToUtcNoon(value: string) {
  return new Date(`${value}T12:00:00.000Z`).getTime();
}

export function utcDateInput(value: number) {
  return new Date(value).toISOString().slice(0, 10);
}

export function FieldError({ id, message }: { id: string; message?: string }) {
  return message ? <p id={id} className="admin-field-error" role="alert">{message}</p> : null;
}

export function AdminPageHeader({ eyebrow, title, intro, publicUrl, publicLabel }: { eyebrow: string; title: string; intro: string; publicUrl: string; publicLabel: string }) {
  return <header className="admin-header"><div><p>{eyebrow}</p><h1>{title}</h1><span>{intro}</span></div><a href={publicUrl} target="_blank" rel="noreferrer">{publicLabel}</a></header>;
}

export function PublishingEditor({
  itemName,
  title,
  isEditing,
  status,
  onStatusChange,
  onNew,
  onSubmit,
  pending,
  children,
  preview,
}: {
  itemName: string;
  title: string;
  isEditing: boolean;
  status: PublishingStatus;
  onStatusChange: (status: PublishingStatus) => void;
  onNew: () => void;
  onSubmit: (event: React.FormEvent) => void;
  pending: boolean;
  children: React.ReactNode;
  preview: React.ReactNode;
}) {
  return <div className="admin-editor-grid"><form className="admin-form" onSubmit={onSubmit} noValidate><div className="admin-form-title"><div><p>{isEditing ? `Edit ${itemName}` : `New ${itemName}`}</p><h2>{title || `Add ${itemName}`}</h2></div>{isEditing ? <Button type="button" variant="outline" onClick={onNew}><Plus />New</Button> : null}</div><label><Label htmlFor={`${itemName}-status`}>Status</Label><select id={`${itemName}-status`} value={status} onChange={event => onStatusChange(event.target.value as PublishingStatus)}><option value="draft">Draft</option><option value="published">Published</option></select><small>Drafts stay private. Published items appear automatically on the public website.</small></label>{children}<div className="admin-form-actions"><Button type="submit" disabled={pending}>{pending ? <Loader2 className="animate-spin" /> : <CheckCircle2 />}{status === "published" ? `Publish ${itemName}` : `Save ${itemName} draft`}</Button><span>Review the public preview before publishing.</span></div></form><aside className="admin-preview" aria-label={`${itemName} public preview`}><p>Public preview</p>{preview}</aside></div>;
}

export function TraditionCheckboxes({ value, onChange, error, idPrefix }: { value: PublishingTradition[]; onChange: (value: PublishingTradition[]) => void; error?: string; idPrefix: string }) {
  const toggle = (tradition: PublishingTradition) => onChange(value.includes(tradition) ? value.filter(item => item !== tradition) : [...value, tradition]);
  return <fieldset className="admin-fieldset" aria-describedby={error ? `${idPrefix}-traditions-error` : undefined}><legend>Traditions</legend><div className="admin-tradition-options">{traditionOptions.map(tradition => <label key={tradition}><input type="checkbox" checked={value.includes(tradition)} onChange={() => toggle(tradition)} /><span>{tradition}</span></label>)}</div><FieldError id={`${idPrefix}-traditions-error`} message={error} /></fieldset>;
}

function readFileAsBase64(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result).split(",")[1] ?? "");
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

export function ImageUploadField({ selectedId, onSelect, images, label = "Photo or flyer" }: { selectedId: number | null; onSelect: (id: number | null) => void; images: Array<{ id: number; originalName: string }>; label?: string }) {
  const utils = trpc.useUtils();
  const [file, setFile] = useState<File | null>(null);
  const [altText, setAltText] = useState("");
  const [error, setError] = useState("");
  const upload = trpc.media.upload.useMutation({
    onSuccess: async result => {
      await utils.media.adminList.invalidate();
      onSelect(result.id);
      setFile(null);
      setAltText("");
      setError("");
      toast.success("Image uploaded and selected");
    },
    onError: uploadError => setError(uploadError.message),
  });
  const uploadFile = async () => {
    if (!file) return setError("Choose a JPEG, PNG, or WebP image.");
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) return setError("Choose a JPEG, PNG, or WebP image.");
    if (file.size > 10 * 1024 * 1024) return setError("Images must be 10 MB or smaller.");
    if (!altText.trim()) return setError("Describe the image for visitors using screen readers.");
    setError("");
    try {
      upload.mutate({ originalName: file.name, mimeType: file.type as "image/jpeg" | "image/png" | "image/webp", base64: await readFileAsBase64(file), altText: altText.trim(), caption: null });
    } catch {
      setError("The image could not be read. Please try another file.");
    }
  };
  return <fieldset className="admin-fieldset"><legend>{label}</legend><label><Label htmlFor={`${label}-existing`}>Choose an existing image</Label><select id={`${label}-existing`} value={selectedId ?? ""} onChange={event => onSelect(event.target.value ? Number(event.target.value) : null)}><option value="">No image</option>{images.map(image => <option key={image.id} value={image.id}>{image.originalName}</option>)}</select></label><div className="admin-inline-upload"><label><Label htmlFor={`${label}-file`}>Upload from this computer</Label><Input id={`${label}-file`} type="file" accept="image/jpeg,image/png,image/webp" onChange={event => { setFile(event.target.files?.[0] ?? null); setError(""); }} /></label><label><Label htmlFor={`${label}-alt`}>Image description</Label><Input id={`${label}-alt`} value={altText} onChange={event => setAltText(event.target.value)} placeholder="Describe who or what is shown" /></label><Button type="button" variant="outline" onClick={uploadFile} disabled={upload.isPending}>{upload.isPending ? <Loader2 className="animate-spin" /> : <UploadCloud />}Upload and use</Button></div>{error ? <p className="admin-field-error" role="alert">{error}</p> : null}</fieldset>;
}

export function PreviewImage({ asset }: { asset?: { url: string; altText: string | null; caption: string | null; originalName: string } | null }) {
  return asset ? <figure><img src={asset.url} alt={asset.altText ?? ""} />{asset.caption ? <figcaption>{asset.caption}</figcaption> : null}</figure> : <div className="admin-preview-placeholder"><ImageIcon /><span>No image selected</span></div>;
}

export function ManagedItemList<T extends { id: number; title: string; status: PublishingStatus }>({ title, itemName, items, isLoading, onEdit, onStatus, onDelete, details }: { title: string; itemName: string; items: T[]; isLoading: boolean; onEdit: (item: T) => void; onStatus: (item: T) => void; onDelete: (id: number) => void; details: (item: T) => React.ReactNode }) {
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const deleteTrigger = useRef<HTMLButtonElement | null>(null);
  return <><section className="admin-list" aria-labelledby={`${itemName}-list-title`}><div className="admin-section-title"><div><p>Managed records</p><h2 id={`${itemName}-list-title`}>{title}</h2></div><span>{items.length} items</span></div>{isLoading ? <div className="admin-loading"><Loader2 className="animate-spin" />Loading {itemName}</div> : items.length ? <div className="admin-entry-list">{items.map(item => <article key={item.id}><div><span className={`admin-status admin-status-${item.status}`}>{item.status}</span>{details(item)}<h3>{item.title}</h3></div><div className="admin-entry-actions"><Button variant="outline" onClick={() => onEdit(item)}><Pencil />Edit</Button><Button variant="outline" onClick={() => onStatus(item)}>{item.status === "published" ? "Unpublish" : "Publish"}</Button><Button variant="ghost" className="text-destructive" onClick={event => { deleteTrigger.current = event.currentTarget; setDeleteId(item.id); }}><Trash2 />Delete</Button></div></article>)}</div> : <div className="admin-empty"><FileTextIcon /><h3>No {itemName} yet</h3><p>Create the first draft with the form above. Nothing is published until you choose Published.</p></div>}</section><AlertDialog open={deleteId !== null} onOpenChange={open => !open && setDeleteId(null)}><AlertDialogContent onCloseAutoFocus={event => { event.preventDefault(); deleteTrigger.current?.focus(); }}><AlertDialogHeader><AlertDialogTitle>Delete this {itemName}?</AlertDialogTitle><AlertDialogDescription>This permanently removes the managed record. Uploaded images remain reusable.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={() => { if (deleteId) onDelete(deleteId); setDeleteId(null); }}>Delete {itemName}</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog></>;
}

function FileTextIcon() {
  return <FileText aria-hidden="true" />;
}
