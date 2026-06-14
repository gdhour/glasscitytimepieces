"use client";

export default function OpenAvidorButton() {
  return (
    <button
      type="button"
      onClick={() =>
        window.dispatchEvent(
          new CustomEvent("revantex:open", {
            detail: {
              message: "Tell me about Glass City Timepieces and what makes it different.",
            },
          }),
        )
      }
      className="btn-bronze mt-6 rounded-sm px-5 py-2.5 text-sm font-medium"
    >
      Ask Avidor
    </button>
  );
}
