// Cloudflare Pages Function – Telegram webhook receiver
// Expects binding: REPLY_QUEUE (KV Namespace)
// Env secret: TELEGRAM_WEBHOOK_TOKEN must match ?token= query

export async function onRequestPost({ request, env }) {
  try {
    const url = new URL(request.url);
    const token = url.searchParams.get('token') || '';
    const expected = env?.TELEGRAM_WEBHOOK_TOKEN || '';
    if (!expected || token !== expected) {
      return new Response(JSON.stringify({ ok: false, error: 'Forbidden' }), { status: 403 });
    }

    const data = await request.json().catch(() => ({}));
    const msg = data?.message || data?.edited_message || null;
    if (!msg || !msg.text) {
      return json({ ok: true, ignored: true, reason: 'no-message' });
    }

    const text = (msg.text || '').trim();
    // Expected format: /reply <sessionId> <message>
    const m = text.match(/^\/?reply\s+([A-Za-z0-9_-]{6,64})\s+([\s\S]+)/i);
    if (!m) {
      return json({ ok: true, ignored: true, reason: 'no-reply-command' });
    }

    const sessionId = m[1];
    const replyText = m[2].trim();

    if (!env.REPLY_QUEUE) {
      return json({ ok: false, error: 'KV binding REPLY_QUEUE missing' }, 500);
    }

    const key = `reply:${sessionId}:${Date.now()}:${data.update_id || ''}`;
    const payload = JSON.stringify({ sessionId, text: replyText, ts: Math.floor(Date.now() / 1000) });
    await env.REPLY_QUEUE.put(key, payload, { expirationTtl: 86400 }); // 24h TTL

    return json({ ok: true, stored: true, key });
  } catch (e) {
    return json({ ok: false, error: e?.message || String(e) }, 500);
  }
}

function json(body, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json; charset=utf-8' } });
}

