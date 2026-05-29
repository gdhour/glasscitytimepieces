import InventoryGrid from "../components/InventoryGrid";
import { inventoryWatches } from "../collectionWatches";

export default function CurrentInventoryPage() {
  return (
    <main>
      <section className="border-b border-[var(--border)] bg-[var(--surface)] py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <p className="text-[11px] font-medium uppercase tracking-[0.35em] text-[var(--bronze)]">
            Inventory
          </p>
          <h1 className="mt-4 max-w-3xl font-[family-name:var(--font-cormorant)] text-4xl font-light leading-tight text-[var(--foreground)] sm:text-5xl">
            Current inventory, trusted network access, and Mir’s Picks.
          </h1>
          <p className="mt-5 max-w-3xl text-sm leading-relaxed text-[var(--steel)] sm:text-base">
            GCT separates owned inventory from collector-network opportunities
            and market picks. Only Current Inventory is in hand and ready for
            immediate shipment.
          </p>
        </div>
      </section>

      <section className="bg-[var(--background)] py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <InventoryGrid watches={inventoryWatches} />
        </div>
      </section>
    </main>
  );
}
