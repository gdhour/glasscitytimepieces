import Image from "next/image";
import Link from "next/link";
import { ClickablePhoto } from "./PhotoLightbox";
import {
  inventoryStatusContent,
  type InventoryWatch,
} from "../collectionWatches";
import InventoryStatusBadge from "./InventoryStatusBadge";

type WatchListingCardProps = {
  watch: InventoryWatch;
  // Eager-load the first card's hero image (above the fold).
  priority?: boolean;
  // Search-in-place: a one-line "why this matches" for the current query.
  reason?: string;
};

export default function WatchListingCard({
  watch,
  priority = false,
  reason,
}: WatchListingCardProps) {
  const hasPhotos = watch.photos && watch.photos.length > 0;
  const heroPhoto = hasPhotos ? watch.photos![watch.heroPhoto ?? 0] : null;
  const supportingPhotos = hasPhotos
    ? watch.photos!.filter((_, i) => i !== (watch.heroPhoto ?? 0))
    : [];
  const statusContent = inventoryStatusContent[watch.inventoryStatus];

  return (
    <article>
      <div className={`grid gap-8 ${hasPhotos ? "lg:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)]" : ""}`}>
        {hasPhotos && heroPhoto && (
          watch.slug ? (
            <Link href={`/watch/${watch.slug}`} className="surface-card group block overflow-hidden rounded-sm">
              <Image
                src={heroPhoto.src}
                alt={heroPhoto.alt}
                width={heroPhoto.width}
                height={heroPhoto.height}
                sizes="(min-width: 1024px) 54vw, 100vw"
                className="aspect-[4/5] h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.02] sm:aspect-[5/4] lg:aspect-[4/5]"
                priority={priority}
              />
            </Link>
          ) : (
            <figure className="surface-card overflow-hidden rounded-sm">
              <Image
                src={heroPhoto.src}
                alt={heroPhoto.alt}
                width={heroPhoto.width}
                height={heroPhoto.height}
                sizes="(min-width: 1024px) 54vw, 100vw"
                className="aspect-[4/5] h-full w-full object-cover sm:aspect-[5/4] lg:aspect-[4/5]"
                priority={priority}
              />
            </figure>
          )
        )}

        <div className="flex flex-col justify-center">
          {watch.sold ? (
            <span className="inline-flex w-fit items-center rounded-sm border border-[var(--bronze)] bg-[var(--bronze)]/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--bronze-soft)]">
              Sold
            </span>
          ) : (
            <InventoryStatusBadge status={watch.inventoryStatus} />
          )}
          {reason && (
            <p className="mt-4 flex items-start gap-2 text-sm leading-relaxed text-[var(--steel-bright)]">
              <span aria-hidden className="mt-px text-[var(--bronze)]">→</span>
              <span>
                <span className="font-medium text-[var(--bronze-soft)]">Why this matches: </span>
                {reason}
              </span>
            </p>
          )}
          <p className="mt-5 text-[11px] font-medium uppercase tracking-[0.28em] text-[var(--bronze)]">
            {watch.brand}
          </p>
          <h2 className="mt-3 font-[family-name:var(--font-cormorant)] text-3xl font-light leading-tight text-[var(--foreground)] sm:text-4xl">
            {watch.model}
          </h2>
          <p className="mt-3 text-sm font-medium tracking-wide text-[var(--steel-bright)]">
            {watch.reference}
          </p>
          {watch.price ? (
            <p className="mt-4 font-[family-name:var(--font-cormorant)] text-3xl font-light text-[var(--foreground)]">
              <span className={watch.sold ? "text-[var(--muted)] line-through" : ""}>{watch.price}</span>
              {watch.sold ? (
                <span className="ml-3 align-middle text-sm font-medium uppercase tracking-[0.2em] text-[var(--bronze)]">
                  Sold
                </span>
              ) : null}
            </p>
          ) : null}
          <p className="mt-5 text-sm leading-relaxed text-[var(--muted)]">
            {watch.description}
          </p>
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
                {watch.estimatedProcurementTime ? (
                  <p className="mt-3 text-xs text-[var(--muted)]">
                    Estimated procurement: {watch.estimatedProcurementTime}
                  </p>
                ) : null}
              </>
            )}
          </div>
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

          {watch.slug && (
            <div className="mt-6">
              <Link
                href={`/watch/${watch.slug}`}
                className="rounded-sm border border-[var(--border-strong)] px-5 py-3 text-sm font-medium text-[var(--foreground)] transition-colors hover:bg-[var(--purple)]/25"
              >
                View details
              </Link>
            </div>
          )}
        </div>
      </div>

      {watch.inventoryStatus !== "pick" && supportingPhotos.length > 0 && (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
          {supportingPhotos.map((photo) => {
            const actualIndex = watch.photos!.findIndex((p) => p.src === photo.src);
            return (
              <ClickablePhoto
                key={photo.src}
                photo={photo}
                photos={watch.photos!}
                index={actualIndex}
                className="surface-card block overflow-hidden rounded-sm"
                imageClassName={`${photo.className} h-full w-full object-cover`}
                sizes="(min-width: 1024px) 20vw, (min-width: 640px) 50vw, 100vw"
              />
            );
          })}
        </div>
      )}
    </article>
  );
}
