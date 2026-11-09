// Vercel Node function: POST /api/inquiry
// Forwards a price request from the site to the company's Telegram chat.
// The bot token lives only in server env (TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID) — never in the browser bundle.
// INQUIRY_DRY_RUN=1 logs the message instead of sending it (local development).

const BRANDS = { sofra: "SO‘FRA", mashrab: "MASHRAB", "al-hayot": "AL HAYOT", salam: "SALAM" };
const MIN_FILL_MS = 2500; // humans need a moment to fill the form; instant posts are bots
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const recent = new Map(); // best-effort, per warm instance

const clean = (v, max) => String(v ?? "").replace(/\s+/g, " ").trim().slice(0, max);
const escapeHtml = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

function rateLimited(ip) {
  const now = Date.now();
  const hits = (recent.get(ip) || []).filter((t) => now - t < WINDOW_MS);
  hits.push(now);
  recent.set(ip, hits);
  return hits.length > MAX_PER_WINDOW;
}

async function readJson(req) {
  if (req.body && typeof req.body === "object") return req.body;
  if (typeof req.body === "string") return JSON.parse(req.body || "{}");
  const chunks = [];
  for await (const c of req) chunks.push(c);
  return JSON.parse(Buffer.concat(chunks).toString("utf8") || "{}");
}

function send(res, status, body) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(JSON.stringify(body));
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return send(res, 405, { ok: false, error: "method_not_allowed" });
  }

  let body;
  try {
    body = await readJson(req);
  } catch {
    return send(res, 400, { ok: false, error: "bad_json" });
  }

  const name = clean(body.name, 120);
  const phone = clean(body.phone, 30);
  const brand = BRANDS[body.brand] || "";
  const quantity = clean(body.quantity, 20);
  const message = String(body.message ?? "").trim().slice(0, 2000);

  // Silent success for bots, so they get no signal to retry.
  const tooFast = Date.now() - Number(body.startedAt || 0) < MIN_FILL_MS;
  if (clean(body.website, 200) || tooFast) return send(res, 200, { ok: true });

  if (!name || (phone.match(/\d/g) || []).length < 9) {
    return send(res, 422, { ok: false, error: "invalid" });
  }

  const ip = String(req.headers["x-forwarded-for"] || req.socket?.remoteAddress || "").split(",")[0].trim();
  if (rateLimited(ip)) return send(res, 429, { ok: false, error: "rate_limited" });

  const lines = [
    "<b>Yangi narx so‘rovi</b>",
    `<b>Ism:</b> ${escapeHtml(name)}`,
    `<b>Telefon:</b> ${escapeHtml(phone)}`,
    brand && `<b>Brend:</b> ${escapeHtml(brand)}`,
    quantity && `<b>Hajm:</b> ${escapeHtml(quantity)} qop`,
    message && `<b>Izoh:</b> ${escapeHtml(message)}`,
  ].filter(Boolean);
  const text = lines.join("\n");

  if (process.env.INQUIRY_DRY_RUN === "1") {
    console.log("[inquiry:dry-run]\n" + text);
    return send(res, 200, { ok: true, dryRun: true });
  }

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) {
    console.error("[inquiry] TELEGRAM_BOT_TOKEN / TELEGRAM_CHAT_ID are not set");
    return send(res, 503, { ok: false, error: "not_configured" });
  }

  try {
    const tg = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text, parse_mode: "HTML", disable_web_page_preview: true }),
    });
    const out = await tg.json().catch(() => ({}));
    if (!tg.ok || !out.ok) {
      console.error("[inquiry] telegram error", tg.status, out.description);
      return send(res, 502, { ok: false, error: "upstream" });
    }
    return send(res, 200, { ok: true });
  } catch (err) {
    console.error("[inquiry] network error", err);
    return send(res, 502, { ok: false, error: "upstream" });
  }
}
