import type { NextConfig } from "next";

const securityHeaders = [
  // Prevent the site from being embedded in iframes (clickjacking)
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  // Prevent MIME-type sniffing
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Control referrer information
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Disable unnecessary browser features
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  // Content Security Policy
  // unsafe-inline for scripts is required by Next.js App Router (inline hydration scripts)
  // Tighten further with nonces if this becomes a concern.
  // https://revantex.com is allowed so the Revantex concierge embed
  // (script + its API calls) can run — GCT runs on it as customer zero.
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' https://revantex.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com data:",
      "img-src 'self' data: blob: https:",
      "connect-src 'self' https://api.anthropic.com https://revantex.com",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join("; "),
  },
];

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
  // First-party reverse proxy for PostHog (ad blockers block us.i.posthog.com
  // directly; same-origin /ingest traffic survives). Keep the static rule above
  // the catch-all — Next rewrites match in order. This also let the PostHog
  // hosts come OUT of the CSP (analytics is same-origin now).
  async rewrites() {
    return [
      {
        source: "/ingest/static/:path*",
        destination: "https://us-assets.i.posthog.com/static/:path*",
      },
      {
        source: "/ingest/:path*",
        destination: "https://us.i.posthog.com/:path*",
      },
    ];
  },
  // PostHog capture endpoints use trailing slashes (/e/, /s/); without this,
  // Next 308-redirects them and the proxied POST bodies are dropped.
  skipTrailingSlashRedirect: true,
};

export default nextConfig;
