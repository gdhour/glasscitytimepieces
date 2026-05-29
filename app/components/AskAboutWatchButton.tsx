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
  const watchContext = reference ? `${watchName} reference ${reference}` : watchName;

  return (
    <button
      type="button"
      onClick={() => {
        window.dispatchEvent(
          new CustomEvent("gct:ask-watch", {
            detail: {
              watchContext,
              prompt: `I’m interested in the ${watchContext}. Can you walk me through sizing, condition, set contents, and the main pros and cons?`,
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
