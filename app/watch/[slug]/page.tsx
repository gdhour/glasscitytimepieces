import Link from "next/link";
import { notFound } from "next/navigation";
import AskAboutWatchButton from "../../components/AskAboutWatchButton";
import InventoryStatusBadge from "../../components/InventoryStatusBadge";
import { ClickablePhoto } from "../../components/PhotoLightbox";
import { inventoryStatusContent, inventoryWatches } from "../../collectionWatches";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return inventoryWatches.map((watch) => ({ slug: watch.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const watch = inventoryWatches.find((w) => w.slug === slug);
  if (!watch) return {};
  return {
    title: `${watch.brand} ${watch.model} — Glass City Timepieces`,
    description: watch.description.slice(0, 160),
  };
}

export default async function WatchDetailPage({ params }: Props) {
  const { slug } = await params;
  const watch = inventoryWatches.find((w) => w.slug === slug);
  if (!watch) notFound();

  const heroPhoto = watch.photos?.[watch.heroPhoto ?? 0];
  const supportingPhotos = watch.photos?.filter((_, i) => i !== watch.heroPhoto);
  const statusContent = inventoryStatusContent[watch.inventoryStatus];

  return (
    <main>
      {/* Breadcrumb */}
      <div className="border-b border-[var(--border)] bg-[var(--surface)]">
        <div className="mx-auto max-w-7xl px-5 py-4 sm:px-8">
          <nav className="flex items-center gap-2 text-xs text-[var(--muted)]">
            <Link href="/" className="hover:text-[var(--foreground)] transition-colors">Home</Link>
            <span>/</span>
            <Link href="/current-inventory" className="hover:text-[var(--foreground)] transition-colors">Inventory</Link>
            <span>/</span>
            <span className="text-[var(--steel-bright)]">{watch.brand} {watch.model}</span>
          </nav>
        </div>
      </div>

      {/* Hero */}
      <section className="border-b border-[var(--border)] py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)] lg:gap-16">
            {/* Photos */}
            <div>
              {heroPhoto && (
              <ClickablePhoto
                photo={heroPhoto}
                photos={watch.photos ?? []}
                index={watch.heroPhoto ?? 0}
                className="surface-card block overflow-hidden rounded-sm"
                imageClassName="aspect-[4/5] w-full object-cover sm:aspect-[5/4] lg:aspect-[4/5]"
                sizes="(min-width: 1024px) 54vw, 100vw"
                priority
              />
              )}

              {(supportingPhotos?.length ?? 0) > 0 && (
                <div className="mt-3 grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4">
                  {supportingPhotos?.map((photo, i) => {
                    const actualIndex = watch.photos?.findIndex((p) => p.src === photo.src) ?? i;
                    return (
                      <ClickablePhoto
                        key={photo.src}
                        photo={photo}
                        photos={watch.photos ?? []}
                        index={actualIndex}
                        className="surface-card block overflow-hidden rounded-sm"
                        imageClassName="aspect-square w-full object-cover"
                        sizes="(min-width: 1024px) 14vw, 25vw"
                      />
                    );
                  })}
                </div>
              )}
            </div>

            {/* Details */}
            <div className="flex flex-col">
              {watch.sold ? (
                <span className="inline-flex w-fit items-center rounded-sm border border-[var(--bronze)] bg-[var(--bronze)]/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--bronze-soft)]">
                  Sold
                </span>
              ) : (
                <InventoryStatusBadge status={watch.inventoryStatus} />
              )}

              <p className="mt-5 text-[11px] font-medium uppercase tracking-[0.28em] text-[var(--bronze)]">
                {watch.brand}
              </p>
              <h1 className="mt-3 font-[family-name:var(--font-cormorant)] text-4xl font-light leading-tight text-[var(--foreground)] sm:text-5xl">
                {watch.model}
              </h1>
              <p className="mt-3 text-sm font-medium tracking-wide text-[var(--steel-bright)]">
                {watch.reference}
              </p>

              {watch.price && (
                <p className="mt-5 font-[family-name:var(--font-cormorant)] text-4xl font-light text-[var(--foreground)]">
                  <span className={watch.sold ? "text-[var(--muted)] line-through" : ""}>{watch.price}</span>
                  {watch.sold && (
                    <span className="ml-3 align-middle text-base font-medium uppercase tracking-[0.2em] text-[var(--bronze)]">
                      Sold
                    </span>
                  )}
                </p>
              )}

              <p className="mt-6 text-sm leading-relaxed text-[var(--muted)]">
                {watch.description}
              </p>

              {/* Availability */}
              <div className="mt-6 rounded-sm border border-[var(--border-strong)] bg-[var(--surface-elevated)] p-4">
                {watch.sold ? (
                  <>
                    <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-[var(--bronze)]">
                      Sold
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-[var(--steel-bright)]">
                      This piece has found its owner. Ask about sourcing the same reference or a similar alternative.
                    </p>
                  </>
                ) : (
                  <>
                    <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-[var(--bronze)]">
                      {statusContent.label}
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-[var(--steel-bright)]">
                      {watch.availabilityNote ?? statusContent.disclosure}
                    </p>
                    {watch.estimatedProcurementTime && (
                      <p className="mt-2 text-xs text-[var(--muted)]">
                        Estimated procurement: {watch.estimatedProcurementTime}
                      </p>
                    )}
                  </>
                )}
              </div>

              {/* Specs */}
              <ul className="mt-6 grid gap-px overflow-hidden rounded-sm border border-[var(--border)] bg-[var(--border)] sm:grid-cols-2">
                {watch.details.map((detail) => (
                  <li
                    key={detail}
                    className="bg-[var(--surface-elevated)] p-4 text-sm leading-relaxed text-[var(--steel-bright)]"
                  >
                    {detail}
                  </li>
                ))}
              </ul>

              {/* Ask Avidor */}
              <div className="mt-6">
                <AskAboutWatchButton
                  watchName={`${watch.brand} ${watch.model}`}
                  reference={watch.reference}
                  className="btn-bronze w-full rounded-sm px-6 py-3 text-sm font-medium"
                />
              </div>

              {/* Back link */}
              <Link
                href="/current-inventory"
                className="mt-4 text-center text-xs text-[var(--muted)] hover:text-[var(--steel-bright)] transition-colors"
              >
                ← Back to inventory
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
