import React from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "wouter";
import { PageHero } from "@/components/site/PageHero";

export function AboutGovernancePage() {
  return <>
    <PageHero eyebrow="About IBAA" title="Governance" intro="IBAA leadership, governance context, and legacy organizational records." />
    <section className="site-container content-section">
      <p><Link className="text-link" href="/about">About IBAA <ArrowRight aria-hidden="true" /></Link></p>
      <div className="notice-panel compact"><p>Leadership information is maintained by IBAA and should be confirmed with the organization before final launch or after any governance change.</p></div>
      <div className="governance-grid">
        <article><h2>Board of Directors</h2><p>Monastic and lay leaders serving IBAA’s national, multi-tradition mission.</p><Link href="/about/directors">Meet IBAA leadership <ArrowRight aria-hidden="true" /></Link></article>
        <article><h2>Annual Delegates</h2><p>IBAA’s annual delegates and inter-community consultation program.</p><Link href="/annual-delegates">Explore annual delegations <ArrowRight aria-hidden="true" /></Link></article>
        <article><h2>Policies</h2><p><Link href="/privacy">Privacy <ArrowRight aria-hidden="true" /></Link></p><p><Link href="/terms-of-use">Terms of Use <ArrowRight aria-hidden="true" /></Link></p></article>
      </div>
    </section>
  </>;
}
