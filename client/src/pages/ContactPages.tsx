import { useAuth } from "@/_core/hooks/useAuth";
import DashboardLayout from "@/components/DashboardLayout";
import { PageHero } from "@/components/site/PageHero";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";
import { Archive, CheckCircle2, Inbox, Loader2, Mail, Send } from "lucide-react";
import React, { useMemo, useState } from "react";
import { toast } from "sonner";
import { Link } from "wouter";

type InquiryForm = { name: string; email: string; organization: string; topic: "general" | "programs" | "community" | "archive" | "partnership"; message: string; website: string };
const emptyInquiry: InquiryForm = { name: "", email: "", organization: "", topic: "general", message: "", website: "" };

function validateInquiry(form: InquiryForm) {
  const errors: Record<string, string> = {};
  if (form.name.trim().length < 2) errors.name = "Enter your name.";
  if (!/^\S+@\S+\.\S+$/.test(form.email)) errors.email = "Enter a valid email address.";
  if (form.message.trim().length < 20) errors.message = "Please provide at least 20 characters so IBAA can understand the inquiry.";
  return errors;
}

function FieldError({ id, message }: { id: string; message?: string }) {
  return message ? <p id={id} className="admin-field-error" role="alert">{message}</p> : null;
}

export function ContactPage() {
  const [form, setForm] = useState<InquiryForm>(emptyInquiry);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [reference, setReference] = useState<string | null>(null);
  const submit = trpc.contact.submit.useMutation({
    onSuccess: result => { setReference(result.reference); setForm(emptyInquiry); setErrors({}); },
    onError: error => toast.error(error.message),
  });
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const nextErrors = validateInquiry(form);
    setErrors(nextErrors);
    const first = Object.keys(nextErrors)[0];
    if (first) { document.getElementById(`contact-${first}`)?.focus(); return; }
    submit.mutate(form);
  };

  return <><PageHero eyebrow="Contact" title="Begin a conversation" intro="Connect with IBAA about programs, community participation, archival information, or organizational collaboration." /><section className="site-container contact-page">
    <div className="contact-side">
      <article><p className="eyebrow">Study Circles</p><h2>Program inquiries</h2><p>For interest in attending or hosting a Dharma Study Circle:</p><a href="mailto:dharmastudy@ibaa.org">dharmastudy@ibaa.org</a></article>
      <article><p className="eyebrow">General inquiry</p><h2>A safe path without invented contact details</h2><p>The form is delivered to an administrator-only inquiry queue. IBAA has not yet confirmed a separate public general email or telephone number for the rebuilt site.</p><p>Do not submit passwords, financial information, medical information, or other sensitive personal data.</p></article>
    </div>
    <div className="contact-form-panel">
      {reference ? <div className="contact-confirmation" role="status"><CheckCircle2 /><div><h2>Inquiry received</h2><p>Your reference is <strong>{reference}</strong>. An authorized IBAA administrator can review the message in the private inquiry queue.</p><Button type="button" variant="outline" onClick={() => setReference(null)}>Send another inquiry</Button></div></div> : <form className="contact-form" onSubmit={handleSubmit} noValidate>
        <div><p className="eyebrow">General contact form</p><h2>Send an inquiry</h2><p>All fields marked required must be completed.</p></div>
        <div className="contact-form-grid"><label><Label htmlFor="contact-name">Name *</Label><Input id="contact-name" autoComplete="name" value={form.name} onChange={event => setForm(current => ({ ...current, name: event.target.value }))} aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? "contact-name-error" : undefined} /><FieldError id="contact-name-error" message={errors.name} /></label><label><Label htmlFor="contact-email">Email *</Label><Input id="contact-email" type="email" autoComplete="email" value={form.email} onChange={event => setForm(current => ({ ...current, email: event.target.value }))} aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? "contact-email-error" : undefined} /><FieldError id="contact-email-error" message={errors.email} /></label></div>
        <label><Label htmlFor="contact-organization">Organization (optional)</Label><Input id="contact-organization" autoComplete="organization" value={form.organization} onChange={event => setForm(current => ({ ...current, organization: event.target.value }))} /></label>
        <label><Label htmlFor="contact-topic">Topic</Label><select id="contact-topic" value={form.topic} onChange={event => setForm(current => ({ ...current, topic: event.target.value as InquiryForm["topic"] }))}><option value="general">General</option><option value="programs">Programs and Study Circles</option><option value="community">Community or member temple</option><option value="archive">Archive or historical record</option><option value="partnership">Partnership or public engagement</option></select></label>
        <label><Label htmlFor="contact-message">Message *</Label><Textarea id="contact-message" rows={8} value={form.message} onChange={event => setForm(current => ({ ...current, message: event.target.value }))} aria-invalid={Boolean(errors.message)} aria-describedby={errors.message ? "contact-message-error" : undefined} /><FieldError id="contact-message-error" message={errors.message} /></label>
        <label className="contact-honeypot" aria-hidden="true">Leave this field empty<Input tabIndex={-1} autoComplete="off" value={form.website} onChange={event => setForm(current => ({ ...current, website: event.target.value }))} /></label>
        <p className="contact-privacy">IBAA will use the submitted name and email to review and respond to this inquiry. The message is not published. See the <Link href="/privacy">privacy notice</Link>; policy language remains subject to IBAA approval before launch.</p>
        <Button type="submit" disabled={submit.isPending}>{submit.isPending ? <Loader2 className="animate-spin" /> : <Send />}Send inquiry</Button>
      </form>}
    </div>
  </section></>;
}

export function AdminInquiriesPage() {
  const { user } = useAuth();
  const utils = trpc.useUtils();
  const inquiries = trpc.contact.adminList.useQuery(undefined, { enabled: user?.role === "admin" });
  const [filter, setFilter] = useState<"all" | "new" | "read" | "archived">("all");
  const status = trpc.contact.setStatus.useMutation({ onSuccess: async () => { toast.success("Inquiry status updated"); await utils.contact.adminList.invalidate(); }, onError: error => toast.error(error.message) });
  const filtered = useMemo(() => (inquiries.data ?? []).filter(item => filter === "all" || item.status === filter), [filter, inquiries.data]);

  return <DashboardLayout><div className="admin-page">
    <header className="admin-header"><div><p>Private correspondence</p><h1>Contact inquiries</h1><span>Review general public submissions without exposing email addresses on the public website.</span></div><a href="/contact" target="_blank" rel="noreferrer">View contact form</a></header>
    {inquiries.isError ? <div className="admin-query-error" role="alert"><strong>Contact inquiries could not be loaded.</strong><span>{inquiries.error.message}</span><Button variant="outline" onClick={() => void inquiries.refetch()}>Try again</Button></div> : null}
    <div className="inquiry-toolbar"><label><span>Filter by status</span><select value={filter} onChange={event => setFilter(event.target.value as typeof filter)}><option value="all">All inquiries</option><option value="new">New</option><option value="read">Read</option><option value="archived">Archived</option></select></label><p aria-live="polite">{filtered.length} {filtered.length === 1 ? "inquiry" : "inquiries"}</p></div>
    {inquiries.isLoading ? <div className="admin-loading" role="status"><Loader2 className="animate-spin" />Loading inquiries</div> : filtered.length ? <div className="inquiry-list">{filtered.map(item => <article key={item.id}><header><div><span className={`admin-status admin-status-${item.status}`}>{item.status}</span><p>{new Date(item.submittedAt).toLocaleString()} · {item.topic}</p><h2>{item.name}</h2>{item.organization ? <strong>{item.organization}</strong> : null}</div><a href={`mailto:${item.email}`}><Mail />Reply by email</a></header><p className="inquiry-message">{item.message}</p><footer><Button variant="outline" onClick={() => status.mutate({ id: item.id, status: "read" })}><CheckCircle2 />Mark read</Button><Button variant="outline" onClick={() => status.mutate({ id: item.id, status: "archived" })}><Archive />Archive</Button>{item.status !== "new" ? <Button variant="ghost" onClick={() => status.mutate({ id: item.id, status: "new" })}><Inbox />Mark new</Button> : null}</footer></article>)}</div> : !inquiries.isLoading ? <div className="admin-empty"><Inbox /><h2>No inquiries in this view</h2><p>New public submissions will appear here for authorized administrators.</p></div> : null}
  </div></DashboardLayout>;
}
