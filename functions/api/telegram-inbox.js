// Cloudflare Pages Function – Return queued operator replies for a session
// Requires KV binding: REPLY_QUEUE

export async function onRequestGet({ request, env }) {
  try {
    const url = new URL(request.url);
    const sessionId = (url.searchParams.get('sessionId') || '').trim();
    if (!sessionId) return json({ replies: [], error: 'missing sessionId' }, 400);
    if (!env.REPLY_QUEUE) return json({ replies: [], error: 'KV binding REPLY_QUEUE missing' }, 500);

    // List recent replies for this session
    const prefix = `reply:${sessionId}:`;
    const { keys } = await env.REPLY_QUEUE.list({ prefix, limit: 20 });
    const replies = [];
    for (const k of keys) {
      try {
        const val = await env.REPLY_QUEUE.get(k.name);
        if (val) {
          const obj = JSON.parse(val);
          replies.push({ text: obj.text || '', ts: obj.ts || Math.floor(Date.now() / 1000) });
        }
      } catch (_) {}
    }
    // Cleanup keys (best-effort)
    for (const k of keys) { try { await env.REPLY_QUEUE.delete(k.name); } catch (_) {} }

    return json({ replies });
  } catch (e) {
    return json({ replies: [], error: e?.message || String(e) }, 500);
  }
}

function json(body, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json; charset=utf-8' } });
}

