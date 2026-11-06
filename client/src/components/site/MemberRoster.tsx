import React, { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { TraditionTag } from "./ContentPrimitives";
import { trpc } from "@/lib/trpc";
import { ExternalLink, Loader2, MapPin, Search } from "lucide-react";
import suppliedMembers from "@shared/ibaaMembers.json";
import { formatMemberAddress } from "@shared/memberDirectory";

export function MemberRoster({ showFilters = true }: { showFilters?: boolean }) {
  const directory = trpc.temples.listPublished.useQuery();
  const records = directory.data ?? [];
  const [query, setQuery] = useState("");
  const [tradition, setTradition] = useState("All");
  const [stateRegion, setStateRegion] = useState("All");
  const [city, setCity] = useState("All");
  const traditions = useMemo(() => ["All", ...Array.from(new Set(records.map(record => record.tradition).filter(Boolean)))], [records]);
  const states = useMemo(() => ["All", ...Array.from(new Set(records.map(record => record.stateRegion).filter(Boolean))).sort()], [records]);
  const cities = useMemo(() => ["All", ...Array.from(new Set(records.filter(record => stateRegion === "All" || record.stateRegion === stateRegion).map(record => record.city).filter(Boolean))).sort()], [records, stateRegion]);
  const filtered = useMemo(() => records.filter(record =>
    (tradition === "All" || record.tradition === tradition)
    && (stateRegion === "All" || record.stateRegion === stateRegion)
    && (city === "All" || record.city === city)
    && `${record.name} ${formatMemberAddress(record)} ${record.lineage ?? ""}`.toLowerCase().includes(query.toLowerCase())
  ), [city, query, records, stateRegion, tradition]);

  return <>
    <div className="notice-panel compact"><p><strong>IBAA member roster:</strong> Membership names, addresses and available website links supplied by IBAA. Authorized administrators can maintain the organization records. Study Circle host records remain separate from membership.</p></div>
    {directory.isError ? <div className="admin-query-error" role="alert"><strong>The member roster could not be loaded.</strong><span>Please try again. Provisional meeting hosts are not substituted for members.</span><Button type="button" variant="outline" onClick={() => void directory.refetch()}>Try again</Button></div> : null}
    {directory.isLoading ? <p className="admin-loading" role="status"><Loader2 className="animate-spin" aria-hidden="true" />Loading IBAA members…</p> : null}
    {showFilters && !directory.isError ? <div className="directory-tools">
      <label><span>Search members</span><div><Search aria-hidden="true" /><input value={query} onChange={event => setQuery(event.target.value)} placeholder="Member name, address, city or state" /></div></label>
      <label><span>State or region</span><select value={stateRegion} onChange={event => { setStateRegion(event.target.value); setCity("All"); }}>{states.map(value => <option key={value} value={value}>{value}</option>)}</select></label>
      <label><span>City</span><select value={city} onChange={event => setCity(event.target.value)}>{cities.map(value => <option key={value} value={value}>{value}</option>)}</select></label>
      {traditions.length > 1 ? <fieldset><legend>Filter by tradition</legend><div className="filter-buttons">{traditions.map(value => <button key={value} type="button" className={tradition === value ? "is-active" : ""} onClick={() => setTradition(value)} aria-pressed={tradition === value}>{value}</button>)}</div></fieldset> : null}
    </div> : null}
    {!directory.isLoading && !directory.isError ? <>
      <p className="result-count" aria-live="polite">{filtered.length} {filtered.length === 1 ? "member temple or organization" : "member temples and organizations"}</p>
      <div className="directory-grid">{filtered.map(record => <article key={record.id}>
        {record.tradition ? <TraditionTag tradition={record.tradition} /> : null}
        <h2>{record.name}</h2>
        <p className="member-address"><MapPin aria-hidden="true" />{formatMemberAddress(record)}</p>
        {record.lineage ? <p className="directory-lineage">{record.lineage}</p> : null}
        {record.description ? <p>{record.description}</p> : null}
        {record.websiteUrl ? <div><a href={record.websiteUrl} target="_blank" rel="noopener noreferrer" aria-label={`Website for ${record.name}`}>Website <ExternalLink aria-hidden="true" /></a></div> : null}
      </article>)}</div>
      {filtered.length === 0 ? <div className="empty-state"><h2>No members match those filters</h2><p>Try a broader search or select All.</p></div> : null}
    </> : null}
    <section className="content-section" aria-labelledby="individual-members-title">
      <h3 id="individual-members-title">Individual Members</h3>
      {suppliedMembers.individuals.map(member => <p key={member.name}>{member.name} ({member.location})</p>)}
    </section>
  </>;
}
