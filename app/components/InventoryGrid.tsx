"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { ClickablePhoto } from "./PhotoLightbox";
import {
  inventoryStatusContent,
  inventoryStatusOptions,
  type InventoryStatus,
  type InventoryWatch,
} from "../collectionWatches";
import AskAboutWatchButton from "./AskAboutWatchButton";
import InventoryStatusBadge from "./InventoryStatusBadge";

type InventoryGridProps = {
  watches: readonly InventoryWatch[];
};

export default function InventoryGrid({ watches }: InventoryGridProps) {
  const [activeStatus, setActiveStatus] = useState<InventoryStatus>("current");
  const filteredWatches = useMemo(
    () => watches.filter((watch) => watch.inventoryStatus === activeStatus),
    [activeStatus, watches],
  );
  const activeContent = inventoryStatusContent[activeStatus];

  return (
    <>
      <div className="mb-10">
        <div className="flex flex-wrap gap-3">
          {inventoryStatusOptions.map((option) => {
            const active = option.value === activeStatus;

            return (
              <button
                key={option.value}
                type="button"
                onClick={() => setActiveStatus(option.value)}
                className={`rounded-full border px-4 py-2 text-xs font-medium uppercase tracking-[0.16em] transition-colors ${
                  active
                    ? "border-[var(--bronze)] bg-[var(--bronze)] text-[var(--on-bronze)]"
                    : "border-[var(--border)] bg-[var(--surface-elevated)] text-[var(--steel)] hover:border-[var(--border-strong)] hover:text-[var(--foreground)]"
                }`}
              >
                {option.label}
              </button>
            );
          })}
        </div>
        <p className="mt-4 max-w-3xl text-sm leading-relaxed text-[var(--muted)]">
          {activeContent.disclosure}
        </p>
      </div>

      {filteredWatches.length > 0 ? (
        <div className="space-y-20">
          {filteredWatches.map((watch, watchIndex) => {
            const heroPhoto = watch.photos[watch.heroPhoto];
            const supportingPhotos = watch.photos.filter(
              (_, photoIndex) => photoIndex !== watch.heroPhoto,
            );
            const statusContent = inventoryStatusContent[watch.inventoryStatus];

            return (
              <article key={`${watch.brand}-${watch.reference}`}>
                <div className="grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)]">
                  <Link href={`/watch/${watch.slug}`} className="surface-card group block overflow-hidden rounded-sm">
                    <Image
                      src={heroPhoto.src}
                      alt={heroPhoto.alt}
                      width={heroPhoto.width}
                      height={heroPhoto.height}
                      sizes="(min-width: 1024px) 54vw, 100vw"
                      className="aspect-[4/5] h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.02] sm:aspect-[5/4] lg:aspect-[4/5]"
                      priority={watchIndex === 0}
                    />
                  </Link>

                  <div className="flex flex-col justify-center">
                    <InventoryStatusBadge status={watch.inventoryStatus} />
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
                        {watch.price}
                      </p>
                    ) : null}
                    <p className="mt-5 text-sm leading-relaxed text-[var(--muted)]">
                      {watch.description}
                    </p>
                    <div className="mt-6 rounded-sm border border-[var(--border-strong)] bg-[var(--surface-elevated)] p-4">
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

                    <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                      <AskAboutWatchButton
                        watchName={`${watch.brand} ${watch.model}`}
                        reference={watch.reference}
                        className="btn-bronze flex-1 rounded-sm px-5 py-3 text-sm font-medium"
                      />
                      <Link
                        href={`/watch/${watch.slug}`}
                        className="flex-1 rounded-sm border border-[var(--border-strong)] px-5 py-3 text-center text-sm font-medium text-[var(--foreground)] transition-colors hover:bg-[var(--purple)]/25"
                      >
                        View details
                      </Link>
                    </div>
                  </div>
                </div>

                {watch.inventoryStatus !== "pick" && supportingPhotos.length > 0 && (
                  <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
                    {supportingPhotos.map((photo) => {
                      const actualIndex = watch.photos.findIndex((p) => p.src === photo.src);
                      return (
                        <ClickablePhoto
                          key={photo.src}
                          photo={photo}
                          photos={watch.photos}
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
          })}
        </div>
      ) : (
        <div className="surface-card rounded-sm p-8 sm:p-10">
          <InventoryStatusBadge status={activeStatus} />
          <h2 className="mt-5 font-[family-name:var(--font-cormorant)] text-3xl font-light text-[var(--foreground)]">
            No pieces listed here yet.
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-[var(--muted)]">
            {activeContent.disclosure} Mir can still discuss what would fit this
            category and confirm options directly before anything is represented
            as available.
          </p>
        </div>
      )}
    </>
  );
}
