import Link from "next/link";
import BrandLogo from "./BrandLogo";

export default function Footer() {
  return (
    <footer className="border-t border-[var(--border)] bg-[var(--surface)]">
      <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
            <BrandLogo size="sm" linked={false} />
            <p className="max-w-sm text-sm leading-relaxed text-[var(--muted)]">
              Watches that tell stories and reflect your passions — curated in
              Toledo, consultations via Google Meet.
            </p>
          </div>
          <nav
            className="flex flex-wrap gap-x-8 gap-y-2 text-sm text-[var(--steel)]"
            aria-label="Footer"
          >
            <Link
              href="/personal-collection"
              className="inline-flex min-h-[48px] items-center transition-colors hover:text-[var(--bronze-soft)]"
            >
              Personal Collection
            </Link>
            <Link
              href="/current-inventory"
              className="inline-flex min-h-[48px] items-center transition-colors hover:text-[var(--bronze-soft)]"
            >
              Current Inventory
            </Link>
            <Link
              href="/legacy-inventory"
              className="inline-flex min-h-[48px] items-center transition-colors hover:text-[var(--bronze-soft)]"
            >
              Legacy Inventory
            </Link>
            <Link
              href="/#concierge"
              className="inline-flex min-h-[48px] items-center transition-colors hover:text-[var(--bronze-soft)]"
            >
              Concierge Services
            </Link>
            <a
              href="https://www.instagram.com/glasscitytimepieces/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-[48px] items-center gap-1.5 transition-colors hover:text-[var(--bronze-soft)]"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <rect x="2" y="2" width="20" height="20" rx="5" />
                <circle cx="12" cy="12" r="4.2" />
                <circle cx="17.6" cy="6.4" r="0.6" fill="currentColor" stroke="none" />
              </svg>
              Instagram
            </a>
          </nav>
        </div>
        <p className="mt-10 text-xs tracking-wide text-[var(--muted)]">
          © {new Date().getFullYear()} Glass City Timepieces. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
