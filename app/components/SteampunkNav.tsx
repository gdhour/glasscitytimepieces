import Link from "next/link";

function GearIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path d="M12 2v2.2l1.9.55.95-1.65 1.9 1.1-1 1.73 1.45 1.45 1.73-1 1.1 1.9-1.65.95L19.8 12H22v2h-2.2l-.55 1.9 1.65.95-1.1 1.9-1.73-1-1.45 1.45 1 1.73-1.9 1.1-.95-1.65L12 19.8V22h-2v-2.2l-1.9-.55-.95 1.65-1.9-1.1 1-1.73-1.45-1.45-1.73 1-1.1-1.9 1.65-.95L4.2 14H2v-2h2.2l.55-1.9-1.65-.95 1.1-1.9 1.73 1 1.45-1.45-1-1.73 1.9-1.1.95 1.65L10 4.2V2h2Zm0 6.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7Z" />
    </svg>
  );
}

const links = [
  { href: "/#collections", label: "Collections" },
  { href: "/#timepieces", label: "Timepieces" },
  { href: "/#workshop", label: "Workshop" },
  { href: "/#visit", label: "Visit" },
] as const;

export default function SteampunkNav() {
  return (
    <header className="sticky top-0 z-50 border-b-4 border-double border-[#b8860b] bg-[linear-gradient(180deg,#2a1f14_0%,#1a120c_45%,#0f0c09_100%)] shadow-[0_4px_24px_rgba(0,0,0,0.65),inset_0_1px_0_rgba(201,162,39,0.15)]">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(201,162,39,0.5),transparent)]"
        aria-hidden
      />
      <nav
        className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-3 sm:px-6"
        aria-label="Main"
      >
        <Link
          href="/"
          className="group flex items-center gap-2 text-[#f4e4bc] transition-colors hover:text-[#ffd76a]"
        >
          <GearIcon className="h-7 w-7 shrink-0 text-[#c9a227] transition-transform group-hover:rotate-45" />
          <div className="flex flex-col leading-tight">
            <span className="font-[family-name:var(--font-cinzel)] text-lg font-semibold tracking-[0.2em] sm:text-xl">
              BRASS &amp; TICK
            </span>
            <span className="font-mono text-[10px] uppercase tracking-[0.35em] text-[#a89070]">
              Steam chronometers
            </span>
          </div>
          <GearIcon className="hidden h-6 w-6 shrink-0 text-[#8b6914] opacity-80 sm:block" />
        </Link>

        <ul className="flex flex-wrap items-center justify-end gap-1 sm:gap-2">
          {links.map(({ href, label }) => (
            <li key={href}>
              <Link
                href={href}
                className="block rounded border border-transparent px-3 py-2 font-[family-name:var(--font-cinzel)] text-xs font-medium uppercase tracking-[0.18em] text-[#d4c4a8] transition-colors hover:border-[#6b5420] hover:bg-[rgba(201,162,39,0.08)] hover:text-[#ffd76a] sm:text-sm"
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div
        className="h-1 bg-[repeating-linear-gradient(90deg,#3d2e1a_0px,#3d2e1a_4px,#1a120c_4px,#1a120c_8px)] opacity-90"
        aria-hidden
      />
    </header>
  );
}
