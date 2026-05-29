"use client";

import { useState } from "react";
import Link from "next/link";
import BrandLogo from "./BrandLogo";

const links = [
  { href: "/personal-collection", label: "Personal Collection" },
  { href: "/current-inventory", label: "Current Inventory" },
  { href: "/legacy-inventory", label: "Legacy Inventory" },
  { href: "/#concierge", label: "Concierge Services" },
] as const;

export default function SiteNav() {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[rgba(3,3,4,0.9)] backdrop-blur-xl">
      <nav
        className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-5 py-2 sm:px-8"
        aria-label="Main"
      >
        <BrandLogo size="sm" />

        <ul className="hidden items-center gap-1 lg:flex">
          {links.map(({ href, label }) => (
            <li key={href}>
              <Link
                href={href}
                className="rounded-sm px-3 py-2 text-[11px] font-medium uppercase tracking-[0.18em] text-[var(--steel)] transition-colors hover:text-[var(--bronze-soft)]"
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          <Link
            href="/#visit"
            onClick={closeMenu}
            className="hidden rounded-sm border border-[var(--border-strong)] px-4 py-2 text-[12px] font-medium text-[var(--foreground)] transition-colors hover:bg-[var(--purple)]/25 sm:inline-block"
          >
            Private consultation
          </Link>
          <div className="relative lg:hidden">
            <button
              type="button"
              aria-controls="mobile-menu"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((open) => !open)}
              className="rounded-sm border border-[var(--border)] bg-[var(--surface-elevated)] px-3 py-2 text-[13px] font-medium text-[var(--steel)] transition-colors hover:text-[var(--foreground)]"
            >
              {menuOpen ? "Close" : "Menu"}
            </button>
            {menuOpen ? (
              <ul
                id="mobile-menu"
                className="absolute right-0 mt-2 min-w-[15rem] rounded-sm border border-[var(--border)] bg-[var(--surface-elevated)] py-2 shadow-2xl shadow-black/50"
              >
                {links.map(({ href, label }) => (
                  <li key={href}>
                    <Link
                      href={href}
                      onClick={closeMenu}
                      className="block px-4 py-2.5 text-sm text-[var(--steel)] hover:bg-[var(--purple)]/30 hover:text-[var(--foreground)]"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </div>
      </nav>
    </header>
  );
}
