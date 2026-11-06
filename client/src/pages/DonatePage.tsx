import React from "react";
import { PageHero } from "@/components/site/PageHero";
import { donationMailingAddress } from "@/data/donationContent";

export function DonatePage() {
  return <>
    <PageHero eyebrow="Donate" title="Support IBAA’s work" intro="Your support helps IBAA bring Buddhist communities together, preserve a shared public record, and sustain learning and service across traditions." />
    <section className="site-container action-page">
      <div>
        <h2>Donate by mailing a check</h2>
        <p>Make your check payable to <strong>International Buddhist Association of America (IBAA)</strong>.</p>
        <address className="donation-address">{donationMailingAddress.instructions}</address>
        <p>Include your name and return address with your check.</p>
        <p>Thank you for supporting IBAA’s non-sectarian work with Buddhist communities.</p>
      </div>
    </section>
  </>;
}
