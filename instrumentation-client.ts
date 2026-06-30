// Next.js client instrumentation (runs in the browser before hydration).
// PostHog product analytics — pageviews + autocaptured interactions, tagged with
// a `site` super-property so one PostHog project gives a per-property breakdown
// across our sites. Gated on NEXT_PUBLIC_POSTHOG_KEY (+ production): a no-op
// locally and without the env, so dev traffic never pollutes analytics.
import posthog from "posthog-js";

const phKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;
if (phKey && process.env.NODE_ENV === "production") {
  posthog.init(phKey, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://us.i.posthog.com",
    capture_pageview: "history_change",
    capture_pageleave: true,
    person_profiles: "identified_only",
  });
  posthog.register({ site: "gct" });
}
