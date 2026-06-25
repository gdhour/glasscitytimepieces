// GET /api/cron/health — scheduled health check. Runs the dependency checks and,
// if anything is unhealthy, emails an alert so a silent failure (e.g. an expired
// API key) surfaces immediately instead of via a customer report.
// Scheduler-only: requires CRON_SECRET (Vercel Cron sends it as a Bearer token).
import { Resend } from "resend";
import { runHealthChecks, type Check } from "@/lib/health";
import policies from "@/data/policies.json";

export const runtime = "nodejs";
export const maxDuration = 30;

async function sendAlert(failed: Check[], checkedAt: string) {
  if (!process.env.RESEND_API_KEY) return; // can't alert if email itself is the dep that's down
  const to = process.env.GCT_LEAD_EMAIL ?? policies.business.email;
  const rows = failed.map((c) => `<li><strong>${c.name}</strong>: ${c.detail}</li>`).join("");
  const resend = new Resend(process.env.RESEND_API_KEY);
  await resend.emails.send({
    from: "Avidor <avidor@glasscitytimepieces.com>",
    to,
    subject: `⚠ Glass City Timepieces — health check failed (${failed.map((c) => c.name).join(", ")})`,
    html: `
      <div style="font-family:-apple-system,Segoe UI,sans-serif;max-width:600px;margin:0 auto;color:#171717">
        <h2 style="font-weight:500">Concierge health alert</h2>
        <p>One or more dependencies failed their check at ${checkedAt}:</p>
        <ul>${rows}</ul>
        <p>Customer-facing AI (search, concierge, ranking) may be degraded until this is resolved.</p>
        <p style="font-size:12px;color:#888">Automated check · /api/cron/health</p>
      </div>`,
  });
}

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  const authed = !!secret && request.headers.get("authorization") === `Bearer ${secret}`;
  if (!authed) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const report = await runHealthChecks();
  if (!report.healthy) {
    const failed = report.checks.filter((c) => !c.ok);
    console.error("Health check FAILED", failed);
    await sendAlert(failed, report.checkedAt).catch((e) => console.error("Health alert email failed:", e));
  } else {
    console.info("Health check OK", report.checks.map((c) => c.name).join(", "));
  }
  return Response.json(report, { status: report.healthy ? 200 : 503 });
}
