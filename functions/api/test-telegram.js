// Cloudflare Pages Function: /api/test-telegram
// Sends a simple test message to Telegram to verify wiring.

export async function onRequestGet({ request, env }) {
  const url = new URL(request.url);
  const msg = url.searchParams.get('msg') || 'Test: ClinicIT AI Monitor connected';
  return handleTest(request, env, msg);
}

export async function onRequestPost({ request, env }) {
  let msg = 'Test: ClinicIT AI Monitor connected';
  try {
    const body = await request.json();
    if (body && typeof body.msg === 'string' && body.msg.trim()) msg = body.msg.trim();
  } catch {}
  return handleTest(request, env, msg);
}

async function handleTest(request, env, msg) {
  const clientIP = request.headers.get('CF-Connecting-IP') || request.headers.get('X-Forwarded-For') || 'unknown';
  const userAgent = request.headers.get('User-Agent') || '';
  const country = (request.cf && request.cf.country) || request.headers.get('CF-IPCountry') || 'unknown';

  const logData = {
    timestamp: new Date().toISOString(),
    clientIP: maskIP(clientIP),
    country,
    userMessage: sanitizeForLogging(msg),
    aiResponse: 'OK',
    context: 'test',
    source: 'manual',
    tokens: 0,
    cost: '$0.000000',
    userAgent: userAgent.substring(0, 100)
  };

  await sendToTelegram(logData, env).catch(() => {});
  return new Response(JSON.stringify({ ok: true }), { headers: { 'content-type': 'application/json; charset=utf-8' } });
}

function maskIP(ip) {
  if (!ip || ip === 'unknown') return 'unknown';
  const parts = ip.split('.');
  if (parts.length === 4) return `${parts[0]}.${parts[1]}.${parts[2]}.xxx`;
  return 'masked';
}

function sanitizeForLogging(message) {
  if (!message) return '';
  let sanitized = message
    .replace(/\b\d{4}\s?\d{4}\s?\d{4}\s?\d{4}\b/g, '[CARD_NUMBER]')
    .replace(/\b\d{3}-\d{2}-\d{4}\b/g, '[SSN]')
    .replace(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, '[EMAIL]')
    .replace(/\b\d{10,}\b/g, '[PHONE]')
    .replace(/\b(?:my name is|i am|i'm called)\s+\w+/gi, '[NAME_MENTION]');
  return sanitized.length > 300 ? sanitized.substring(0, 300) + '...' : sanitized;
}

async function sendToTelegram(logEntry, env) {
  const botToken = env?.TELEGRAM_BOT_TOKEN || '';
  const chatId = env?.TELEGRAM_CHAT_ID || '';
  if (!botToken || !chatId) {
    return new Response(JSON.stringify({ ok: false, error: 'Missing TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID' }), {
      status: 500,
      headers: { 'content-type': 'application/json; charset=utf-8' }
    });
  }
  const text = formatTelegramMessageHTML(logEntry);
  const resp = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'HTML', disable_web_page_preview: true })
  });
  if (!resp.ok) {
    // Do not fail the function on Telegram error
  }
}

function formatTelegramMessageHTML(log) {
  const flag = log.country === 'AU' ? '🇦🇺' : (log.country === 'NZ' ? '🇳🇿' : '🌍');
  const ts = new Date(log.timestamp).toLocaleString('en-AU', { timeZone: 'Australia/Perth' });
  const esc = escapeHTML;
  const preview = (log.aiResponse || '').substring(0, 100);
  const previewSuffix = (log.aiResponse || '').length > 100 ? '...' : '';

  return [
    '🤖 <b>ClinicIT AI Usage Alert</b>',
    '',
    `${flag} <b>Location:</b> ${esc(log.country || 'unknown')}`,
    `⏰ <b>Time:</b> ${esc(ts)}`,
    '',
    '<b>User Asked:</b>',
    `"${esc(log.userMessage || '')}"`,
    '',
    '<b>AI Response Preview:</b>',
    `"${esc(preview)}${previewSuffix}"`,
    '',
    '<b>Metrics:</b>',
    `• Source: ${esc(log.source || '')}`,
    `• Tokens: ${esc(String(log.tokens ?? 0))}`,
    `• Cost: ${esc(log.cost || '$0.000000')}`,
    '',
    '<i>ClinicIT.Solutions AI Monitoring</i>'
  ].join('\n');
}

function escapeHTML(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

