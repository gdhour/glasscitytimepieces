import Link from "next/link";
import BrandLogo from "./BrandLogo";

const links = [
  { href: "/#collection", label: "Collection" },
  { href: "/#concierge", label: "Concierge" },
  { href: "/#heritage", label: "Heritage" },
  { href: "/#visit", label: "Consult" },
] as const;

export default function SiteNav() {
  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[rgba(3,3,4,0.9)] backdrop-blur-xl">
      <nav
        className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-5 py-3 sm:px-8"
        aria-label="Main"
      >
        <BrandLogo size="sm" />

        <ul className="hidden items-center gap-1 md:flex">
          {links.map(({ href, label }) => (
            <li key={href}>
              <Link
                href={href}
                className="rounded-sm px-4 py-2 text-[13px] font-medium tracking-wide text-[var(--steel)] transition-colors hover:text-[var(--bronze-soft)]"
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          <Link
            href="/#visit"
            className="btn-bronze hidden rounded-sm px-4 py-2 text-[13px] font-medium transition-opacity sm:inline-block"
          >
            Book a video call
          </Link>
          <details className="relative md:hidden">
            <summary className="list-none cursor-pointer rounded-sm border border-[var(--border)] bg-[var(--surface-elevated)] px-3 py-2 text-[13px] font-medium text-[var(--steel)] [&::-webkit-details-marker]:hidden">
              Menu
            </summary>
            <ul className="absolute right-0 mt-2 min-w-[10rem] rounded-sm border border-[var(--border)] bg-[var(--surface-elevated)] py-2 shadow-2xl shadow-black/50">
              {links.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="block px-4 py-2.5 text-sm text-[var(--steel)] hover:bg-[var(--purple)]/30 hover:text-[var(--foreground)]"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </details>
        </div>
      </nav>
    </header>
  );
}
