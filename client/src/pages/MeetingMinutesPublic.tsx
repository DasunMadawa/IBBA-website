import React from "react";
import { Link } from "wouter";
import { BookOpenText, CalendarDays, ExternalLink, Loader2, MapPin } from "lucide-react";
import { TraditionTag } from "@/components/site/ContentPrimitives";
import { SecureYouTubeEmbed } from "@/components/site/SecureYouTubeEmbed";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";

type Tradition = "Theravada" | "Mahayana" | "Vajrayana";

function toDateInput(value: number) {
  return new Date(value).toISOString().slice(0, 10);
}
function formatMeetingDate(value: number) {
  return new Intl.DateTimeFormat(undefined, { dateStyle: "long", timeZone: "UTC" }).format(new Date(value));
}

export function MinutesCard({ entry, compact = false }: { entry: any; compact?: boolean }) {
  return <article className={compact ? "minutes-card is-compact" : "minutes-card"}>
    <div className="minutes-date"><CalendarDays aria-hidden="true" /><time dateTime={toDateInput(entry.meetingDate)}>{formatMeetingDate(entry.meetingDate)}</time></div>
    <div className="minutes-card-main">
      <div className="minutes-tags">{entry.traditions.map((tradition: Tradition) => <TraditionTag key={tradition} tradition={tradition} />)}</div>
      <h2>{entry.title}</h2>
      <p className="minutes-location"><MapPin aria-hidden="true" />{entry.hostTemple} · {entry.locationLabel}</p>
      <p>{entry.summary}</p>
      {!compact ? <div className="minutes-written"><h3>Meeting Minutes</h3><div>{entry.minutesBody}</div></div> : null}
      {compact ? <Link className="text-link" href={`/study-circles/minutes/${entry.slug}`}>Read the written minutes <ExternalLink aria-hidden="true" /></Link> : null}
    </div>
    {!compact && (entry.photo || entry.youtubeUrl) ? <aside className="minutes-media">
      {entry.photo ? <figure><img src={entry.photo.url} alt={entry.photo.altText || ""} />{entry.photo.caption ? <figcaption>{entry.photo.caption}</figcaption> : null}</figure> : null}
      {entry.youtubeUrl && entry.youtubeTitle ? <SecureYouTubeEmbed url={entry.youtubeUrl} title={entry.youtubeTitle} /> : null}
    </aside> : null}
  </article>;
}

export function WrittenMeetingRecords() {
  const entries = trpc.meetingMinutes.listPublished.useQuery();
  return <section id="written-minutes" className="site-container recent-minutes" aria-labelledby="written-minutes-title">
    <div className="section-heading"><p className="eyebrow">Written record</p><h2 id="written-minutes-title">Dharma Meeting Minutes</h2><p>Written minutes remain the primary record; photographs and recordings supplement them when available.</p></div>
    {entries.isLoading ? <div className="minutes-status" role="status"><Loader2 className="animate-spin" />Loading Meeting Minutes</div> : null}
    {entries.isError ? <div className="admin-query-error" role="alert"><strong>Meeting Minutes could not be loaded.</strong><Button variant="outline" onClick={() => void entries.refetch()}>Try again</Button></div> : null}
    {entries.data?.length ? <div className="recent-minutes-grid">{entries.data.map(entry => <MinutesCard key={entry.id} entry={entry} compact />)}</div> : !entries.isLoading && !entries.isError ? <div className="minutes-empty"><BookOpenText aria-hidden="true" /><div><h3>No managed Meeting Minutes are published yet</h3><p>Written minutes will appear here after an authorized IBAA editor publishes the first verified record.</p></div></div> : null}
  </section>;
}

export function MeetingMinutesDetailPage({ slug }: { slug: string }) {
  const entries = trpc.meetingMinutes.listPublished.useQuery();
  const entry = entries.data?.find(item => item.slug === slug);
  return <section className="site-container minutes-archive"><nav className="breadcrumbs" aria-label="Breadcrumb"><Link href="/study-circles">Study Circles</Link><span aria-hidden="true">/</span><span aria-current="page">{entry?.title ?? "Written meeting record"}</span></nav>{entries.isLoading ? <div className="minutes-status" role="status"><Loader2 className="animate-spin" />Loading Meeting Minutes</div> : entries.isError ? <div className="admin-query-error" role="alert"><strong>This written record could not be loaded.</strong><Button variant="outline" onClick={() => void entries.refetch()}>Try again</Button></div> : entry ? <MinutesCard entry={entry} /> : <div className="minutes-empty is-large"><BookOpenText aria-hidden="true" /><div><h1>Meeting record not found</h1><p>This entry may be unpublished or its URL may have changed.</p></div></div>}</section>;
}
