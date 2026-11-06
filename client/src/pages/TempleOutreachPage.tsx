import React, { useEffect } from "react";
import { ArrowRight, ExternalLink } from "lucide-react";
import { Link } from "wouter";
import { PageHero } from "@/components/site/PageHero";
import { MemberRoster } from "@/components/site/MemberRoster";

const buddhaMapUrl = "https://play.google.com/store/apps/details?id=com.hexagon.directory_app&hl=en_US";

export function TempleOutreachPage() {
  useEffect(() => {
    if (window.location.hash === "#buddha-map") document.getElementById("buddha-map")?.scrollIntoView({ block: "start" });
  }, []);

  return <>
    <PageHero eyebrow="Connecting Buddhist communities" title="Temple Outreach" intro="IBAA builds relationships with Buddhist temples and communities across traditions through shared learning, fellowship, and service." />
    <section className="site-container editorial-section" aria-label="Temple Outreach">
      <div className="editorial-main">
        <div className="notice-panel compact" id="buddha-map">
          <div>
            <p className="eyebrow">Find a temple</p>
            <h2>Buddha Map – Find a Buddhist Temple Near You</h2>
            <p>Explore BuddhaMap, the IBAA temple app available for Android on Google Play. Temple information in third-party apps may change; contact a temple directly before visiting.</p>
            <p><a className="button-primary" href={buddhaMapUrl} target="_blank" rel="noopener noreferrer">Get it on Google Play <ExternalLink aria-hidden="true" /></a></p>
          </div>
        </div>
        <h2>Relationships across traditions</h2>
        <p>Temple outreach connects communities in the Theravada, Mahayana, and Vajrayana traditions without treating any one gathering as the entirety of a temple’s work. IBAA’s recorded Study Circle hosts include Wat Lao Buddhavong, Fo Guang Shan Hsi Lai Temple, and Drikung Kagyu Temple. Being a host does not itself establish formal IBAA membership.</p>
        <p>These relationships help Buddhist communities welcome one another, share teaching and practice, and strengthen understanding across places and traditions.</p>
        <p><Link className="text-link" href="/member-temples">Explore IBAA member temples and organizations <ArrowRight aria-hidden="true" /></Link></p>
      </div>
      <aside className="editorial-aside">
        <p className="eyebrow">Monthly Dharma Meetings</p>
        <h2>Find meetings in one place</h2>
        <p>Regional schedules, past meetings, group photographs, written records, and available recordings are gathered on Study Circles rather than repeated here.</p>
        <Link className="text-link" href="/study-circles">Visit Study Circles <ArrowRight aria-hidden="true" /></Link>
      </aside>
    </section>
    <section className="site-container directory-section" aria-labelledby="outreach-members-title"><h2 id="outreach-members-title">IBAA Members</h2><MemberRoster showFilters={false} /></section>
  </>;
}
