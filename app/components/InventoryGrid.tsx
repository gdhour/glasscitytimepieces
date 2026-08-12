"use client";

import { useMemo, useState } from "react";
import {
  inventoryStatusContent,
  inventoryStatusOptions,
  type InventoryStatus,
  type InventoryWatch,
} from "../collectionWatches";
import InventoryStatusBadge from "./InventoryStatusBadge";
import WatchListingCard from "./WatchListingCard";

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
          {filteredWatches.map((watch, watchIndex) => (
            <WatchListingCard
              key={`${watch.brand}-${watch.reference}`}
              watch={watch}
              priority={watchIndex === 0}
            />
          ))}
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
