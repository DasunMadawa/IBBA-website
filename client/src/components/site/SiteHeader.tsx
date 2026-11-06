import { Button } from "@/components/ui/button";
import { ChevronDown, Menu, X } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "wouter";
import { media } from "@/data/siteContent";

const primaryLinks = [
  ["Home", "/"],
  ["About IBAA", "/about"],
  ["Study Circles", "/study-circles"],
  ["Temple Outreach", "/temple-outreach"],
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [signupOpen, setSignupOpen] = useState(false);
  const signupRef = useRef<HTMLDivElement>(null);
  const signupButtonRef = useRef<HTMLButtonElement>(null);
  const [location] = useLocation();
  const closeNavigation = () => { setOpen(false); setSignupOpen(false); };

  useEffect(() => {
    if (!signupOpen) return;
    const closeOutside = (event: PointerEvent) => {
      if (!signupRef.current?.contains(event.target as Node)) setSignupOpen(false);
    };
    document.addEventListener("pointerdown", closeOutside);
    return () => document.removeEventListener("pointerdown", closeOutside);
  }, [signupOpen]);

  return (
    <header className="site-header">
      <a className="skip-link" href="#main-content">Skip to main content</a>
      <div className="utility-bar">
        <div className="site-container utility-inner">
          <p>Promote. Preserve. Protect.</p>
        </div>
      </div>
      <div className="site-container brand-row">
        <Link href="/" className="brand-link" aria-label="IBAA home">
          <img src={media.wordmark} alt="International Buddhist Association of America" />
        </Link>
        <Button
          type="button"
          variant="outline"
          className="menu-button"
          aria-expanded={open}
          aria-controls="primary-navigation"
          onClick={() => { setOpen(value => !value); setSignupOpen(false); }}
        >
          {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
          <span>{open ? "Close" : "Menu"}</span>
        </Button>
        <nav
          id="primary-navigation"
          aria-label="Primary navigation"
          className={open ? "primary-nav is-open" : "primary-nav"}
        >
          {primaryLinks.map(([label, href]) => {
            const active = location === href || (href !== "/" && location.startsWith(`${href}/`));
            return (
              <Link
                key={href}
                href={href}
                className={active ? "nav-link is-active" : "nav-link"}
                onClick={closeNavigation}
                aria-current={active ? "page" : undefined}
              >
                {label}
              </Link>
            );
          })}
          <div className="nav-signup" ref={signupRef}
            onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setSignupOpen(false); }}
            onKeyDown={event => {
              if (event.key === "Escape") { event.preventDefault(); setSignupOpen(false); signupButtonRef.current?.focus(); }
            }}>
            <button type="button" ref={signupButtonRef}
              className={location === "/join" ? "nav-link nav-disclosure is-active" : "nav-link nav-disclosure"}
              aria-expanded={signupOpen} aria-controls="signup-navigation"
              onClick={() => setSignupOpen(value => !value)}>Sign up <ChevronDown aria-hidden="true" /></button>
            <div id="signup-navigation" className="nav-dropdown" hidden={!signupOpen}>
              <Link href="/join" onClick={closeNavigation}>Membership</Link>
            </div>
          </div>
          <Link href="/donate" className={location === "/donate" ? "nav-link nav-donate is-active" : "nav-link nav-donate"} onClick={closeNavigation} aria-current={location === "/donate" ? "page" : undefined}>Donate</Link>
          <a href="/temple-outreach#buddha-map" className="nav-link" onClick={closeNavigation}>Buddha Map</a>
        </nav>
      </div>
    </header>
  );
}
