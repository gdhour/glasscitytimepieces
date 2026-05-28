import Image from "next/image";
import { currentInventoryWatches } from "../collectionWatches";

export default function CurrentInventoryPage() {
  return (
    <main>
      <section className="border-b border-[var(--border)] bg-[var(--surface)] py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <p className="text-[11px] font-medium uppercase tracking-[0.35em] text-[var(--bronze)]">
            Current inventory
          </p>
          <h1 className="mt-4 max-w-3xl font-[family-name:var(--font-cormorant)] text-4xl font-light leading-tight text-[var(--foreground)] sm:text-5xl">
            Available now
          </h1>
        </div>
      </section>

      <section className="bg-[var(--background)] py-16 sm:py-24">
        <div className="mx-auto max-w-7xl space-y-20 px-5 sm:px-8">
          {currentInventoryWatches.map((watch, watchIndex) => {
            const heroPhoto = watch.photos[watch.heroPhoto];
            const supportingPhotos = watch.photos.filter(
              (_, photoIndex) => photoIndex !== watch.heroPhoto,
            );

            return (
              <article key={`${watch.brand}-${watch.reference}`}>
                <div className="grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)]">
                  <figure className="surface-card overflow-hidden rounded-sm">
                    <Image
                      src={heroPhoto.src}
                      alt={heroPhoto.alt}
                      width={heroPhoto.width}
                      height={heroPhoto.height}
                      sizes="(min-width: 1024px) 54vw, 100vw"
                      className="aspect-[4/5] h-full w-full object-cover sm:aspect-[5/4] lg:aspect-[4/5]"
                      priority={watchIndex === 0}
                    />
                  </figure>

                  <div className="flex flex-col justify-center">
                    <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-[var(--bronze)]">
                      {watch.brand}
                    </p>
                    <h2 className="mt-3 font-[family-name:var(--font-cormorant)] text-3xl font-light leading-tight text-[var(--foreground)] sm:text-4xl">
                      {watch.model}
                    </h2>
                    <p className="mt-3 text-sm font-medium tracking-wide text-[var(--steel-bright)]">
                      {watch.reference}
                    </p>
                    <p className="mt-5 text-sm leading-relaxed text-[var(--muted)]">
                      {watch.description}
                    </p>
                    <ul className="mt-8 grid gap-px overflow-hidden rounded-sm border border-[var(--border)] bg-[var(--border)] sm:grid-cols-2">
                      {watch.details.map((detail) => (
                        <li
                          key={detail}
                          className="bg-[var(--surface-elevated)] p-4 text-sm leading-relaxed text-[var(--steel-bright)]"
                        >
                          {detail}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
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
                        sizes="(min-width: 1024px) 20vw, (min-width: 640px) 50vw, 100vw"
                        className={`${photo.className} h-full w-full object-cover`}
                      />
                    </figure>
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
