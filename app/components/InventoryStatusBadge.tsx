import {
  inventoryStatusContent,
  type InventoryStatus,
} from "../collectionWatches";

type InventoryStatusBadgeProps = {
  status: InventoryStatus;
  className?: string;
};

export default function InventoryStatusBadge({
  status,
  className = "",
}: InventoryStatusBadgeProps) {
  return (
    <span
      className={`inline-flex w-fit rounded-full border border-[var(--border-strong)] bg-[rgba(18,13,26,0.78)] px-3 py-1 text-[10px] font-medium uppercase tracking-[0.18em] text-[var(--bronze-soft)] ${className}`}
    >
      {inventoryStatusContent[status].badge}
    </span>
  );
}
