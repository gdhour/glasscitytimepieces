"use client";

// PostHog pageview tracker — initializes PostHog and captures a $pageview on
// initial load and every client-side route change (App Router). Explicit pattern
// (capture_pageview:false, fired here) rather than auto-capture, which proved
// unreliable. capture_pageleave gives time-on-site, so PostHog's Web Analytics
// shows visitors, session duration, and top pages.
//
// Gated on NEXT_PUBLIC_POSTHOG_KEY (set only in prod), so it no-ops locally.
// The `site` super-property tags every event for a per-property breakdown.
import { useEffect, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import posthog from "posthog-js";

const SITE = "gct";

let initialized = false;
function ensureInit() {
  if (initialized) return;
  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  if (!key) return;
  initialized = true;
  posthog.init(key, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://us.i.posthog.com",
    capture_pageview: false,
    capture_pageleave: true,
    person_profiles: "identified_only",
  });
  posthog.register({ site: SITE });
}

function PageViews() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  useEffect(() => {
    ensureInit();
    if (!pathname || !process.env.NEXT_PUBLIC_POSTHOG_KEY) return;
    let url = window.location.origin + pathname;
    const qs = searchParams?.toString();
    if (qs) url += `?${qs}`;
    posthog.capture("$pageview", { $current_url: url });
  }, [pathname, searchParams]);
  return null;
}

export default function PostHogTracker() {
  return (
    <Suspense fallback={null}>
      <PageViews />
    </Suspense>
  );
}
