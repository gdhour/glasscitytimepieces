import Image from "next/image";
import Link from "next/link";
import {
  collectionWatches,
  currentInventoryWatches,
  inventoryStatusContent,
  legacyInventoryWatches,
} from "./collectionWatches";
import ClockQuadrantNav from "./components/ClockQuadrantNav";
import InventoryStatusBadge from "./components/InventoryStatusBadge";

const rotatingWatches = [
  ...currentInventoryWatches.map((watch) => ({
    brand: watch.brand,
    model: watch.model,
    category: inventoryStatusContent[watch.inventoryStatus].badge,
    href: "/current-inventory",
    photo: watch.photos[watch.heroPhoto],
  })),
  ...collectionWatches.map((watch) => ({
    brand: watch.brand,
    model: watch.model,
    category: "Personal collection",
    href: "/personal-collection",
    photo: watch.photos[watch.heroPhoto],
  })),
  ...legacyInventoryWatches.map((watch) => ({
    brand: watch.brand,
    model: watch.model,
    category: "Legacy inventory",
    href: "/legacy-inventory",
    photo: watch.image,
  })),
] as const;

const rotatingGallery = [...rotatingWatches, ...rotatingWatches] as const;

export default function Home() {
  return (
    <main>
      <section className="relative overflow-hidden border-b border-[var(--border)]">
        <div
          className="guilloche pointer-events-none absolute inset-0 opacity-60"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_55%_at_50%_-5%,var(--glow-purple)_0%,transparent_55%),radial-gradient(ellipse_40%_35%_at_85%_15%,var(--glow-bronze)_0%,transparent_50%),linear-gradient(180deg,var(--surface)_0%,var(--background)_100%)]"
          aria-hidden
        />
        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 pb-16 pt-10 sm:px-8 sm:pb-20 sm:pt-14 lg:grid-cols-[minmax(0,0.92fr)_minmax(260px,0.56fr)] lg:gap-16 lg:pb-24 lg:pt-16 xl:grid-cols-[minmax(0,0.9fr)_360px]">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.35em] text-[var(--bronze)]">
              Personally curated · Toledo, Ohio
            </p>
            <h1 className="mt-5 max-w-xl font-[family-name:var(--font-cormorant)] text-4xl font-light leading-[1.08] tracking-tight text-[var(--foreground)] sm:text-5xl lg:text-6xl">
              Uncommon pieces, chosen with intention.
            </h1>
            <p className="mt-6 max-w-lg text-base leading-relaxed text-[var(--steel)] sm:text-lg">
              Glass City Timepieces brings current availability, personal
              collection notes, legacy archive pieces, and concierge guidance
              into one focused point of view.
            </p>
          </div>

          <div className="relative flex justify-center lg:justify-end">
            <div
              className="pointer-events-none absolute left-1/2 top-1/2 h-[80%] w-[80%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,var(--glow-purple)_0%,transparent_68%)] opacity-70 blur-2xl"
              aria-hidden
            />
            <ClockQuadrantNav />
          </div>
        </div>
      </section>

      <section
        className="overflow-hidden border-b border-[var(--border)] py-16 sm:py-20"
      >
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.35em] text-[var(--bronze)]">
                Across the collection
              </p>
              <h2 className="mt-3 font-[family-name:var(--font-cormorant)] text-3xl font-light tracking-tight text-[var(--foreground)] sm:text-4xl">
                Current, personal, and legacy pieces in motion.
              </h2>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/personal-collection" className="text-sm text-[var(--bronze)] hover:text-[var(--bronze-soft)]">
                Personal collection
              </Link>
              <Link href="/legacy-inventory" className="text-sm text-[var(--bronze)] hover:text-[var(--bronze-soft)]">
                Legacy inventory
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-10 overflow-hidden">
          <div className="watch-gallery-track flex w-max gap-4 px-5 sm:px-8">
            {rotatingGallery.map((watch, index) => (
              <Link
                href={watch.href}
                key={`${watch.category}-${watch.brand}-${watch.model}-${index}`}
                className="surface-card group w-[72vw] shrink-0 overflow-hidden rounded-sm sm:w-[22rem]"
              >
                <Image
                  src={watch.photo.src}
                  alt={watch.photo.alt}
                  width={watch.photo.width}
                  height={watch.photo.height}
                  sizes="(min-width: 640px) 22rem, 72vw"
                  className={`${watch.photo.className} w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]`}
                />
                <div className="p-5">
                  <p className="text-[10px] uppercase tracking-[0.22em] text-[var(--bronze)]">
                    {watch.category}
                  </p>
                  <h3 className="mt-2 font-[family-name:var(--font-cormorant)] text-2xl font-light leading-tight text-[var(--foreground)]">
                    {watch.brand}
                  </h3>
                  <p className="mt-1 text-sm text-[var(--muted)]">
                    {watch.model}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section
        id="current-inventory"
        className="scroll-mt-24 border-b border-[var(--border)] bg-[var(--surface)] py-16 sm:py-20"
      >
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.35em] text-[var(--bronze)]">
                Current inventory
              </p>
              <h2 className="mt-3 font-[family-name:var(--font-cormorant)] text-3xl font-light tracking-tight text-[var(--foreground)] sm:text-4xl">
                Available now
              </h2>
              <p className="mt-4 max-w-2xl text-sm leading-relaxed text-[var(--muted)]">
                {inventoryStatusContent.current.disclosure}
              </p>
            </div>
            <Link
              href="/current-inventory"
              className="inline-flex w-fit rounded-sm border border-[var(--border-strong)] px-5 py-3 text-sm font-medium text-[var(--foreground)] transition-colors hover:bg-[var(--purple)]/25"
            >
              View current page
            </Link>
          </div>

          <div className="mt-10 space-y-8">
            {currentInventoryWatches.map((watch, watchIndex) => {
              const heroPhoto = watch.photos[watch.heroPhoto];
              const supportingPhotos = watch.photos
                .filter((_, photoIndex) => photoIndex !== watch.heroPhoto)
                .slice(0, 4);

              return (
                <article
                  key={`${watch.brand}-${watch.reference}`}
                  className="surface-card grid overflow-hidden rounded-sm lg:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)]"
                >
                  <div>
                    <Image
                      src={heroPhoto.src}
                      alt={heroPhoto.alt}
                      width={heroPhoto.width}
                      height={heroPhoto.height}
                      sizes="(min-width: 1024px) 58vw, 100vw"
                      className="aspect-[4/5] w-full object-cover sm:aspect-[16/11] lg:aspect-[4/5]"
                      priority={watchIndex === 0}
                    />
                    <div className="grid grid-cols-2 gap-px border-t border-[var(--border)] bg-[var(--border)] sm:grid-cols-4">
                      {supportingPhotos.map((photo) => (
                        <Image
                          key={photo.src}
                          src={photo.src}
                          alt={photo.alt}
                          width={photo.width}
                          height={photo.height}
                          sizes="(min-width: 1024px) 15vw, 50vw"
                          className="aspect-square w-full object-cover"
                        />
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col p-6 sm:p-8 lg:p-10">
                    <InventoryStatusBadge status={watch.inventoryStatus} />
                    <p className="mt-5 text-[11px] font-medium uppercase tracking-[0.22em] text-[var(--bronze)]">
                      {watch.brand}
                    </p>
                    <h3 className="mt-2 font-[family-name:var(--font-cormorant)] text-3xl font-light leading-tight text-[var(--foreground)]">
                      {watch.model}
                    </h3>
                    <p className="mt-3 text-sm font-medium tracking-wide text-[var(--steel-bright)]">
                      {watch.reference}
                    </p>
                    <p className="mt-5 text-sm leading-relaxed text-[var(--muted)]">
                      {watch.description}
                    </p>
                    <p className="mt-5 rounded-sm border border-[var(--border-strong)] bg-[var(--surface-elevated)] p-4 text-sm leading-relaxed text-[var(--steel-bright)]">
                      {watch.availabilityNote ??
                        inventoryStatusContent[watch.inventoryStatus].disclosure}
                    </p>
                    <ul className="mt-6 grid gap-3 border-t border-[var(--border)] pt-6 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                      {watch.details.map((detail) => (
                        <li
                          key={detail}
                          className="text-xs leading-relaxed text-[var(--steel-bright)]"
                        >
                          {detail}
                        </li>
                      ))}
                    </ul>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

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
              Each watch earned its place for dial character, movement story,
              proportions on the wrist, or because it does something better than
              its peers. I do not chase volume. I build a collection I would
              stand behind in a room of serious collectors.
            </p>
          </div>
        </div>
      </section>

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
                I offer concierge guidance for collectors who want a specific
                reference, a first serious purchase, or a discreet exit from
                something that no longer fits the rotation.
              </p>
              <div className="mt-8 grid gap-px overflow-hidden rounded-sm border border-[var(--border)] bg-[var(--border)] sm:grid-cols-3">
                {[
                  { label: "Call", value: "419-975-9754", href: "tel:+14199759754" },
                  {
                    label: "Email",
                    value: "info@glasscitytimepieces.com",
                    href: "mailto:info@glasscitytimepieces.com?subject=Concierge%20inquiry",
                  },
                  {
                    label: "Google Meet",
                    value: "Schedule time",
                    href: "https://calendar.app.google/CbYQvnCDFULo9PNx7",
                  },
                ].map(({ label, value, href }) => (
                  <a
                    key={label}
                    href={href}
                    target={href.startsWith("https://") ? "_blank" : undefined}
                    rel={href.startsWith("https://") ? "noreferrer" : undefined}
                    className="bg-[var(--surface-elevated)] p-5 transition-colors hover:bg-[var(--purple)]/25"
                  >
                    <span className="block text-[10px] uppercase tracking-[0.22em] text-[var(--muted)]">
                      {label}
                    </span>
                    <span className="mt-2 block break-words text-sm font-medium text-[var(--steel-bright)]">
                      {value}
                    </span>
                  </a>
                ))}
              </div>
            </div>
            <ul className="space-y-6">
              {[
                {
                  title: "Sourcing and acquisition",
                  description:
                    "Reference-focused help finding the right piece, weighing alternatives, and knowing when patience is smarter than forcing a buy.",
                },
                {
                  title: "First serious watch guidance",
                  description:
                    "A low-pressure way to learn sizing, movements, service realities, and what actually makes sense as a first meaningful mechanical watch.",
                },
                {
                  title: "Authentication and due diligence",
                  description:
                    "A second set of eyes on photos, paperwork, seller quality, and the questions worth asking before committing real money.",
                },
                {
                  title: "Trade and placement",
                  description:
                    "Thoughtful advice on what to move, what to keep, and how to exit a watch cleanly when it no longer belongs in the rotation.",
                },
              ].map(({ title, description }) => (
                <li
                  key={title}
                  className="border-l border-[var(--border-strong)] pl-6"
                >
                  <h3 className="text-sm font-medium text-[var(--foreground)]">
                    {title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
                    {description}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

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
              The Glass City built America&apos;s glass and machine-tool
              industries on tolerances measured in microns. That heritage
              informs how I run this practice.
            </p>
          </div>
        </div>
      </section>

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
                  Consultations happen by appointment over Google Meet. I will
                  walk you through what is available, answer questions in depth,
                  and send detail photos afterward if helpful.
                </p>
                <div className="mt-6 space-y-3 text-sm text-[var(--steel)]">
                  <p className="text-[var(--foreground)]">Glass City Timepieces</p>
                  <p>Based in Toledo, Ohio · serving collectors nationwide</p>
                  <p>
                    <a href="mailto:info@glasscitytimepieces.com" className="text-[var(--bronze)] hover:text-[var(--bronze-soft)]">
                      info@glasscitytimepieces.com
                    </a>
                  </p>
                  <p>
                    <a href="tel:+14199759754" className="text-[var(--bronze)] hover:text-[var(--bronze-soft)]">
                      419-975-9754
                    </a>
                  </p>
                </div>
                <a
                  href="https://calendar.app.google/CbYQvnCDFULo9PNx7"
                  target="_blank"
                  rel="noreferrer"
                  className="btn-bronze mt-8 inline-flex rounded-sm px-6 py-3 text-sm font-medium"
                >
                  Schedule via Google Meet
                </a>
              </div>
              <div className="guilloche relative min-h-[280px] bg-[linear-gradient(135deg,var(--purple-deep)_0%,var(--background)_50%,var(--purple)_100%)] p-8 sm:p-12">
                <blockquote className="relative font-[family-name:var(--font-cormorant)] text-2xl font-light leading-snug text-[var(--foreground)] sm:text-3xl">
                  &ldquo;Uncommon references, each chosen for a reason. Take the
                  time you need; there is no rush on the call.&rdquo;
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
