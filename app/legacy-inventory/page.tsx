import Image from "next/image";
import { legacyInventoryWatches } from "../collectionWatches";

export default function LegacyInventoryPage() {
  return (
    <main>
      <section className="border-b border-[var(--border)] bg-[var(--surface)] py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <p className="text-[11px] font-medium uppercase tracking-[0.35em] text-[var(--bronze)]">
            Legacy inventory
          </p>
          <h1 className="mt-4 max-w-3xl font-[family-name:var(--font-cormorant)] text-4xl font-light leading-tight text-[var(--foreground)] sm:text-5xl">
            Pieces that have passed through the collection.
          </h1>
          <p className="mt-5 max-w-2xl text-sm leading-relaxed text-[var(--steel)] sm:text-base">
            An archive of references previously held, studied, placed, or used
            to shape the point of view behind Glass City Timepieces.
          </p>
        </div>
      </section>

      <section className="bg-[var(--background)] py-16 sm:py-24">
        <div className="mx-auto max-w-7xl space-y-8 px-5 sm:px-8">
          {legacyInventoryWatches.map((watch) => (
            <article
              key={`${watch.brand}-${watch.model}`}
              className="surface-card grid overflow-hidden rounded-sm lg:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)]"
            >
              <Image
                src={watch.image.src}
                alt={watch.image.alt}
                width={watch.image.width}
                height={watch.image.height}
                sizes="(min-width: 1024px) 54vw, 100vw"
                className={`${watch.image.className} h-full w-full object-cover`}
              />
              <div className="flex flex-col justify-center p-6 sm:p-8 lg:p-10">
                <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-[var(--bronze)]">
                  {watch.brand}
                </p>
                <h2 className="mt-3 font-[family-name:var(--font-cormorant)] text-3xl font-light leading-tight text-[var(--foreground)]">
                  {watch.model}
                </h2>
                <p className="mt-3 text-sm font-medium tracking-wide text-[var(--steel-bright)]">
                  {watch.reference}
                </p>
                <p className="mt-5 text-sm leading-relaxed text-[var(--muted)]">
                  {watch.description}
                </p>
                <dl className="mt-8 grid gap-4 border-t border-[var(--border)] pt-6 sm:grid-cols-2">
                  <div>
                    <dt className="text-[10px] uppercase tracking-[0.22em] text-[var(--muted)]">
                      Status
                    </dt>
                    <dd className="mt-2 text-sm font-medium text-[var(--steel-bright)]">
                      Legacy piece
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[10px] uppercase tracking-[0.22em] text-[var(--muted)]">
                      Category
                    </dt>
                    <dd className="mt-2 text-sm font-medium text-[var(--steel-bright)]">
                      {watch.category}
                    </dd>
                  </div>
                </dl>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
