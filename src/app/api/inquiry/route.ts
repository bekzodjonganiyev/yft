// POST /api/inquiry — forwards a price request to the company's Telegram chat.
// The bot token lives only in server env (TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID), never in the browser bundle.
// In development without a token (or with INQUIRY_DRY_RUN=1) the message is logged instead of sent.

import { brands } from "@/lib/site";

const BRAND_NAMES: Record<string, string> = Object.fromEntries(brands.map((b) => [b.id, b.name]));
const MIN_FILL_MS = 2500; // humans need a moment to fill the form; instant posts are bots
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const recent = new Map<string, number[]>(); // best-effort, per warm instance

const clean = (v: unknown, max: number) => String(v ?? "").replace(/\s+/g, " ").trim().slice(0, max);
const escapeHtml = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

function rateLimited(ip: string) {
  const now = Date.now();
  const hits = (recent.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  hits.push(now);
  recent.set(ip, hits);
  return hits.length > MAX_PER_WINDOW;
}

const json = (status: number, body: Record<string, unknown>) => Response.json(body, { status });

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return json(400, { ok: false, error: "bad_json" });
  }

  const name = clean(body.name, 120);
  const phone = clean(body.phone, 30);
  const brand = BRAND_NAMES[String(body.brand)] ?? "";
  const quantity = clean(body.quantity, 20);
  const message = String(body.message ?? "").trim().slice(0, 2000);

  // Silent success for bots, so they get no signal to retry.
  const tooFast = Date.now() - Number(body.startedAt || 0) < MIN_FILL_MS;
  if (clean(body.website, 200) || tooFast) return json(200, { ok: true });

  if (!name || (phone.match(/\d/g) || []).length < 9) return json(422, { ok: false, error: "invalid" });

  const ip = (request.headers.get("x-forwarded-for") ?? "").split(",")[0].trim() || "unknown";
  if (rateLimited(ip)) return json(429, { ok: false, error: "rate_limited" });

  const text = [
    "<b>Yangi narx so‘rovi</b>",
    `<b>Ism:</b> ${escapeHtml(name)}`,
    `<b>Telefon:</b> ${escapeHtml(phone)}`,
    brand && `<b>Brend:</b> ${escapeHtml(brand)}`,
    quantity && `<b>Hajm:</b> ${escapeHtml(quantity)} qop`,
    message && `<b>Izoh:</b> ${escapeHtml(message)}`,
  ]
    .filter(Boolean)
    .join("\n");

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  const dryRun = process.env.INQUIRY_DRY_RUN === "1" || (process.env.NODE_ENV === "development" && !token);

  if (dryRun) {
    console.log("[inquiry:dry-run]\n" + text);
    return json(200, { ok: true, dryRun: true });
  }
  if (!token || !chatId) {
    console.error("[inquiry] TELEGRAM_BOT_TOKEN / TELEGRAM_CHAT_ID are not set");
    return json(503, { ok: false, error: "not_configured" });
  }

  try {
    const tg = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text, parse_mode: "HTML", disable_web_page_preview: true }),
    });
    const out = (await tg.json().catch(() => ({}))) as { ok?: boolean; description?: string };
    if (!tg.ok || !out.ok) {
      console.error("[inquiry] telegram error", tg.status, out.description);
      return json(502, { ok: false, error: "upstream" });
    }
    return json(200, { ok: true });
  } catch (err) {
    console.error("[inquiry] network error", err);
    return json(502, { ok: false, error: "upstream" });
  }
}
