import React, { type ReactNode } from "react";
import { Download, ExternalLink, FileText, MapPin } from "lucide-react";

export function CategoryTag({ children }: { children: ReactNode }) {
  return <span className="category-tag">{children}</span>;
}

export function TraditionTag({ tradition }: { tradition: string }) {
  return <span className={`tradition-tag tradition-${tradition.toLowerCase().replace(/[^a-z]+/g, "-")}`}>{tradition}</span>;
}

export function MediaFigure({ src, alt, caption, credit, className = "" }: { src: string; alt: string; caption?: string; credit?: string; className?: string }) {
  return (
    <figure className={className}>
      <img src={src} alt={alt} loading="lazy" />
      {caption || credit ? <figcaption>{caption}{credit ? <><br /><span>{credit}</span></> : null}</figcaption> : null}
    </figure>
  );
}

export function DocumentCard({ title, type, url, context, featured = false }: { title: string; type: string; url: string; context: string; featured?: boolean }) {
  return (
    <article className={featured ? "document-card is-featured" : "document-card"}>
      <FileText aria-hidden="true" />
      <p className="eyebrow">{type}</p>
      <h2>{title}</h2>
      <p>{context}</p>
      <a href={url} target="_blank" rel="noreferrer">Open document {featured ? <ExternalLink aria-hidden="true" /> : <Download aria-hidden="true" />}</a>
    </article>
  );
}

export function LegacyContext({ legacyUrl, children, title = "Preserved from IBAA.org", linkLabel = "View original legacy URL" }: { legacyUrl: string; children?: ReactNode; title?: string; linkLabel?: string }) {
  return (
    <aside className="legacy-context">
      <p className="eyebrow">Source context</p>
      <h2>{title}</h2>
      <p>{children ?? "This record retains its original publication date, categories, media context, and legacy path."}</p>
      <a href={legacyUrl} target="_blank" rel="noreferrer">{linkLabel} <ExternalLink aria-hidden="true" /></a>
    </aside>
  );
}

type EventItem = { date: string; title: string; venue: string; type: string };

export function AgendaCalendar({ events }: { events: readonly EventItem[] }) {
  if (events.length === 0) {
    return (
      <div className="empty-state" role="status">
        <h3>No archived events are available</h3>
        <p>Published events will appear here with their dates, venues, and event type.</p>
      </div>
    );
  }

  const groups = events.reduce<Record<string, EventItem[]>>((accumulator, event) => {
    const key = new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(`${event.date}T00:00:00Z`));
    accumulator[key] = [...(accumulator[key] ?? []), event];
    return accumulator;
  }, {});

  return (
    <div className="agenda-calendar" aria-label="Archived events by month">
      {Object.entries(groups).map(([month, monthEvents]) => (
        <section key={month} className="agenda-month">
          <h3>{month}</h3>
          <ol>
            {monthEvents.map(event => {
              const date = new Date(`${event.date}T00:00:00Z`);
              return (
                <li key={`${event.date}-${event.title}`}>
                  <time dateTime={event.date} aria-label={date.toLocaleDateString("en-US", { dateStyle: "long", timeZone: "UTC" })}>
                    <span>{date.toLocaleDateString("en-US", { weekday: "short", timeZone: "UTC" })}</span>
                    {date.getUTCDate()}
                  </time>
                  <div>
                    <p className="event-type">{event.type}</p>
                    <h4>{event.title}</h4>
                    <p><MapPin aria-hidden="true" />{event.venue}</p>
                  </div>
                </li>
              );
            })}
          </ol>
        </section>
      ))}
    </div>
  );
}
