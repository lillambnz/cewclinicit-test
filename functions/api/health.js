// Cloudflare Pages Function: /api/health
// Simple health check to verify Pages Functions are active and env is wired.

export async function onRequestGet({ env }) {
  const body = {
    functionsActive: true,
    deepseekKeyPresent: Boolean(env.DEEPSEEK_API_KEY || ''),
    telegramConfigured: Boolean(env.TELEGRAM_BOT_TOKEN && env.TELEGRAM_CHAT_ID),
    timestamp: new Date().toISOString()
  };
  return new Response(JSON.stringify(body), {
    headers: { 'content-type': 'application/json; charset=utf-8' }
  });
}
