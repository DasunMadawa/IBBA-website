import { useAuth } from "@/_core/hooks/useAuth";
import DashboardLayout from "@/components/DashboardLayout";
import { TraditionTag } from "@/components/site/ContentPrimitives";
import { PageHero } from "@/components/site/PageHero";
import { SecureYouTubeEmbed } from "@/components/site/SecureYouTubeEmbed";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";
import { BookOpenText, CalendarDays, CheckCircle2, ExternalLink, Image as ImageIcon, Loader2, MapPin, Pencil, Plus, Trash2, Video } from "lucide-react";
import React, { useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { Link } from "wouter";

type Tradition = "Theravada" | "Mahayana" | "Vajrayana";
type MinutesForm = {
  id?: number;
  slug: string;
  title: string;
  meetingDate: string;
  hostTemple: string;
  locationLabel: string;
  city: string;
  stateRegion: string;
  summary: string;
  minutesBody: string;
  status: "draft" | "published";
  traditions: Tradition[];
  youtubeUrl: string;
  youtubeTitle: string;
  photoMediaId: number | null;
  legacyUrl: string;
};

const traditionOptions: Tradition[] = ["Theravada", "Mahayana", "Vajrayana"];
const emptyMinutes = (): MinutesForm => ({
  slug: "",
  title: "",
  meetingDate: new Date().toISOString().slice(0, 10),
  hostTemple: "",
  locationLabel: "",
  city: "",
  stateRegion: "",
  summary: "",
  minutesBody: "",
  status: "draft",
  traditions: [],
  youtubeUrl: "",
  youtubeTitle: "",
  photoMediaId: null,
  legacyUrl: "",
});

function slugify(value: string) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function toMeetingTimestamp(value: string) {
  return new Date(`${value}T12:00:00.000Z`).getTime();
}

function toDateInput(value: number) {
  return new Date(value).toISOString().slice(0, 10);
}

function formatMeetingDate(value: number) {
  return new Intl.DateTimeFormat(undefined, { dateStyle: "long", timeZone: "UTC" }).format(new Date(value));
}

function validateMinutes(form: MinutesForm) {
  const errors: Record<string, string> = {};
  if (form.title.trim().length < 3) errors.title = "Enter a clear Meeting Minutes title.";
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(form.slug)) errors.slug = "Use lowercase words separated by hyphens.";
  if (!form.meetingDate) errors.meetingDate = "Choose the meeting date.";
  if (form.hostTemple.trim().length < 2) errors.hostTemple = "Enter the host temple or community.";
  if (form.locationLabel.trim().length < 2) errors.locationLabel = "Enter the meeting location.";
  if (form.summary.trim().length < 20) errors.summary = "Add a short summary of at least 20 characters.";
  if (form.minutesBody.trim().length < 20) errors.minutesBody = "Add the written Meeting Minutes as the primary record.";
  if (!form.traditions.length) errors.traditions = "Select at least one tradition represented.";
  if (form.youtubeUrl && !form.youtubeTitle.trim()) errors.youtubeTitle = "Add an accessible title for the optional recording.";
  return errors;
}

function FieldError({ id, message }: { id: string; message?: string }) {
  return message ? <p id={id} className="admin-field-error" role="alert">{message}</p> : null;
}

function MinutesCard({ entry, compact = false }: { entry: any; compact?: boolean }) {
  return <article className={compact ? "minutes-card is-compact" : "minutes-card"}>
    <div className="minutes-date"><CalendarDays aria-hidden="true" /><time dateTime={toDateInput(entry.meetingDate)}>{formatMeetingDate(entry.meetingDate)}</time></div>
    <div className="minutes-card-main">
      <div className="minutes-tags">{entry.traditions.map((tradition: Tradition) => <TraditionTag key={tradition} tradition={tradition} />)}</div>
      <h2>{entry.title}</h2>
      <p className="minutes-location"><MapPin aria-hidden="true" />{entry.hostTemple} · {entry.locationLabel}</p>
      <p>{entry.summary}</p>
      {!compact ? <div className="minutes-written"><h3>Meeting Minutes</h3><div>{entry.minutesBody}</div></div> : null}
      {compact ? <Link className="text-link" href="/study-circles">Read the written minutes <ExternalLink aria-hidden="true" /></Link> : null}
    </div>
    {!compact && (entry.photo || entry.youtubeUrl) ? <aside className="minutes-media">
      {entry.photo ? <figure><img src={entry.photo.url} alt={entry.photo.altText || ""} />{entry.photo.caption ? <figcaption>{entry.photo.caption}</figcaption> : null}</figure> : null}
      {entry.youtubeUrl && entry.youtubeTitle ? <SecureYouTubeEmbed url={entry.youtubeUrl} title={entry.youtubeTitle} /> : null}
    </aside> : null}
  </article>;
}

export function RecentMeetingMinutes({ heading = "Recent Meeting Minutes", limit = 3 }: { heading?: string; limit?: number }) {
  const recent = trpc.meetingMinutes.listRecent.useQuery({ limit });
  return <section className="recent-minutes" aria-labelledby="recent-minutes-title">
    <div className="section-heading with-link"><div><p className="eyebrow">Written record</p><h2 id="recent-minutes-title">{heading}</h2></div><Link className="text-link" href="/study-circles">View all minutes <ExternalLink aria-hidden="true" /></Link></div>
    {recent.isLoading ? <div className="minutes-status" role="status"><Loader2 className="animate-spin" />Loading Meeting Minutes</div> : null}
    {recent.isError ? <div className="admin-query-error" role="alert"><strong>Meeting Minutes could not be loaded.</strong><Button variant="outline" onClick={() => void recent.refetch()}>Try again</Button></div> : null}
    {recent.data?.length ? <div className="recent-minutes-grid">{recent.data.map(entry => <MinutesCard key={entry.id} entry={entry} compact />)}</div> : !recent.isLoading && !recent.isError ? <div className="minutes-empty"><BookOpenText aria-hidden="true" /><div><h3>No managed Meeting Minutes are published yet</h3><p>Written minutes will appear here after an authorized IBAA editor publishes the first verified record.</p></div></div> : null}
  </section>;
}

export function MeetingMinutesPage() {
  const entries = trpc.meetingMinutes.listPublished.useQuery();
  return <><PageHero eyebrow="Dharma Meeting Minutes" title="A written record of learning together" intro="Monthly multi-tradition Dharma Meeting Minutes, ordered newest first, with optional recordings and group photography as supplements." /><section className="site-container minutes-archive">
    <div className="notice-panel compact"><p><strong>Written records first:</strong> Each published entry centers the meeting date, host, traditions represented, summary, and written minutes. Video and photography are included only when an authorized editor adds them.</p></div>
    {entries.isLoading ? <div className="minutes-status" role="status"><Loader2 className="animate-spin" />Loading Meeting Minutes</div> : null}
    {entries.isError ? <div className="admin-query-error" role="alert"><strong>The Meeting Minutes archive could not be loaded.</strong><span>{entries.error.message}</span><Button variant="outline" onClick={() => void entries.refetch()}>Try again</Button></div> : null}
    {entries.data?.length ? <div className="minutes-list">{entries.data.map(entry => <MinutesCard key={entry.id} entry={entry} />)}</div> : !entries.isLoading && !entries.isError ? <div className="minutes-empty is-large"><BookOpenText aria-hidden="true" /><div><h2>No managed Meeting Minutes are published yet</h2><p>The archive is ready for an authorized IBAA editor to publish the first written record. No meeting summary or recording has been fabricated for this empty state.</p></div></div> : null}
  </section></>;
}

export function AdminMeetingMinutesPage() {
  const { user } = useAuth();
  const utils = trpc.useUtils();
  const entries = trpc.meetingMinutes.adminList.useQuery(undefined, { enabled: user?.role === "admin" });
  const media = trpc.media.adminList.useQuery(undefined, { enabled: user?.role === "admin" });
  const [form, setForm] = useState<MinutesForm>(() => emptyMinutes());
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const deleteTriggerRef = useRef<HTMLButtonElement | null>(null);
  const images = useMemo(() => (media.data ?? []).filter(asset => asset.mediaKind === "image"), [media.data]);
  const selectedPhoto = images.find(asset => asset.id === form.photoMediaId) ?? null;

  const refresh = async () => {
    await utils.meetingMinutes.adminList.invalidate();
    await utils.meetingMinutes.listPublished.invalidate();
    await utils.meetingMinutes.listRecent.invalidate();
  };
  const save = trpc.meetingMinutes.save.useMutation({ onSuccess: async () => { toast.success(form.id ? "Meeting Minutes updated" : "Meeting Minutes created"); setForm(emptyMinutes()); setErrors({}); await refresh(); }, onError: error => toast.error(error.message) });
  const status = trpc.meetingMinutes.setStatus.useMutation({ onSuccess: async () => { toast.success("Meeting Minutes status updated"); await refresh(); }, onError: error => toast.error(error.message) });
  const remove = trpc.meetingMinutes.remove.useMutation({ onSuccess: async () => { toast.success("Meeting Minutes removed"); setDeleteId(null); await refresh(); }, onError: error => toast.error(error.message) });

  const edit = (entry: NonNullable<typeof entries.data>[number]) => {
    setForm({ id: entry.id, slug: entry.slug, title: entry.title, meetingDate: toDateInput(entry.meetingDate), hostTemple: entry.hostTemple, locationLabel: entry.locationLabel, city: entry.city ?? "", stateRegion: entry.stateRegion ?? "", summary: entry.summary, minutesBody: entry.minutesBody, status: entry.status, traditions: [...entry.traditions], youtubeUrl: entry.youtubeUrl ?? "", youtubeTitle: entry.youtubeTitle ?? "", photoMediaId: entry.photoMediaId ?? null, legacyUrl: entry.legacyUrl ?? "" });
    setErrors({});
    window.scrollTo({ top: 0, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  };
  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    const nextErrors = validateMinutes(form);
    setErrors(nextErrors);
    const first = Object.keys(nextErrors)[0];
    if (first) { document.getElementById(`minutes-${first}`)?.focus(); return; }
    save.mutate({ ...form, meetingDate: toMeetingTimestamp(form.meetingDate) });
  };
  const toggleTradition = (tradition: Tradition) => setForm(current => ({ ...current, traditions: current.traditions.includes(tradition) ? current.traditions.filter(item => item !== tradition) : [...current.traditions, tradition] }));

  return <DashboardLayout><div className="admin-page">
    <header className="admin-header"><div><p>Study Circle archive</p><h1>Meeting Minutes</h1><span>Publish clear written records first, with optional video and photography as supplements.</span></div><a href="/study-circles" target="_blank" rel="noreferrer">View public archive</a></header>
    {(entries.isError || media.isError) ? <div className="admin-query-error" role="alert"><strong>The Meeting Minutes editor could not load all required data.</strong><span>{entries.error?.message || media.error?.message}</span><Button variant="outline" onClick={() => { void entries.refetch(); void media.refetch(); }}>Try again</Button></div> : null}
    <div className="admin-editor-grid">
      <form className="admin-form" onSubmit={submit} noValidate>
        <div className="admin-form-title"><div><p>{form.id ? "Edit record" : "New written record"}</p><h2>{form.title || "Add Meeting Minutes"}</h2></div>{form.id ? <Button type="button" variant="outline" onClick={() => { setForm(emptyMinutes()); setErrors({}); }}><Plus />New</Button> : null}</div>
        <div className="admin-two-columns"><label><Label htmlFor="minutes-status">Publication</Label><select id="minutes-status" value={form.status} onChange={event => setForm(current => ({ ...current, status: event.target.value as MinutesForm["status"] }))}><option value="draft">Draft</option><option value="published">Published</option></select></label><label><Label htmlFor="minutes-meetingDate">Meeting date</Label><Input id="minutes-meetingDate" type="date" value={form.meetingDate} onChange={event => setForm(current => ({ ...current, meetingDate: event.target.value }))} aria-invalid={Boolean(errors.meetingDate)} aria-describedby={errors.meetingDate ? "minutes-meetingDate-error" : undefined} /><FieldError id="minutes-meetingDate-error" message={errors.meetingDate} /></label></div>
        <label><Label htmlFor="minutes-title">Title</Label><Input id="minutes-title" value={form.title} onChange={event => setForm(current => ({ ...current, title: event.target.value, slug: current.id ? current.slug : slugify(event.target.value) }))} aria-invalid={Boolean(errors.title)} aria-describedby={errors.title ? "minutes-title-error" : undefined} /><FieldError id="minutes-title-error" message={errors.title} /></label>
        <label><Label htmlFor="minutes-slug">Archive slug</Label><Input id="minutes-slug" value={form.slug} onChange={event => setForm(current => ({ ...current, slug: slugify(event.target.value) }))} aria-invalid={Boolean(errors.slug)} aria-describedby={errors.slug ? "minutes-slug-error" : undefined} /><FieldError id="minutes-slug-error" message={errors.slug} /></label>
        <div className="admin-two-columns"><label><Label htmlFor="minutes-hostTemple">Host temple / community</Label><Input id="minutes-hostTemple" value={form.hostTemple} onChange={event => setForm(current => ({ ...current, hostTemple: event.target.value }))} aria-invalid={Boolean(errors.hostTemple)} aria-describedby={errors.hostTemple ? "minutes-hostTemple-error" : undefined} /><FieldError id="minutes-hostTemple-error" message={errors.hostTemple} /></label><label><Label htmlFor="minutes-locationLabel">Location</Label><Input id="minutes-locationLabel" value={form.locationLabel} onChange={event => setForm(current => ({ ...current, locationLabel: event.target.value }))} aria-invalid={Boolean(errors.locationLabel)} aria-describedby={errors.locationLabel ? "minutes-locationLabel-error" : undefined} /><FieldError id="minutes-locationLabel-error" message={errors.locationLabel} /></label></div>
        <div className="admin-two-columns"><label><Label htmlFor="minutes-city">City</Label><Input id="minutes-city" value={form.city} onChange={event => setForm(current => ({ ...current, city: event.target.value }))} /></label><label><Label htmlFor="minutes-stateRegion">State / region</Label><Input id="minutes-stateRegion" value={form.stateRegion} onChange={event => setForm(current => ({ ...current, stateRegion: event.target.value }))} /></label></div>
        <fieldset className="admin-fieldset" aria-describedby={errors.traditions ? "minutes-traditions-error" : undefined}><legend>Traditions represented</legend><div className="admin-tradition-options">{traditionOptions.map(tradition => <label key={tradition}><input type="checkbox" checked={form.traditions.includes(tradition)} onChange={() => toggleTradition(tradition)} /><span>{tradition}</span></label>)}</div><FieldError id="minutes-traditions-error" message={errors.traditions} /></fieldset>
        <label><Label htmlFor="minutes-summary">Short summary / key points</Label><Textarea id="minutes-summary" rows={4} value={form.summary} onChange={event => setForm(current => ({ ...current, summary: event.target.value }))} aria-invalid={Boolean(errors.summary)} aria-describedby={errors.summary ? "minutes-summary-error" : undefined} /><FieldError id="minutes-summary-error" message={errors.summary} /></label>
        <label><Label htmlFor="minutes-minutesBody">Written Meeting Minutes</Label><Textarea id="minutes-minutesBody" rows={12} value={form.minutesBody} onChange={event => setForm(current => ({ ...current, minutesBody: event.target.value }))} aria-invalid={Boolean(errors.minutesBody)} aria-describedby={errors.minutesBody ? "minutes-minutesBody-error" : undefined} /><FieldError id="minutes-minutesBody-error" message={errors.minutesBody} /></label>
        <div className="admin-two-columns"><label><Label htmlFor="minutes-youtubeUrl">Optional YouTube link</Label><Input id="minutes-youtubeUrl" type="url" value={form.youtubeUrl} onChange={event => setForm(current => ({ ...current, youtubeUrl: event.target.value }))} /></label><label><Label htmlFor="minutes-youtubeTitle">Accessible video title</Label><Input id="minutes-youtubeTitle" value={form.youtubeTitle} onChange={event => setForm(current => ({ ...current, youtubeTitle: event.target.value }))} aria-invalid={Boolean(errors.youtubeTitle)} aria-describedby={errors.youtubeTitle ? "minutes-youtubeTitle-error" : undefined} /><FieldError id="minutes-youtubeTitle-error" message={errors.youtubeTitle} /></label></div>
        <label><Label htmlFor="minutes-photoMediaId">Optional group photo</Label><select id="minutes-photoMediaId" value={form.photoMediaId ?? ""} onChange={event => setForm(current => ({ ...current, photoMediaId: event.target.value ? Number(event.target.value) : null }))}><option value="">No photo</option>{images.map(asset => <option key={asset.id} value={asset.id}>{asset.originalName}</option>)}</select><small>Need a new image? <Link href="/admin/media">Upload it in Media library</Link>, then return to select it here.</small></label>
        <label><Label htmlFor="minutes-legacyUrl">Optional legacy source URL</Label><Input id="minutes-legacyUrl" type="url" value={form.legacyUrl} onChange={event => setForm(current => ({ ...current, legacyUrl: event.target.value }))} /></label>
        <div className="admin-form-actions"><Button type="submit" disabled={save.isPending}>{save.isPending ? <Loader2 className="animate-spin" /> : <CheckCircle2 />}{form.id ? "Save Meeting Minutes" : "Create Meeting Minutes"}</Button><span>Written minutes are required; video and photography are optional.</span></div>
      </form>
      <aside className="admin-preview" aria-labelledby="minutes-preview-title"><p>Public preview</p><h2 id="minutes-preview-title">{form.title || "Meeting Minutes title"}</h2><div className="admin-preview-meta">{form.meetingDate ? formatMeetingDate(toMeetingTimestamp(form.meetingDate)) : "Meeting date"} · {form.status}</div><div className="minutes-tags">{form.traditions.map(tradition => <TraditionTag key={tradition} tradition={tradition} />)}</div>{selectedPhoto ? <figure><img src={selectedPhoto.url} alt={selectedPhoto.altText || ""} /><figcaption>{selectedPhoto.caption || selectedPhoto.originalName}</figcaption></figure> : <div className="admin-preview-placeholder"><ImageIcon /><span>Optional group photo</span></div>}<p><strong>{form.hostTemple || "Host temple"}</strong> · {form.locationLabel || "Location"}</p><p className="admin-preview-excerpt">{form.summary || "The short written summary will appear here."}</p>{form.youtubeUrl && form.youtubeTitle ? <SecureYouTubeEmbed url={form.youtubeUrl} title={form.youtubeTitle} /> : <div className="minutes-video-placeholder"><Video /><span>Optional recording</span></div>}</aside>
    </div>
    <section className="admin-list" aria-labelledby="minutes-records-title"><div className="admin-section-title"><div><p>Archive records</p><h2 id="minutes-records-title">Managed Meeting Minutes</h2></div><span>{entries.data?.length ?? 0} records</span></div>{entries.isLoading ? <div className="admin-loading"><Loader2 className="animate-spin" />Loading Meeting Minutes</div> : entries.data?.length ? <div className="admin-entry-list">{entries.data.map(entry => <article key={entry.id}><div><span className={`admin-status admin-status-${entry.status}`}>{entry.status}</span><p>{formatMeetingDate(entry.meetingDate)} · {entry.traditions.join(" / ")}</p><h3>{entry.title}</h3><small>{entry.hostTemple} · {entry.locationLabel}</small></div><div className="admin-entry-actions"><Button variant="outline" onClick={() => edit(entry)}><Pencil />Edit</Button><Button variant="outline" onClick={() => status.mutate({ id: entry.id, status: entry.status === "published" ? "draft" : "published" })}>{entry.status === "published" ? "Unpublish" : "Publish"}</Button><Button variant="ghost" className="text-destructive" onClick={event => { deleteTriggerRef.current = event.currentTarget; setDeleteId(entry.id); }}><Trash2 />Delete</Button></div></article>)}</div> : <div className="admin-empty"><BookOpenText /><h3>No Meeting Minutes yet</h3><p>Create the first written record without adding placeholder summaries or recordings.</p></div>}</section>
    <AlertDialog open={deleteId !== null} onOpenChange={open => !open && setDeleteId(null)}><AlertDialogContent onCloseAutoFocus={event => { event.preventDefault(); deleteTriggerRef.current?.focus(); }}><AlertDialogHeader><AlertDialogTitle>Delete these Meeting Minutes?</AlertDialogTitle><AlertDialogDescription>This permanently removes the managed written record. Reusable uploaded photography remains in the Media library.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={() => deleteId && remove.mutate({ id: deleteId })}>Delete Meeting Minutes</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog>
  </div></DashboardLayout>;
}
