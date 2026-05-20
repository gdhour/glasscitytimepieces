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
              Uncommon timepieces, curated in Toledo — consultations via Meet or
              Zoom.
            </p>
          </div>
          <nav
            className="flex flex-wrap gap-x-8 gap-y-2 text-sm text-[var(--steel)]"
            aria-label="Footer"
          >
            <Link
              href="/#collection"
              className="transition-colors hover:text-[var(--bronze-soft)]"
            >
              Collection
            </Link>
            <Link
              href="/#concierge"
              className="transition-colors hover:text-[var(--bronze-soft)]"
            >
              Concierge
            </Link>
            <Link
              href="/#heritage"
              className="transition-colors hover:text-[var(--bronze-soft)]"
            >
              Heritage
            </Link>
            <Link
              href="/#visit"
              className="transition-colors hover:text-[var(--bronze-soft)]"
            >
              Consult
            </Link>
          </nav>
        </div>
        <p className="mt-10 text-xs tracking-wide text-[var(--muted)]">
          © {new Date().getFullYear()} Glass City Timepieces. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
