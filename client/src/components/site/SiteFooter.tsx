import { Link } from "wouter";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-container footer-grid">
        <div className="footer-identity">
          <div className="footer-lockup">
            <span className="footer-seal" aria-hidden="true">IBAA</span>
            <strong>International Buddhist<br />Association of America</strong>
          </div>
          <p>A national, non-sectarian organization supporting Buddhist communities across the United States.</p>
        </div>
        <div>
          <h2>Explore</h2>
          <Link href="/about">About IBAA</Link>
          <Link href="/buddhist-traditions">Buddhist Traditions</Link>
          <Link href="/programs">Programs</Link>
          <Link href="/events">Events</Link>
          <Link href="/news-media">News & Media</Link>
          <Link href="/resources">Resources</Link>
        </div>
        <div>
          <h2>Participate</h2>
          <Link href="/temple-outreach">Temple Outreach</Link>
          <Link href="/communities">Communities</Link>
          <Link href="/member-temples">Member Temples</Link>
          <Link href="/join">Join IBAA</Link>
          <Link href="/donate">Donate</Link>
          <Link href="/contact">Contact</Link>
        </div>
        <div>
          <h2><Link href="/about/governance">Governance</Link></h2>
          <Link href="/about/directors">Leadership</Link>
          <Link href="/annual-delegates">Annual Delegates</Link>
          <Link href="/privacy">Privacy</Link>
          <Link href="/terms-of-use">Terms of Use</Link>
        </div>
      </div>
      <div className="site-container footer-bottom">
        <p>© {new Date().getFullYear()} International Buddhist Association of America</p>
        <p>Legacy content is preserved with original dates and source context.</p>
      </div>
    </footer>
  );
}
