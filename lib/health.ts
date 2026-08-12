// Liveness checks for the site's external dependencies — the "key points" that
// can silently fail at runtime (an expired API key being the classic case).
// Used by /api/health (public status) and /api/cron/health (scheduled alert).
import Anthropic from "@anthropic-ai/sdk";
import { inventoryWatches } from "@/app/collectionWatches";

export type Check = { name: string; ok: boolean; detail: string };
export type HealthReport = { healthy: boolean; checkedAt: string; checks: Check[] };

const ANTHROPIC_MODEL = process.env.ANTHROPIC_MODEL ?? "claude-haiku-4-5";

// Validates the Anthropic API key + model WITHOUT generating (a metadata GET) —
// would have caught the 401 that took search/concierge down.
async function checkAnthropic(): Promise<Check> {
  try {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) return { name: "anthropic", ok: false, detail: "ANTHROPIC_API_KEY not set" };
    await new Anthropic({ apiKey }).models.retrieve(ANTHROPIC_MODEL);
    return { name: "anthropic", ok: true, detail: ANTHROPIC_MODEL };
  } catch (e) {
    const detail = e instanceof Anthropic.APIError ? `${e.status} ${e.message}` : e instanceof Error ? e.message : "error";
    return { name: "anthropic", ok: false, detail };
  }
}

// Confirms the Resend key is valid so lead emails actually send. A send-only
// key is rejected from /domains as "restricted_api_key" — that still means the
// key works, so we treat it as healthy; only an invalid/missing key fails.
async function checkResend(): Promise<Check> {
  try {
    const key = process.env.RESEND_API_KEY;
    if (!key) return { name: "resend", ok: false, detail: "RESEND_API_KEY not set" };
    const res = await fetch("https://api.resend.com/domains", { headers: { Authorization: `Bearer ${key}` } });
    if (res.ok) return { name: "resend", ok: true, detail: "key valid" };
    if (res.status === 401) {
      const body = (await res.json().catch(() => ({}))) as { name?: string };
      if (body.name === "restricted_api_key") return { name: "resend", ok: true, detail: "key valid (send-only)" };
    }
    return { name: "resend", ok: false, detail: `HTTP ${res.status}` };
  } catch (e) {
    return { name: "resend", ok: false, detail: e instanceof Error ? e.message : "error" };
  }
}

// The storefront grid and the concierge both break if the catalog didn't load.
function checkInventory(): Check {
  const n = Array.isArray(inventoryWatches) ? inventoryWatches.length : 0;
  return n > 0
    ? { name: "inventory", ok: true, detail: `${n} items` }
    : { name: "inventory", ok: false, detail: "no inventory items loaded" };
}

export async function runHealthChecks(): Promise<HealthReport> {
  const [anthropic, resend] = await Promise.all([checkAnthropic(), checkResend()]);
  const checks = [anthropic, resend, checkInventory()];
  return { healthy: checks.every((c) => c.ok), checkedAt: new Date().toISOString(), checks };
}
