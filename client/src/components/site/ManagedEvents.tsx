import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { CalendarDays, ExternalLink, Loader2, MapPin, Video } from "lucide-react";
import React from "react";
import { Link } from "wouter";
import { TraditionTag } from "./ContentPrimitives";

function formatDate(value: number) {
  return new Intl.DateTimeFormat(undefined, { dateStyle: "long", timeZone: "UTC" }).format(new Date(value));
}

function formatTime(value: string | null) {
  if (!value) return "";
  const [hours, minutes] = value.split(":").map(Number);
  return new Intl.DateTimeFormat(undefined, { hour: "numeric", minute: "2-digit", timeZone: "UTC" }).format(new Date(Date.UTC(2026, 0, 1, hours, minutes)));
}

const timeZoneLabels: Record<string, string> = { "America/Los_Angeles": "Pacific", "America/Denver": "Mountain", "America/Chicago": "Central", "America/New_York": "Eastern" };

export function isMonthlyDharmaMeeting(event: { title: string }) {
  return /\b(?:dharma\s+(?:study\s+)?circle|dharma\s+meeting|interdenominational\s+study\s+circle)\b/i.test(event.title);
}

export function ManagedEvents() {
  const events = trpc.events.listPublished.useQuery();
  const nonMeetingEvents = events.data?.filter(event => !isMonthlyDharmaMeeting(event));
  return <section aria-labelledby="managed-events-title"><div className="section-heading"><p className="eyebrow">Published Events</p><h2 id="managed-events-title">Upcoming and recent gatherings</h2><p>For monthly Dharma Meetings, photographs, and recordings, visit <Link className="text-link" href="/study-circles">Study Circles</Link>.</p></div>{events.isLoading ? <div className="minutes-status" role="status"><Loader2 className="animate-spin" />Loading Events</div> : events.isError ? <div className="admin-query-error" role="alert"><strong>Published Events could not be loaded.</strong><Button variant="outline" onClick={() => void events.refetch()}>Try again</Button></div> : nonMeetingEvents?.length ? <div className="minutes-list">{nonMeetingEvents.map(event => <article className="minutes-card" key={event.id}><div className="minutes-date"><CalendarDays aria-hidden="true" /><time dateTime={new Date(event.eventDate).toISOString().slice(0, 10)}>{formatDate(event.eventDate)}</time></div><div className="minutes-card-main"><p className="eyebrow">{event.startTime && event.endTime ? `${formatTime(event.startTime)}–${formatTime(event.endTime)}` : "Time to be determined"} · {timeZoneLabels[event.timeZone] ?? event.timeZone}</p><h2>{event.title}</h2><p className="minutes-location"><MapPin aria-hidden="true" />{event.venueName}{event.address ? ` · ${event.address}` : ""}{event.city ? ` · ${event.city}` : ""}{event.region ? ` · ${event.region}` : ""}</p><div className="minutes-tags">{event.traditions.map(tradition => <TraditionTag key={tradition} tradition={tradition} />)}</div><p>{event.description}</p><p>{event.zoomUrl ? <a href={event.zoomUrl} target="_blank" rel="noreferrer">Join by Zoom <ExternalLink aria-hidden="true" /></a> : null}{event.zoomUrl && event.youtubeUrl ? " · " : null}{event.youtubeUrl ? <a href={event.youtubeUrl} target="_blank" rel="noreferrer">YouTube <Video aria-hidden="true" /></a> : null}</p></div>{event.image ? <aside className="minutes-media"><figure><img src={event.image.url} alt={event.image.altText ?? ""} loading="lazy" />{event.image.caption ? <figcaption>{event.image.caption}</figcaption> : null}</figure></aside> : null}</article>)}</div> : <div className="minutes-empty"><CalendarDays aria-hidden="true" /><div><h3>No other managed Events are published yet</h3><p>Monthly Dharma Meetings are listed on Study Circles. Other published Events will appear here after an administrator approves them.</p></div></div>}</section>;
}
