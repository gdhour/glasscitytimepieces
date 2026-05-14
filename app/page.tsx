export default function Home() {
  return (
    <main className="relative flex flex-1 flex-col items-center justify-center overflow-hidden bg-[radial-gradient(ellipse_at_center,rgba(60,45,28,0.35)_0%,transparent_55%),linear-gradient(180deg,#1a120c_0%,#0f0c09_100%)] px-6 py-16 text-center">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
        aria-hidden
      />
      <p className="font-[family-name:var(--font-cinzel)] text-xs uppercase tracking-[0.45em] text-[#a89070]">
        Est. 1887 — London below
      </p>
      <h1 className="mt-4 max-w-2xl font-[family-name:var(--font-cinzel)] text-4xl font-semibold leading-tight tracking-tight text-[#f4e4bc] sm:text-5xl">
        Mir built this.
      </h1>
      <p className="mt-6 max-w-md text-sm leading-relaxed text-[#c4b49a]">
        Where mainsprings meet myth — bespoke pocket chronometers and wrist
        apparatus for the discerning airship captain.
      </p>

      <div className="mt-20 w-full max-w-3xl space-y-12 border-t border-[#3d2e1a] pt-12 text-left">
        <section id="collections" className="scroll-mt-28">
          <h2 className="font-[family-name:var(--font-cinzel)] text-sm font-semibold uppercase tracking-[0.25em] text-[#c9a227]">
            Collections
          </h2>
          <p className="mt-2 text-sm text-[#a89070]">
            Lever sets, marine chronometers, and limited dirigibles editions.
          </p>
        </section>
        <section id="timepieces" className="scroll-mt-28">
          <h2 className="font-[family-name:var(--font-cinzel)] text-sm font-semibold uppercase tracking-[0.25em] text-[#c9a227]">
            Timepieces
          </h2>
          <p className="mt-2 text-sm text-[#a89070]">
            Pocket watches and wrist apparatus tuned by our horologists.
          </p>
        </section>
        <section id="workshop" className="scroll-mt-28">
          <h2 className="font-[family-name:var(--font-cinzel)] text-sm font-semibold uppercase tracking-[0.25em] text-[#c9a227]">
            Workshop
          </h2>
          <p className="mt-2 text-sm text-[#a89070]">
            Repairs, oiling, and custom engravings on brass case work.
          </p>
        </section>
        <section id="visit" className="scroll-mt-28">
          <h2 className="font-[family-name:var(--font-cinzel)] text-sm font-semibold uppercase tracking-[0.25em] text-[#c9a227]">
            Visit
          </h2>
          <p className="mt-2 text-sm text-[#a89070]">
            By appointment — follow the brass railings beneath Platform Nine.
          </p>
        </section>
      </div>
    </main>
  );
}