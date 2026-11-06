import React, { useMemo } from "react";
import { ExternalLink, Flower2, Landmark, Sun, Waves } from "lucide-react";
import { Link } from "wouter";
import { studyCircleRegions } from "@/data/siteContent";
import { trpc } from "@/lib/trpc";
import { SecureYouTubeEmbed } from "./SecureYouTubeEmbed";

const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"] as const;
const timeZones: Record<string, string> = { "America/Los_Angeles": "PT", "America/Denver": "MT", "America/Chicago": "CT", "America/New_York": "ET" };
type RegionName = (typeof studyCircleRegions)[number]["name"];
export type DisplayRecord = { date: string; monthYear: string; temple: string; nationality: string; yana: string; detail: string; description?: string; youtubeUrl?: string; minutesUrl?: string; image?: { url: string; altText: string | null; caption?: string | null; width?: number | null; height?: number | null } | null; managed?: boolean };

const icons: Partial<Record<RegionName, typeof Landmark>> = { "Washington DC Metro Area": Landmark, "Greater Los Angeles Metro Area": Sun };

function RegionIcon({ region }: { region: RegionName }) {
  const Icon = icons[region];
  if (Icon) return <Icon aria-hidden="true" />;
  return <span className="study-region-bay-mark" aria-hidden="true"><Flower2 /><Waves /></span>;
}

function isoDate(timestamp: number) {
  return new Date(timestamp).toISOString().slice(0, 10);
}

function readableDate(timestamp: number) {
  return new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" }).format(new Date(timestamp));
}

export function partitionMeetingRecords(records: readonly DisplayRecord[], today: string) {
  const newestFirst = [...records].sort((a, b) => b.date.localeCompare(a.date));
  const upcoming = newestFirst.filter(record => record.date >= today);
  const past = newestFirst.filter(record => record.date < today);
  const next = [...upcoming].sort((a, b) => a.date.localeCompare(b.date))[0] ?? null;
  return { upcoming, past, next };
}

function regionalToday(region: RegionName) {
  const zone = region === "Washington DC Metro Area" ? "America/New_York" : "America/Los_Angeles";
  const parts = new Intl.DateTimeFormat("en-US", { year: "numeric", month: "2-digit", day: "2-digit", timeZone: zone }).formatToParts(new Date());
  const value = (name: string) => parts.find(part => part.type === name)!.value;
  return `${value("year")}-${value("month")}-${value("day")}`;
}

function MeetingRecordList({ records, regionId }: { records: DisplayRecord[]; regionId: string }) {
  return <div className="host-list">{records.map(record => <article key={`${regionId}-${record.date}-${record.temple}`}><div><h4>{record.monthYear} — {record.temple} ({record.nationality}, {record.yana})</h4><p>{record.detail}</p>{record.description ? <p>{record.description}</p> : null}{record.image ? <figure className="study-circle-managed-image"><img src={record.image.url} alt={record.image.altText ?? ""} width={record.image.width ?? undefined} height={record.image.height ?? undefined} loading="lazy" decoding="async" />{record.image.caption ? <figcaption>{record.image.caption}</figcaption> : null}</figure> : null}{record.minutesUrl ? <p><Link className="text-link" href={record.minutesUrl}>Read the written minutes</Link></p> : null}{record.youtubeUrl && !record.managed ? <p><a className="text-link" href={record.youtubeUrl} target="_blank" rel="noreferrer">Watch the verified recording <ExternalLink aria-hidden="true" /></a></p> : null}{record.youtubeUrl && record.managed ? <SecureYouTubeEmbed url={record.youtubeUrl} title={`${record.monthYear} Study Circle at ${record.temple}`} /> : null}</div><time dateTime={record.date}>{record.monthYear}</time></article>)}</div>;
}

export function ManagedStudyCircles() {
  const managed = trpc.studyCircles.listPublished.useQuery();
  const regions = useMemo(() => studyCircleRegions.map(region => {
    const records = new Map<string, DisplayRecord>();
    region.records.forEach(record => records.set(`${record.date}|${record.temple.toLowerCase()}`, { ...record }));
    (managed.data ?? []).filter(entry => entry.region === region.name).forEach(entry => {
      const date = isoDate(entry.meetingDate);
      const time = entry.startTime && entry.endTime ? `${entry.startTime}–${entry.endTime} ${timeZones[entry.timeZone] ?? entry.timeZone}` : "Time to be confirmed";
      const detail = [entry.venueNote, readableDate(entry.meetingDate), time].filter(Boolean).join(" · ");
      const key = `${date}|${entry.templeName.toLowerCase()}`;
      const existing = records.get(key);
      records.set(key, { ...existing, date, monthYear: `${months[entry.meetingMonth - 1]} ${entry.meetingYear}`, temple: entry.templeName, nationality: entry.nationality, yana: entry.yana, detail, description: entry.description, youtubeUrl: entry.youtubeUrl ?? existing?.youtubeUrl, image: entry.image ?? existing?.image, managed: true });
    });
    return { ...region, records: Array.from(records.values()) };
  }), [managed.data]);

  return <div className="study-region-grid">{managed.isError ? <div className="notice-panel compact" role="status"><p>Managed Study Circle updates are temporarily unavailable. The verified archive remains visible below.</p></div> : null}{regions.map(region => {
    const { upcoming, past, next } = partitionMeetingRecords(region.records, regionalToday(region.name));
    return <section className="study-region-card" key={region.id} aria-labelledby={`${region.id}-title`}><header className="study-region-header"><span className="study-region-icon"><RegionIcon region={region.name} /></span><div><p className="eyebrow">Regional Study Circles</p><h2 id={`${region.id}-title`}>{region.name}</h2></div></header><div className="study-region-next"><p className="eyebrow">Next meeting</p>{next ? <><h3>{next.monthYear} — {next.temple}</h3><p>{next.detail}</p></> : <p>No future meeting has been published for this region yet.</p>}</div><section className="study-region-record-group" aria-labelledby={`${region.id}-upcoming-title`}><h3 id={`${region.id}-upcoming-title`}>Upcoming meetings</h3>{upcoming.length ? <MeetingRecordList records={upcoming} regionId={region.id} /> : <p className="study-region-empty">No upcoming meetings have been published.</p>}</section><section className="study-region-record-group" aria-labelledby={`${region.id}-past-title`}><h3 id={`${region.id}-past-title`}>Past meetings</h3>{past.length ? <MeetingRecordList records={past} regionId={region.id} /> : <p className="study-region-empty">No past meetings have been published.</p>}</section></section>;
  })}</div>;
}
