import type { Metadata } from "next";
import WatchSearch from "../components/WatchSearch";

export const metadata: Metadata = {
  title: "Search the collection — Glass City Timepieces",
  description:
    "Describe the watch you're after — a vibe, an occasion, a budget — and search the Glass City Timepieces collection in plain language. Conversational search, powered by Avidor.",
};

export default function SearchPage() {
  return (
    <main>
      <WatchSearch />
    </main>
  );
}
