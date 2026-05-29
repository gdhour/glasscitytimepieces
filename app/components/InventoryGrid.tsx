"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import {
  inventoryStatusContent,
  inventoryStatusOptions,
  type InventoryStatus,
} from "../collectionWatches";
import AskAboutWatchButton from "./AskAboutWatchButton";
import InventoryStatusBadge from "./InventoryStatusBadge";

type InventoryWatch = {
  brand: string;
  model: string;
  reference: string;
  inventoryStatus: InventoryStatus;
  availabilityNote?: string;
  estimatedProcurementTime?: string;
  sourceType?: string;
  isOwnedByGCT?: boolean;
  canShipImmediately?: boolean;
  description: string;
  details: readonly string[];
  heroPhoto: number;
  photos: readonly {
    src: string;
    alt: string;
    width: number;
    height: number;
    className: string;
  }[];
};

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
  const primaryWatch = filteredWatches[0];

  return (
    <>
      {primaryWatch ? (
        <AskAboutWatchButton
          watchName={`${primaryWatch.brand} ${primaryWatch.model}`}
          reference={primaryWatch.reference}
        />
      ) : null}

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
