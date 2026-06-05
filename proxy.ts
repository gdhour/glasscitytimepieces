import { NextRequest, NextResponse } from "next/server";

// Simple sliding-window rate limiter for the chat API.
// Runs at the Vercel edge — in-memory per edge instance, so this is best-effort
// protection against casual abuse and runaway clients, not a hard global cap.
// For stricter enforcement, swap the Map for Vercel KV (Upstash Redis).

const WINDOW_MS = 60_000; // 1 minute
const MAX_REQUESTS = 20;  // per IP per window

interface WindowRecord {
  count: number;
  resetAt: number;
}

const ipMap = new Map<string, WindowRecord>();

function getIp(request: NextRequest): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    request.headers.get("x-real-ip") ??
    "unknown"
  );
}

export function proxy(request: NextRequest) {
  const ip = getIp(request);
  const now = Date.now();

  const record = ipMap.get(ip);

  if (!record || now > record.resetAt) {
    ipMap.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return NextResponse.next();
  }

  if (record.count >= MAX_REQUESTS) {
    return NextResponse.json(
      { error: "Too many requests. Please wait a moment before trying again." },
      {
        status: 429,
        headers: {
          "Retry-After": String(Math.ceil((record.resetAt - now) / 1000)),
        },
      },
    );
  }

  record.count++;
  return NextResponse.next();
}

export const config = {
  matcher: "/api/chat",
};
