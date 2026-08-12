"use client";

type AskAboutWatchButtonProps = {
  watchName: string;
  reference?: string;
  className?: string;
};

export default function AskAboutWatchButton({
  watchName,
  reference,
  className,
}: AskAboutWatchButtonProps) {
  return (
    <button
      type="button"
      onClick={() => {
        window.dispatchEvent(
          new CustomEvent("revantex:open", {
            // `product` drives a contextual greeting ("…what can I tell you
            // about the {watchName}?"); the short message pre-fills the input.
            detail: {
              product: watchName,
              reference,
              message: "Sizing, condition, and what's included?",
            },
          }),
        );
      }}
      className={
        className ??
        "btn-bronze fixed bottom-24 left-5 z-[60] rounded-full px-5 py-3 text-sm font-medium shadow-xl shadow-black/40"
      }
    >
      Ask about this watch
    </button>
  );
}
