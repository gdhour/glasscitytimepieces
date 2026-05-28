import Image from "next/image";
import { collectionWatches } from "../collectionWatches";

export default function CollectionPage() {
  return (
    <main>
      <section className="border-b border-[var(--border)] bg-[var(--surface)] py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <p className="text-[11px] font-medium uppercase tracking-[0.35em] text-[var(--bronze)]">
            Personal collection
          </p>
          <div className="mt-4 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="max-w-3xl font-[family-name:var(--font-cormorant)] text-4xl font-light leading-tight text-[var(--foreground)] sm:text-5xl">
                Watches currently in my rotation
              </h1>
              <p className="mt-5 max-w-2xl text-sm leading-relaxed text-[var(--steel)] sm:text-base">
                Full reference details and photo sets for the pieces I have
                selected personally.
              </p>
            </div>
            <a
              href="https://calendar.app.google/CbYQvnCDFULo9PNx7"
              target="_blank"
              rel="noreferrer"
              className="btn-bronze inline-flex w-fit rounded-sm px-5 py-3 text-sm font-medium"
            >
              Schedule via Google Meet
            </a>
          </div>
        </div>
      </section>

      <section className="bg-[var(--background)] py-16 sm:py-24">
        <div className="mx-auto max-w-7xl space-y-20 px-5 sm:space-y-24 sm:px-8">
          {collectionWatches.map((watch, watchIndex) => {
            const heroPhoto = watch.photos[watch.heroPhoto];
            const supportingPhotos = watch.photos.filter(
              (_, photoIndex) => photoIndex !== watch.heroPhoto,
            );

            return (
              <article
                key={`${watch.brand}-${watch.reference}`}
                className="border-t border-[var(--border)] pt-10 first:border-t-0 first:pt-0"
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                  <div>
                    <p className="text-[11px] font-medium uppercase tracking-[0.35em] text-[var(--bronze)]">
                      {watch.brand}
                    </p>
                    <h2 className="mt-3 max-w-3xl font-[family-name:var(--font-cormorant)] text-3xl font-light tracking-tight text-[var(--foreground)] sm:text-4xl">
                      {watch.model}
                    </h2>
                  </div>
                  <p className="max-w-xl text-sm leading-relaxed text-[var(--muted)]">
                    Reference number {watch.reference}. {watch.description}
                  </p>
                </div>

                <div className="mt-10 grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)]">
                  <figure className="surface-card overflow-hidden rounded-sm">
                    <Image
                      src={heroPhoto.src}
                      alt={heroPhoto.alt}
                      width={heroPhoto.width}
                      height={heroPhoto.height}
                      sizes="(min-width: 1024px) 54vw, 100vw"
                      className={`${heroPhoto.className} h-full w-full object-cover`}
                      priority={watchIndex === 0}
                    />
                  </figure>

                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-1">
                    {supportingPhotos.map((photo) => (
                      <figure
                        key={photo.src}
                        className="surface-card overflow-hidden rounded-sm"
                      >
                        <Image
                          src={photo.src}
                          alt={photo.alt}
                          width={photo.width}
                          height={photo.height}
                          sizes="(min-width: 1024px) 36vw, (min-width: 640px) 50vw, 100vw"
                          className={`${photo.className} h-full w-full object-cover`}
                        />
                      </figure>
                    ))}
                  </div>
                </div>

                <div className="mt-8 grid gap-px overflow-hidden rounded-sm border border-[var(--border)] bg-[var(--border)] sm:grid-cols-3">
                  {[
                    { label: "Brand", value: watch.brand },
                    { label: "Model", value: watch.model },
                    { label: "Reference", value: watch.reference },
                  ].map(({ label, value }) => (
                    <div key={label} className="bg-[var(--surface-elevated)] p-5">
                      <p className="text-[10px] uppercase tracking-[0.22em] text-[var(--muted)]">
                        {label}
                      </p>
                      <p className="mt-2 text-sm font-medium text-[var(--steel-bright)]">
                        {value}
                      </p>
                    </div>
                  ))}
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}
