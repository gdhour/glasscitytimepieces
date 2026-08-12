// GET /api/health — public liveness status for the site's key dependencies.
// 200 when everything's healthy, 503 when any check fails. Safe to point an
// external uptime monitor (UptimeRobot, Better Uptime, etc.) at this URL.
import { runHealthChecks } from "@/lib/health";

export const runtime = "nodejs";

export async function GET() {
  const report = await runHealthChecks();
  return Response.json(
    { status: report.healthy ? "ok" : "degraded", ...report },
    { status: report.healthy ? 200 : 503, headers: { "Cache-Control": "no-store" } },
  );
}
