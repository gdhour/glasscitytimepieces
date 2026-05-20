import Link from "next/link";
import BrandLogo from "./components/BrandLogo";

const featuredWatches = [
  {
    brand: "Grand Seiko",
    model: "Heritage Collection SBGH281",
    detail: "Hi-beat · 40mm · Champagne dial",
    price: "$6,400",
    note: "Kept for its Zaratsu polish and quiet confidence — the kind of dress watch that disappears until light hits the dial.",
    accent: "from-[var(--purple-deep)] via-[var(--purple)] to-[var(--background)]",
  },
  {
    brand: "Omega",
    model: "Speedmaster Professional",
    detail: "Manual-wind chronograph · 42mm",
    price: "$7,600",
    note: "A reference I return to often — not because it is famous, but because the proportions still feel correct decades later.",
    accent: "from-[var(--purple-deep)] via-[var(--purple-mid)] to-[var(--background)]",
  },
  {
    brand: "Tudor",
    model: "Black Bay Fifty-Eight",
    detail: "In-house MT5402 · 39mm",
    price: "$4,225",
    note: "Sized for real wrists. In the collection as proof that modern tool watches can still feel deliberate, not generic.",
    accent: "from-[#1a1028] via-[var(--purple)] to-[var(--background)]",
  },
] as const;

function WatchDial({ className }: { className?: string }) {
  return (
    <div
      className={`guilloche relative aspect-square w-full overflow-hidden rounded-full border border-[var(--border-strong)] shadow-[inset_0_2px_24px_rgba(0,0,0,0.6),0_0_20px_var(--glow-purple)] ${className ?? ""}`}
    >
      <div className="absolute inset-[18%] rounded-full border border-[var(--border)]" />
      <div className="absolute inset-[32%] rounded-full border border-white/[0.04]" />
      <div className="absolute left-1/2 top-1/2 h-[2px] w-[38%] origin-left -translate-y-1/2 bg-gradient-to-r from-[var(--bronze)] to-transparent" />
      <div className="absolute left-1/2 top-1/2 h-[1px] w-[28%] origin-left -translate-y-1/2 rotate-[55deg] bg-[var(--bronze-soft)]/40" />
      <div className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--bronze)] shadow-[0_0_12px_var(--glow-bronze)]" />
    </div>
  );
}

function FeaturedCard({
  brand,
  model,
  detail,
  price,
  note,
  accent,
}: (typeof featuredWatches)[number]) {
  return (
    <article className="surface-card group flex flex-col overflow-hidden rounded-sm transition-colors hover:border-[var(--border-strong)]">
      <div className={`relative flex items-center justify-center bg-gradient-to-br ${accent} p-10`}>
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.04)_0%,transparent_50%)]" />
        <div className="w-[55%] max-w-[200px]">
          <WatchDial className="bg-gradient-to-br from-[var(--purple-mid)] to-[var(--purple-deep)] transition-transform duration-500 group-hover:scale-[1.02]" />
        </div>
      </div>
      <div className="flex flex-1 flex-col p-6">
        <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-[var(--bronze)]">
          {brand}
        </p>
        <h3 className="mt-2 font-[family-name:var(--font-cormorant)] text-xl font-light leading-snug text-[var(--foreground)]">
          {model}
        </h3>
        <p className="mt-2 text-sm text-[var(--muted)]">{detail}</p>
        <p className="mt-4 text-sm leading-relaxed text-[var(--steel)] italic">
          {note}
        </p>
        <p className="mt-6 text-sm font-medium tracking-wide text-[var(--steel-bright)]">
          {price}
        </p>
      </div>
    </article>
  );
}

export default function Home() {
  return (
    <main>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-[var(--border)]">
        <div
          className="guilloche pointer-events-none absolute inset-0 opacity-60"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_55%_at_50%_-5%,var(--glow-purple)_0%,transparent_55%),radial-gradient(ellipse_40%_35%_at_85%_15%,var(--glow-bronze)_0%,transparent_50%),linear-gradient(180deg,var(--surface)_0%,var(--background)_100%)]"
          aria-hidden
        />
        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 pb-20 pt-10 sm:px-8 sm:pb-28 sm:pt-14 lg:grid-cols-[1fr_minmax(280px,42%)] lg:gap-16 lg:pb-32 lg:pt-16 xl:grid-cols-[1fr_460px]">
          <div className="relative order-1 flex w-full justify-center px-2 sm:px-0 lg:order-2 lg:w-auto lg:justify-end lg:px-0">
            <div
              className="pointer-events-none absolute left-1/2 top-1/2 h-[85%] w-[90%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,var(--glow-purple)_0%,transparent_68%)] opacity-80 blur-2xl"
              aria-hidden
            />
            <div
              className="pointer-events-none absolute left-1/2 top-[55%] h-[50%] w-[70%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,var(--glow-bronze)_0%,transparent_70%)] opacity-50 blur-xl"
              aria-hidden
            />
            <BrandLogo
              size="hero"
              linked={false}
              className="relative z-10 drop-shadow-[0_24px_48px_rgba(0,0,0,0.55)]"
            />
          </div>

          <div className="order-2 lg:order-1">
          <p className="text-[11px] font-medium uppercase tracking-[0.35em] text-[var(--bronze)]">
            Personally curated · Toledo, Ohio
          </p>
          <h1 className="mt-5 max-w-xl font-[family-name:var(--font-cormorant)] text-4xl font-light leading-[1.08] tracking-tight text-[var(--foreground)] sm:text-5xl lg:text-6xl">
            Uncommon pieces, chosen with intention.
          </h1>
          <p className="mt-6 max-w-lg text-base leading-relaxed text-[var(--steel)] sm:text-lg">
            Glass City Timepieces is my curated collection — uncommon references
            you will not find on every forum thread. Review pieces with me over
            Google Meet or Zoom, or ask how concierge guidance can help you find
            something equally considered.
          </p>
          <div className="mt-9 flex flex-wrap gap-4">
            <Link
              href="/#collection"
              className="btn-bronze inline-flex items-center rounded-sm px-6 py-3 text-sm font-medium"
            >
              Review the collection
            </Link>
            <Link
              href="/#concierge"
              className="inline-flex items-center rounded-sm border border-[var(--border)] bg-[var(--purple)]/20 px-6 py-3 text-sm font-medium text-[var(--foreground)] transition-colors hover:border-[var(--border-strong)] hover:bg-[var(--purple)]/35"
            >
              Concierge services
            </Link>
          </div>
          <dl className="mt-14 grid grid-cols-2 gap-6 border-t border-[var(--border)] pt-9 sm:grid-cols-4 sm:gap-8 lg:grid-cols-2 xl:grid-cols-4">
            {[
              { label: "Personally selected", value: "Every piece" },
              { label: "Focus", value: "Uncommon refs" },
              { label: "Concierge", value: "By request" },
              { label: "Consultations", value: "Meet · Zoom" },
            ].map(({ label, value }) => (
              <div key={label}>
                <dt className="text-[11px] uppercase tracking-[0.2em] text-[var(--muted)]">
                  {label}
                </dt>
                <dd className="mt-2 font-[family-name:var(--font-cormorant)] text-2xl font-light text-[var(--foreground)] sm:text-3xl">
                  {value}
                </dd>
              </div>
            ))}
          </dl>
          </div>
        </div>
      </section>

      {/* Curation philosophy */}
      <section className="border-b border-[var(--border)] py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-[11px] font-medium uppercase tracking-[0.35em] text-[var(--bronze)]">
              How I curate
            </p>
            <h2 className="mt-3 font-[family-name:var(--font-cormorant)] text-3xl font-light tracking-tight text-[var(--foreground)] sm:text-4xl">
              Nothing here is filler.
            </h2>
            <p className="mt-6 text-base leading-relaxed text-[var(--steel)]">
              Each watch in this collection earned its place — for dial character, movement
              story, proportions on the wrist, or simply because it does something
              better than its peers. I do not chase volume. I build a collection I
              would stand behind in any room of serious collectors, and I extend that
              same standard when I help you source yours.
            </p>
          </div>
          <ul className="mt-14 grid gap-6 sm:grid-cols-3">
            {[
              {
                title: "Intentional, not exhaustive",
                body: "A tight edit of uncommon references — pieces worth discussing, not scrolling past.",
              },
              {
                title: "Personal point of view",
                body: "Every example reflects taste I have lived with, not a buying algorithm or trend cycle.",
              },
              {
                title: "Virtual, by appointment",
                body: "Review the collection over Google Meet or Zoom — unhurried, from wherever you are, with no pressure to decide on the call.",
              },
            ].map(({ title, body }) => (
              <li
                key={title}
                className="surface-card rounded-sm p-8"
              >
                <h3 className="font-[family-name:var(--font-cormorant)] text-xl font-light text-[var(--foreground)]">
                  {title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-[var(--muted)]">
                  {body}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Collection */}
      <section id="collection" className="scroll-mt-24 border-b border-[var(--border)] bg-[var(--surface)] py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.35em] text-[var(--bronze)]">
                My collection
              </p>
              <h2 className="mt-3 font-[family-name:var(--font-cormorant)] text-3xl font-light tracking-tight text-[var(--foreground)] sm:text-4xl">
                Uncommon pieces on hand
              </h2>
            </div>
            <p className="max-w-md text-sm leading-relaxed text-[var(--muted)]">
              A snapshot of what I am holding now — each with a reason it belongs
              here. Availability changes; the standard does not.
            </p>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuredWatches.map((watch) => (
              <FeaturedCard key={watch.model} {...watch} />
            ))}
          </div>
          <p className="mt-10 text-center text-sm text-[var(--muted)]">
            The collection evolves as pieces find the right wrists.{" "}
            <Link href="/#visit" className="text-[var(--bronze)] hover:text-[var(--bronze-soft)]">
              Book a video consultation
            </Link>
          </p>
        </div>
      </section>

      {/* Concierge */}
      <section id="concierge" className="scroll-mt-24 py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.35em] text-[var(--bronze)]">
                Concierge
              </p>
              <h2 className="mt-3 font-[family-name:var(--font-cormorant)] text-3xl font-light tracking-tight text-[var(--foreground)] sm:text-4xl">
                The same eye I use for my collection, applied to yours.
              </h2>
              <p className="mt-6 text-base leading-relaxed text-[var(--steel)]">
                Not everyone needs a storefront — sometimes you need someone who
                has already done the homework. I offer concierge guidance for
                collectors who want a specific reference, a first serious purchase,
                or a discreet exit from something that no longer fits the rotation.
              </p>
              <Link
                href="mailto:hello@glasscitytimepieces.com?subject=Concierge%20inquiry"
                className="mt-8 inline-flex rounded-sm border border-[var(--border-strong)] px-6 py-3 text-sm font-medium text-[var(--foreground)] transition-colors hover:bg-[var(--purple)]/25"
              >
                Start a concierge conversation
              </Link>
            </div>
            <ul className="space-y-6">
              {[
                {
                  title: "Sourcing & acquisition",
                  body: "Tell me what you are looking for — era, complication, budget, wrist size — and I will search my network for pieces that meet the same bar as my own collection.",
                },
                {
                  title: "First serious watch guidance",
                  body: "For buyers stepping up from fashion watches or smartwatches: education without condescension, and recommendations you will still respect in five years.",
                },
                {
                  title: "Authentication & due diligence",
                  body: "Serial checks, service history, condition reports, and honest counsel before you commit — whether the watch is mine or sourced elsewhere.",
                },
                {
                  title: "Trade & placement",
                  body: "Discreet help moving a piece you have outgrown toward someone who will actually appreciate it, with transparent terms throughout.",
                },
              ].map(({ title, body }) => (
                <li
                  key={title}
                  className="border-l border-[var(--border-strong)] pl-6"
                >
                  <h3 className="text-sm font-medium text-[var(--foreground)]">
                    {title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
                    {body}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Heritage */}
      <section
        id="heritage"
        className="scroll-mt-24 border-y border-[var(--border)] bg-[var(--surface)] py-20 sm:py-28"
      >
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-[11px] font-medium uppercase tracking-[0.35em] text-[var(--bronze)]">
              Industrial heritage
            </p>
            <h2 className="mt-3 font-[family-name:var(--font-cormorant)] text-3xl font-light tracking-tight text-[var(--foreground)] sm:text-4xl">
              Toledo precision, a personal standard.
            </h2>
            <p className="mt-6 text-base leading-relaxed text-[var(--steel)]">
              The Glass City built America&apos;s glass and machine-tool industries on
              tolerances measured in microns. That heritage informs how I run this
              practice — brushed steel, calibrated movements, and a collection where
              every piece is placed with purpose, not volume.
            </p>
          </div>
          <div className="mt-14 grid gap-px overflow-hidden rounded-sm border border-[var(--border)] bg-[var(--border)] sm:grid-cols-3">
            {[
              {
                title: "Industrial discipline",
                body: "Toledo's factory floors valued measurement and repeatability — the same mindset I apply when evaluating a reference.",
              },
              {
                title: "Private, not retail",
                body: "No storefront — just focused video consultations to study dials, compare cases, and talk through what you are looking for.",
              },
              {
                title: "Collector-to-collector",
                body: "I speak caliber numbers and case profiles fluently — never down to you, always alongside you.",
              },
            ].map(({ title, body }) => (
              <div
                key={title}
                className="bg-[var(--surface-elevated)] p-8 sm:p-10"
              >
                <h3 className="font-[family-name:var(--font-cormorant)] text-xl font-light text-[var(--foreground)]">
                  {title}
                </h3>
                <p className="mt-4 text-sm leading-relaxed text-[var(--muted)]">
                  {body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Virtual consultation */}
      <section id="visit" className="scroll-mt-24 py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="overflow-hidden rounded-sm border border-[var(--border)] bg-gradient-to-br from-[var(--surface-elevated)] to-[var(--surface)]">
            <div className="grid lg:grid-cols-2">
              <div className="p-8 sm:p-12 lg:p-14">
                <p className="text-[11px] font-medium uppercase tracking-[0.35em] text-[var(--bronze)]">
                  Virtual consultation
                </p>
                <h2 className="mt-3 font-[family-name:var(--font-cormorant)] text-3xl font-light text-[var(--foreground)] sm:text-4xl">
                  Review the collection from anywhere.
                </h2>
                <p className="mt-4 text-sm leading-relaxed text-[var(--muted)]">
                  There is no physical storefront — consultations happen by
                  appointment over video. I will walk you through what is available,
                  answer questions in depth, and send detail photos afterward if
                  helpful.
                </p>
                <div className="mt-6 space-y-3 text-sm text-[var(--steel)]">
                  <p className="text-[var(--foreground)]">Glass City Timepieces</p>
                  <p>Based in Toledo, Ohio · serving collectors nationwide</p>
                  <p className="flex flex-wrap items-center gap-x-3 gap-y-1">
                    <span className="rounded-sm border border-[var(--border)] bg-[var(--purple)]/30 px-2.5 py-1 text-xs font-medium uppercase tracking-wider text-[var(--bronze-soft)]">
                      Google Meet
                    </span>
                    <span className="text-[var(--muted)]">or</span>
                    <span className="rounded-sm border border-[var(--border)] bg-[var(--purple)]/30 px-2.5 py-1 text-xs font-medium uppercase tracking-wider text-[var(--bronze-soft)]">
                      Zoom
                    </span>
                  </p>
                  <p className="pt-2">
                    <a
                      href="mailto:hello@glasscitytimepieces.com"
                      className="text-[var(--bronze)] hover:text-[var(--bronze-soft)]"
                    >
                      hello@glasscitytimepieces.com
                    </a>
                  </p>
                </div>
                <Link
                  href="mailto:hello@glasscitytimepieces.com?subject=Video%20consultation%20request"
                  className="btn-bronze mt-8 inline-flex rounded-sm px-6 py-3 text-sm font-medium"
                >
                  Book a video consultation
                </Link>
              </div>
              <div className="guilloche relative min-h-[280px] bg-[linear-gradient(135deg,var(--purple-deep)_0%,var(--background)_50%,var(--purple)_100%)] p-8 sm:p-12">
                <div
                  className="absolute inset-0 opacity-40"
                  style={{
                    backgroundImage:
                      "repeating-linear-gradient(-12deg, transparent, transparent 40px, rgba(255,255,255,0.02) 40px, rgba(255,255,255,0.02) 41px)",
                  }}
                  aria-hidden
                />
                <blockquote className="relative font-[family-name:var(--font-cormorant)] text-2xl font-light leading-snug text-[var(--foreground)] sm:text-3xl">
                  &ldquo;Join me on a call and I will walk you through what I have
                  assembled — uncommon references, each chosen for a reason. Take
                  the time you need; there is no rush on the call.&rdquo;
                </blockquote>
                <p className="relative mt-6 text-sm text-[var(--muted)]">
                  — Glass City Timepieces
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
