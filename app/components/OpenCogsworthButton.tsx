"use client";

export default function OpenCogsworthButton() {
  return (
    <button
      type="button"
      onClick={() =>
        window.dispatchEvent(
          new CustomEvent("gct:ask-watch", {
            detail: {
              prompt: "Tell me about Glass City Timepieces and what makes it different.",
            },
          }),
        )
      }
      className="btn-bronze mt-6 rounded-sm px-5 py-2.5 text-sm font-medium"
    >
      Ask Cogsworth
    </button>
  );
}
