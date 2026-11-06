import React from "react";
import { ArrowRight, CalendarDays, ExternalLink, FileText } from "lucide-react";
import { Link } from "wouter";
import { PageHero } from "@/components/site/PageHero";
import { ArticleCard } from "@/components/site/LegacyArticle";
import { ManagedEvents } from "@/components/site/ManagedEvents";
import { ManagedStudyCircles } from "@/components/site/ManagedStudyCircles";
import { AgendaCalendar, DocumentCard, MediaFigure } from "@/components/site/ContentPrimitives";
import { archivedEvents, articles, documents, externalPress, media } from "@/data/siteContent";
import { WrittenMeetingRecords } from "./MeetingMinutesPublic";
import { ibaaMailingAddress } from "@shared/ibaaMailingAddress";

const boardOfDirectors = [
  { name: "Ven. Katusgastota Uparatana", country: "Sri Lanka", role: "Chairman" },
  { name: "Ven. Dr. Thanat Inthisan", country: "Thailand", role: "Vice-Chairman, Theravada" },
  { name: "Ven. Dr. Jinwol Lee", country: "South Korea", role: "Vice-Chairman, Mahayana" },
  { name: "Ven. Khenpo Tsultrim Tenzin", country: "Tibet", role: "Vice-Chairman, Vajrayana" },
  { name: "Ven. Dr. Dhammadipa", country: "Taiwan", role: "Senior Vice-President" },
  { name: "Ven. Thongvanh Dalavong", country: "Laos", role: "Treasurer" },
  { name: "Bishop Rev. Harada", country: "Japan", role: "Executive Vice-President" },
  { name: "Ven. Moeng Sang", country: "Cambodia", role: null },
  { name: "Ven. Dr. Jongmae Kenneth Park", country: "USA", role: null },
  { name: "Ven. Wol", country: "South Korea", role: null },
  { name: "Mrs. Wangmo Dixey", country: "USA", role: "President" },
  { name: "Dr. Richard Dixey", country: "UK", role: "General Secretary" },
  { name: "Mr. Prasarn Manakul", country: "Thailand", role: "Deputy Secretary" },
  { name: "Mr. Matthew Regan", country: "USA", role: "Assistant Secretary" },
  { name: "Ms. Khin Shwe Myint", country: "Burma", role: null },
] as const;

export function AboutPage() {
  return <><PageHero eyebrow="About IBAA" title="A shared home for America’s Buddhist traditions" intro="IBAA was founded to strengthen cooperation among Buddhist communities and to promote, preserve, and protect the Buddha-Dharma." /><section className="site-container editorial-section"><div className="editorial-main"><div className="notice-panel compact"><p><strong>History status:</strong> The dates and names below are preserved from IBAA’s legacy organizational history and require final confirmation by current IBAA leadership before launch.</p></div><p className="lead">The legacy history records that, by the middle of the 1970s, fully functioning Buddhist temples were still few in the United States. As communities from many countries grew, the need for an organization dedicated to collaboration became increasingly clear.</p><h2>From a Washington-area gathering to a national mission</h2><p>The legacy record states that a founding meeting was convened at Wat Thai Washington, DC on August 29, 2015 under the leadership of Venerable Thanat Inthisan and Venerable Katugastota Uparatana. Participants agreed to establish an international Buddhist association for the United States.</p><div className="timeline"><div><span>2015</span><p>Founding meeting and Maryland incorporation filing.</p></div><div><span>2016</span><p>Federal tax and nonprofit applications submitted.</p></div><div><span>2017</span><p>IRS determination letter received, recognizing IBAA as a nonprofit religious organization.</p></div></div><h2>Our path forward</h2><p>IBAA works in a spirit of non-sectarian respect, bringing Theravada, Mahayana, and Vajrayana communities into shared learning, public service, and national representation.</p></div><aside className="editorial-aside"><p className="eyebrow">Our compass</p><h2>Promote. Preserve. Protect.</h2><p>These three commitments shape IBAA’s programs, partnerships, and stewardship of Buddhist life in the United States.</p><Link className="text-link" href="/about/mission">Read our mission <ArrowRight /></Link><br /><Link className="text-link" href="/about/governance">Governance <ArrowRight /></Link><br /><Link className="text-link" href="/about/directors">Meet IBAA leadership <ArrowRight /></Link><br /><Link className="text-link" href="/member-temples">Member Temples and Organizations <ArrowRight /></Link><br /><Link className="text-link" href="/news-media">News & Media <ArrowRight /></Link><br /><Link className="text-link" href="/programs">Explore our programs <ArrowRight /></Link></aside></section></>;
}

export function LeadershipPage() {
  return <><PageHero eyebrow="Leadership" title="Board of Directors" intro="Monastic and lay leaders serving IBAA’s national, multi-tradition mission." /><section className="site-container content-section"><div className="notice-panel compact"><p><strong>Roster responsibility:</strong> This Board of Directors list was supplied as the official IBAA roster. Leadership information is maintained by IBAA and should be confirmed with the organization before final launch or after any governance change.</p></div><div className="leadership-heading"><p className="eyebrow">Current supplied roster</p><h2>Board members</h2><p>Roles are shown only where they were included in the official list supplied to the website team.</p></div><div className="leadership-board" aria-label="IBAA Board of Directors">{boardOfDirectors.map(member => <article key={member.name} className="leader-card"><p className="leader-country">{member.country}</p><h3>{member.name}</h3>{member.role ? <p className="leader-role">{member.role}</p> : <p className="leader-role is-unlisted">Role not listed in supplied roster</p>}</article>)}</div><p className="leadership-source">For historical comparison, the preserved legacy Board page remains available in the <a href="https://www.ibaa.org/index.php/board_of_directors/" target="_blank" rel="noreferrer">IBAA source archive <ExternalLink aria-hidden="true" /></a>.</p></section></>;
}

export function DelegatesPage() {
  return <><PageHero eyebrow="Annual Delegates" title="Buddhist voices in national public life" intro="IBAA documents delegations, White House Vesak observances, and inter-Buddhist representation with verified dates, photographs, and credits." /><section className="site-container delegates-section"><article className="delegate-feature"><img src={media.whiteHouse2026} alt="IBAA leaders on the steps of the Eisenhower Executive Office Building in 2026." /><div><p className="eyebrow">2026 delegation</p><h2>White House Faith Office meeting</h2><p>IBAA monastic and lay leaders met representatives of the White House Faith Office on April 16, 2026.</p><Link className="text-link" href="/news/ibaa-white-house-faith-office">View the archive record <ArrowRight /></Link></div></article><article className="delegate-feature reverse"><img src={media.whiteHouse2024} alt="Buddhist representatives at the White House Vesak celebration in 2024." /><div><p className="eyebrow">2024 delegation</p><h2>Fourth White House Vesak observance</h2><p>The legacy archive records IBAA participation in the fourth annual White House Vesak observance.</p><Link className="text-link" href="/news/white-house-vesak-2024">View the archive record <ArrowRight /></Link></div></article></section></>;
}

export function ProgramsPage() {
  return <><PageHero eyebrow="Programs" title="Learning, fellowship, and shared service" intro="IBAA programs create practical ways for Buddhist communities to learn from one another, serve together, and support future generations." /><section className="site-container program-list"><article><span>01</span><div><h2>Dharma Study Circles</h2><p>Recurring gatherings hosted by Buddhist communities across traditions, with written meeting context and selected special-event media.</p><Link className="text-link" href="/study-circles">Explore Study Circles <ArrowRight /></Link></div></article><article><span>02</span><div><h2>Youth & Next Generations</h2><p>Resources that help young Buddhists explore practice, identity, leadership, and service in contemporary American life.</p><Link className="text-link" href="/programs/youth">View youth resources <ArrowRight /></Link></div></article><article><span>03</span><div><h2>Interfaith & Civic Partnership</h2><p>Relationship-building with faith and civic partners to advance mutual understanding, compassion, and public service.</p></div></article><article><span>04</span><div><h2>Pilgrimage & Sacred Places</h2><p>Programs connecting practitioners with Buddhist sacred places, lineage histories, and the wider international Buddhist community.</p></div></article></section></>;
}

export function YouthPage() {
  const youth = documents[0];
  return <><PageHero eyebrow="Youth" title="Practice and belonging for the next generation" intro="IBAA supports thoughtful resources that help young Buddhists connect inherited traditions with contemporary life." /><section className="site-container content-section"><DocumentCard featured title={youth.title} type="Featured resource · PDF" url={youth.url} context="The legacy youth page attempted to embed this paper directly. The rebuilt site presents it as an accessible document with a clear title and download action." /></section></>;
}

export function StudyCirclesPage() {
  return <><PageHero eyebrow="Dharma Study Circles" title="Learning across temples and traditions" intro="A recurring IBAA program for teaching, conversation, and friendship among Buddhist communities." aside={<a className="button-primary" href="mailto:dharmastudy@ibaa.org">Contact the Study Circle</a>} /><section className="site-container study-page"><MediaFigure className="wide-figure" src={media.studyCircle2026} alt="Participants gathered for an IBAA Dharma Study Circle at Drikung Kagyu Temple." caption="Drikung Kagyu Temple on August 15, 2026." /><div className="editorial-main"><p className="lead">The legacy archive records that IBAA resumed routine Dharma Study Circles in the greater Washington, DC area in May 2024. The 2026 program now includes separate regional records for Washington, Los Angeles, and the San Francisco Bay Area.</p><h2>Written records first</h2><p>Recurring meetings are documented with clear written minutes, dates, host context, and photographs. YouTube recordings are optional supplements and use accessible titles and privacy-enhanced playback.</p><p><a className="text-link" href="#written-minutes">Browse written meeting records <ArrowRight /></a></p><ManagedStudyCircles /></div></section><div className="site-container"><WrittenMeetingRecords /></div></>;
}

export function EventsPage() {
  return <><PageHero eyebrow="Events" title="Gatherings across the Buddhist community" intro="Explore published IBAA activities and a carefully preserved archive of past gatherings." /><section className="site-container content-section"><ManagedEvents /><div className="section-heading"><p className="eyebrow">Past events</p><h2>Recent archive by month</h2></div><AgendaCalendar events={archivedEvents.filter(event => event.type !== "Study Circle")} /></section></>;
}

export { TemplesPage } from "./TemplesPages";

export function NewsMediaPage() {
  return <><PageHero eyebrow="News & Media" title="A living public record" intro="Current publishing and preserved legacy content, presented with original dates, categories, imagery, and source context." /><section className="site-container news-page"><div className="article-grid">{articles.map(article => <ArticleCard key={article.slug} article={article} />)}</div><div className="press-archive"><div className="section-heading"><p className="eyebrow">Press archive</p><h2>IBAA in external media</h2></div>{["2024", "2023", "2021"].map(year => <section key={year}><h3>{year}</h3><div>{externalPress.filter(item => item.year === year).map(item => <a key={item.url} href={item.url} target="_blank" rel="noreferrer"><span>{item.date}</span><strong>{item.title}</strong><em>{item.publisher}</em><ExternalLink /></a>)}</div></section>)}</div></section></>;
}

export function ResourcesPage() {
  return <><PageHero eyebrow="Resources" title="Documents and media library" intro="Access IBAA forms, papers, meeting records, and media with clear titles and legacy context." /><section className="site-container resources-grid">{documents.map(document => <DocumentCard key={document.url} {...document} />)}</section></>;
}

export function JoinPage() {
  return <><PageHero eyebrow="Join IBAA" title="Build Buddhist community together" intro="Membership connects temples, communities, monastics, lay leaders, and supporters to IBAA’s national work." /><section className="site-container action-page"><div><h2>Why participate</h2><p>Members strengthen inter-Buddhist relationships, support public programs, and help sustain a shared national voice.</p><ul><li>Connect with communities across traditions.</li><li>Participate in Study Circles and national programs.</li><li>Contribute to IBAA’s public and archival work.</li></ul></div><aside><p className="eyebrow">Membership</p><h2>Membership application</h2><p>Download the membership registration form below. Mail your completed form to:</p><address>{ibaaMailingAddress.recipient}<br />{ibaaMailingAddress.street}<br />{ibaaMailingAddress.locality}</address><a className="button-primary" href={documents[1].url} target="_blank" rel="noreferrer">Open application <ExternalLink /></a></aside></section></>;
}

export { DonatePage } from "./DonatePage";

export function ContactPage() {
  return <><PageHero eyebrow="Contact" title="Begin a conversation" intro="Connect with IBAA about programs, community participation, archival information, or organizational collaboration." /><section className="site-container contact-grid"><article><p className="eyebrow">Study Circles</p><h2>Program inquiries</h2><p>For interest in attending or hosting a Dharma Study Circle:</p><a href="mailto:dharmastudy@ibaa.org">dharmastudy@ibaa.org</a></article><article><p className="eyebrow">General contact</p><h2>Contact details under review</h2><p>IBAA is confirming the general public email and mailing address before launch so the rebuilt site does not publish outdated information.</p></article></section></>;
}

export function SimpleLegalPage({ title }: { title: "Privacy" | "Terms of Use" }) {
  return <><PageHero eyebrow="Governance" title={title} intro={`The ${title.toLowerCase()} content from the legacy site is being reviewed for the rebuilt platform.`} /><section className="site-container content-section"><div className="notice-panel"><h2>Editorial review in progress</h2><p>This page will preserve the legacy policy context and be updated for the rebuilt platform’s authentication, analytics, media, and Hosting.com deployment before launch.</p></div></section></>;
}
