import { useAuth } from "@/_core/hooks/useAuth";
import DashboardLayout from "@/components/DashboardLayout";
import { PageHero } from "@/components/site/PageHero";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MemberRoster } from "@/components/site/MemberRoster";
import { trpc } from "@/lib/trpc";
import { Building2, CheckCircle2, ExternalLink, Loader2, Mail, MapPin, Pencil, Plus, Search, Trash2 } from "lucide-react";
import React, { useRef, useState } from "react";
import { toast } from "sonner";

type TempleForm = {
  id?: number;
  name: string;
  slug: string;
  status: "draft" | "published";
  verificationStatus: "pending" | "verified";
  tradition: string;
  lineage: string;
  description: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  stateRegion: string;
  postalCode: string;
  country: string;
  websiteUrl: string;
  publicEmail: string;
  legacyUrl: string;
};

const emptyTemple: TempleForm = {
  name: "",
  slug: "",
  status: "draft",
  verificationStatus: "pending",
  tradition: "",
  lineage: "",
  description: "",
  addressLine1: "",
  addressLine2: "",
  city: "",
  stateRegion: "",
  postalCode: "",
  country: "United States",
  websiteUrl: "",
  publicEmail: "",
  legacyUrl: "",
};

function slugify(value: string) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function validateTemple(form: TempleForm) {
  const errors: Record<string, string> = {};
  if (form.name.trim().length < 2) errors.name = "Enter the community’s verified public name.";
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(form.slug)) errors.slug = "Use lowercase words separated by hyphens.";
  if (form.tradition && form.tradition.trim().length < 2) errors.tradition = "Enter a confirmed tradition label or leave blank.";
  if (form.description && form.description.trim().length < 20) errors.description = "Enter at least 20 characters or leave the description blank.";
  if (!form.city.trim() && !form.stateRegion.trim()) errors.city = "Enter the supplied city or state/region; do not invent missing location details.";
  if (form.status === "published" && form.verificationStatus !== "verified") errors.status = "Only verified records can be published.";
  for (const field of ["websiteUrl", "legacyUrl"] as const) {
    if (!form[field]) continue;
    try {
      const url = new URL(form[field]);
      if (url.protocol !== "https:") errors[field] = "Use a secure https:// URL.";
    } catch {
      errors[field] = "Enter a complete https:// URL.";
    }
  }
  if (form.publicEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.publicEmail)) errors.publicEmail = "Enter a complete public email address.";
  return errors;
}

function FieldError({ id, message }: { id: string; message?: string }) {
  return message ? <p id={id} className="admin-field-error" role="alert">{message}</p> : null;
}

export function TemplesPage() {
  return <><PageHero eyebrow="IBAA Members" title="Member Temples and Organizations" intro="Explore IBAA’s member temples and organizations, their supplied addresses and websites, with individual members listed separately." /><section className="site-container directory-section"><MemberRoster /></section></>;
}

export function AdminTemplesPage() {
  const { user } = useAuth();
  const utils = trpc.useUtils();
  const entries = trpc.temples.adminList.useQuery(undefined, { enabled: user?.role === "admin" });
  const [form, setForm] = useState<TempleForm>(emptyTemple);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const deleteTriggerRef = useRef<HTMLButtonElement | null>(null);

  const refresh = async () => {
    await utils.temples.adminList.invalidate();
    await utils.temples.listPublished.invalidate();
  };
  const save = trpc.temples.save.useMutation({
    onSuccess: async () => { toast.success(form.id ? "Community updated" : "Community created"); setForm(emptyTemple); setErrors({}); await refresh(); },
    onError: error => toast.error(error.message),
  });
  const status = trpc.temples.setStatus.useMutation({ onSuccess: async () => { toast.success("Directory status updated"); await refresh(); }, onError: error => toast.error(error.message) });
  const remove = trpc.temples.remove.useMutation({ onSuccess: async () => { toast.success("Community removed"); setDeleteId(null); await refresh(); }, onError: error => toast.error(error.message) });

  const edit = (entry: NonNullable<typeof entries.data>[number]) => {
    setForm({
      id: entry.id, name: entry.name, slug: entry.slug, status: entry.status, verificationStatus: entry.verificationStatus,
      tradition: entry.tradition, lineage: entry.lineage ?? "", description: entry.description, addressLine1: entry.addressLine1 ?? "",
      addressLine2: entry.addressLine2 ?? "", city: entry.city, stateRegion: entry.stateRegion, postalCode: entry.postalCode ?? "",
      country: entry.country, websiteUrl: entry.websiteUrl ?? "", publicEmail: entry.publicEmail ?? "", legacyUrl: entry.legacyUrl ?? "",
    });
    setErrors({});
    window.scrollTo({ top: 0, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  };
  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    const nextErrors = validateTemple(form);
    setErrors(nextErrors);
    const firstError = Object.keys(nextErrors)[0];
    if (firstError) { document.getElementById(`temple-${firstError}`)?.focus(); return; }
    save.mutate(form);
  };

  return <DashboardLayout><div className="admin-page">
    <header className="admin-header"><div><p>Directory governance</p><h1>Member temples</h1><span>Create, verify, and publish formal roster records independently from the provisional Study Circle archive.</span></div><a href="/member-temples" target="_blank" rel="noreferrer">View public directory</a></header>
    {entries.isError ? <div className="admin-query-error" role="alert"><strong>Temple records could not be loaded.</strong><span>{entries.error.message}</span><Button variant="outline" onClick={() => void entries.refetch()}>Try again</Button></div> : null}
    <div className="admin-editor-grid">
      <form className="admin-form" onSubmit={submit} noValidate>
        <div className="admin-form-title"><div><p>{form.id ? "Edit record" : "New record"}</p><h2>{form.name || "Add a community"}</h2></div>{form.id ? <Button type="button" variant="outline" onClick={() => { setForm(emptyTemple); setErrors({}); }}><Plus />New</Button> : null}</div>
        <div className="admin-two-columns"><label><Label htmlFor="temple-status">Publication</Label><select id="temple-status" value={form.status} onChange={event => setForm(current => ({ ...current, status: event.target.value as TempleForm["status"] }))} aria-invalid={Boolean(errors.status)} aria-describedby={errors.status ? "temple-status-error" : undefined}><option value="draft">Draft</option><option value="published">Published</option></select><FieldError id="temple-status-error" message={errors.status} /></label><label><Label htmlFor="temple-verificationStatus">Verification</Label><select id="temple-verificationStatus" value={form.verificationStatus} onChange={event => setForm(current => ({ ...current, verificationStatus: event.target.value as TempleForm["verificationStatus"], status: event.target.value === "pending" ? "draft" : current.status }))}><option value="pending">Pending review</option><option value="verified">Verified</option></select></label></div>
        <label><Label htmlFor="temple-name">Verified public name</Label><Input id="temple-name" value={form.name} onChange={event => setForm(current => ({ ...current, name: event.target.value, slug: current.id ? current.slug : slugify(event.target.value) }))} aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? "temple-name-error" : undefined} /><FieldError id="temple-name-error" message={errors.name} /></label>
        <label><Label htmlFor="temple-slug">Directory slug</Label><Input id="temple-slug" value={form.slug} onChange={event => setForm(current => ({ ...current, slug: slugify(event.target.value) }))} aria-invalid={Boolean(errors.slug)} aria-describedby={errors.slug ? "temple-slug-error" : undefined} /><FieldError id="temple-slug-error" message={errors.slug} /></label>
        <div className="admin-two-columns"><label><Label htmlFor="temple-tradition">Confirmed tradition label (optional)</Label><Input id="temple-tradition" value={form.tradition} onChange={event => setForm(current => ({ ...current, tradition: event.target.value }))} aria-invalid={Boolean(errors.tradition)} aria-describedby={errors.tradition ? "temple-tradition-error" : undefined} /><FieldError id="temple-tradition-error" message={errors.tradition} /></label><label><Label htmlFor="temple-lineage">Lineage or community context</Label><Input id="temple-lineage" value={form.lineage} onChange={event => setForm(current => ({ ...current, lineage: event.target.value }))} /></label></div>
        <label><Label htmlFor="temple-description">Public description (optional)</Label><Textarea id="temple-description" rows={5} value={form.description} onChange={event => setForm(current => ({ ...current, description: event.target.value }))} aria-invalid={Boolean(errors.description)} aria-describedby={errors.description ? "temple-description-error" : undefined} /><FieldError id="temple-description-error" message={errors.description} /></label>
        <div className="admin-two-columns"><label><Label htmlFor="temple-city">City (if supplied)</Label><Input id="temple-city" value={form.city} onChange={event => setForm(current => ({ ...current, city: event.target.value }))} aria-invalid={Boolean(errors.city)} aria-describedby={errors.city ? "temple-city-error" : undefined} /><FieldError id="temple-city-error" message={errors.city} /></label><label><Label htmlFor="temple-stateRegion">State or region (if supplied)</Label><Input id="temple-stateRegion" value={form.stateRegion} onChange={event => setForm(current => ({ ...current, stateRegion: event.target.value }))} aria-invalid={Boolean(errors.stateRegion)} aria-describedby={errors.stateRegion ? "temple-stateRegion-error" : undefined} /><FieldError id="temple-stateRegion-error" message={errors.stateRegion} /></label></div>
        <div className="admin-two-columns"><label><Label htmlFor="temple-addressLine1">Street address</Label><Input id="temple-addressLine1" value={form.addressLine1} onChange={event => setForm(current => ({ ...current, addressLine1: event.target.value }))} /></label><label><Label htmlFor="temple-addressLine2">Address line 2</Label><Input id="temple-addressLine2" value={form.addressLine2} onChange={event => setForm(current => ({ ...current, addressLine2: event.target.value }))} /></label></div>
        <div className="admin-two-columns"><label><Label htmlFor="temple-postalCode">Postal code</Label><Input id="temple-postalCode" value={form.postalCode} onChange={event => setForm(current => ({ ...current, postalCode: event.target.value }))} /></label><label><Label htmlFor="temple-country">Country</Label><Input id="temple-country" value={form.country} onChange={event => setForm(current => ({ ...current, country: event.target.value }))} /></label></div>
        <label><Label htmlFor="temple-websiteUrl">Website</Label><Input id="temple-websiteUrl" type="url" value={form.websiteUrl} onChange={event => setForm(current => ({ ...current, websiteUrl: event.target.value }))} aria-invalid={Boolean(errors.websiteUrl)} aria-describedby={errors.websiteUrl ? "temple-websiteUrl-error" : undefined} /><FieldError id="temple-websiteUrl-error" message={errors.websiteUrl} /></label>
        <label><Label htmlFor="temple-publicEmail">Public email</Label><Input id="temple-publicEmail" type="email" value={form.publicEmail} onChange={event => setForm(current => ({ ...current, publicEmail: event.target.value }))} aria-invalid={Boolean(errors.publicEmail)} aria-describedby={errors.publicEmail ? "temple-publicEmail-error" : undefined} /><FieldError id="temple-publicEmail-error" message={errors.publicEmail} /></label>
        <label><Label htmlFor="temple-legacyUrl">Legacy source URL</Label><Input id="temple-legacyUrl" type="url" value={form.legacyUrl} onChange={event => setForm(current => ({ ...current, legacyUrl: event.target.value }))} aria-invalid={Boolean(errors.legacyUrl)} aria-describedby={errors.legacyUrl ? "temple-legacyUrl-error" : undefined} /><FieldError id="temple-legacyUrl-error" message={errors.legacyUrl} /></label>
        <div className="admin-form-actions"><Button type="submit" disabled={save.isPending}>{save.isPending ? <Loader2 className="animate-spin" /> : <CheckCircle2 />}{form.id ? "Save record" : "Create record"}</Button><span>Publishing is blocked until the record is verified.</span></div>
      </form>
      <aside className="admin-preview" aria-labelledby="temple-preview-title"><p>Directory preview</p><h2 id="temple-preview-title">{form.name || "Community name"}</h2><div className="admin-preview-meta">{form.tradition || "Tradition pending"}{form.lineage ? ` · ${form.lineage}` : ""}</div><div className="admin-preview-placeholder"><Building2 /><span>{form.city || "City"}, {form.stateRegion || "State or region"}</span></div><p className="admin-preview-excerpt">{form.description || "The verified public description will appear here."}</p><p><strong>{form.verificationStatus === "verified" ? "Verified" : "Pending verification"}</strong> · {form.status}</p></aside>
    </div>
    <section className="admin-list" aria-labelledby="temple-records-title"><div className="admin-section-title"><div><p>Formal roster</p><h2 id="temple-records-title">Managed community records</h2></div><span>{entries.data?.length ?? 0} records</span></div>{entries.isLoading ? <div className="admin-loading"><Loader2 className="animate-spin" />Loading records</div> : entries.data?.length ? <div className="admin-entry-list">{entries.data.map(entry => <article key={entry.id}><div><span className={`admin-status admin-status-${entry.status}`}>{entry.status}</span><p>{entry.verificationStatus} · {entry.tradition}</p><h3>{entry.name}</h3><small>{entry.city}, {entry.stateRegion} · Updated {new Date(entry.updatedAt).toLocaleString()}</small></div><div className="admin-entry-actions"><Button variant="outline" onClick={() => edit(entry)}><Pencil />Edit</Button><Button variant="outline" disabled={entry.verificationStatus !== "verified" && entry.status !== "published"} onClick={() => status.mutate({ id: entry.id, status: entry.status === "published" ? "draft" : "published" })}>{entry.status === "published" ? "Unpublish" : "Publish"}</Button><Button variant="ghost" className="text-destructive" onClick={event => { deleteTriggerRef.current = event.currentTarget; setDeleteId(entry.id); }}><Trash2 />Delete</Button></div></article>)}</div> : <div className="admin-empty"><Building2 /><h3>No formal roster records yet</h3><p>Publish verified IBAA member records here. Study Circle hosts are kept separate and do not automatically become members.</p></div>}</section>
    <AlertDialog open={deleteId !== null} onOpenChange={open => !open && setDeleteId(null)}><AlertDialogContent onCloseAutoFocus={event => { event.preventDefault(); deleteTriggerRef.current?.focus(); }}><AlertDialogHeader><AlertDialogTitle>Delete this community record?</AlertDialogTitle><AlertDialogDescription>This permanently removes the managed directory record. The provisional Study Circle archive remains unchanged.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={() => deleteId && remove.mutate({ id: deleteId })}>Delete record</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog>
  </div></DashboardLayout>;
}
