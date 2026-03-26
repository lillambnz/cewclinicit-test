// Cloudflare Pages Function: /api/ai-chat
// Proxies chat requests to DeepSeek using a server-side API key.

export async function onRequestPost({ request, env }) {
  try {
    const { message, history = [], context = 'clinical_it_consultation' } = await request.json();

    // Basic request context for logging/telemetry
    const clientIP = request.headers.get('CF-Connecting-IP') || request.headers.get('X-Forwarded-For') || 'unknown';
    const userAgent = request.headers.get('User-Agent') || '';
    const country = (request.cf && request.cf.country) || request.headers.get('CF-IPCountry') || 'unknown';

    if (!message || typeof message !== 'string') {
      return json({ error: 'Missing message' }, 400);
    }

    // If no API key configured, return a safe fallback response
    if (!env.DEEPSEEK_API_KEY) {
      const fallback = fallbackMessage(context, message);
      // Fire-and-forget Telegram log if configured
      const logData = {
        timestamp: new Date().toISOString(),
        clientIP: maskIP(clientIP),
        country,
        userMessage: sanitizeForLogging(message || ''),
        aiResponse: fallback,
        context,
        source: 'fallback',
        tokens: 0,
        cost: '$0.000000',
        userAgent: userAgent.substring(0, 100)
      };
      sendToTelegram(logData, env).catch(() => {});
      return json({
        response: fallback,
        source: 'fallback',
        warning: 'Missing DEEPSEEK_API_KEY in environment'
      });
    }

    const systemPrompt = getSystemPrompt(context);
    const messages = buildMessages(systemPrompt, history, message);

    const dsResp = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${env.DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages,
        max_tokens: 700,
        temperature: 0.7,
        stream: false
      })
    });

    if (!dsResp.ok) {
      const detail = await safeText(dsResp);
      return json({
        response: fallbackMessage(context, message),
        source: 'fallback',
        error: `DeepSeek error: ${dsResp.status}`,
        detail: detail?.slice(0, 500) || undefined
      });
    }

    const data = await dsResp.json();
    const content = data?.choices?.[0]?.message?.content || fallbackMessage(context, message);

    // Prepare and send Telegram log (non-blocking)
    const logData = {
      timestamp: new Date().toISOString(),
      clientIP: maskIP(clientIP),
      country,
      userMessage: sanitizeForLogging(message || ''),
      aiResponse: (content || '').substring(0, 500) + ((content || '').length > 500 ? '...' : ''),
      context,
      source: 'deepseek',
      tokens: data?.usage?.total_tokens || 0,
      cost: estimateCost(data?.usage?.total_tokens || 0),
      userAgent: userAgent.substring(0, 100)
    };
    sendToTelegram(logData, env).catch(() => {});

    return json({ response: content, source: 'deepseek' });
  } catch (err) {
    return json({
      response: fallbackMessage('clinical_it_consultation'),
      source: 'fallback',
      error: err?.message || String(err)
    });
  }
}

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8' }
  });
}

function buildMessages(systemPrompt, history, userMessage) {
  const msgs = [{ role: 'system', content: systemPrompt }];
  if (Array.isArray(history)) {
    for (const h of history.slice(-5)) {
      const role = h?.sender === 'ai' ? 'assistant' : 'user';
      const content = typeof h?.content === 'string' ? h.content : '';
      if (content) msgs.push({ role, content });
    }
  }
  msgs.push({ role: 'user', content: userMessage });
  return msgs;
}

function getSystemPrompt(context) {
  const prompts = {
    'clinical_it_consultation': `You are Arfa, Australia's leading clinical IT consultant AI. You specialize in:
- Australian medical software (Best Practice, Medical Director, Zedmed)
- RACGP and Medicare compliance requirements
- Practice management system optimization
- Clinical workflow automation
- Healthcare cybersecurity

Respond professionally with specific, actionable advice for Australian medical practices. Keep responses concise but comprehensive.`,
    'content-generation': `You are a clinical IT content expert creating authoritative articles for Australian healthcare professionals. Focus on:
- Latest medical software developments
- Regulatory compliance updates
- Practice efficiency improvements
- Technology adoption strategies
- Industry trend analysis

Generate SEO-optimized, professionally written content that establishes market authority.`,
    'practice-analysis': `You are an expert practice analyzer for Australian medical clinics. Analyze practices based on:
- IT infrastructure efficiency
- Software utilization optimization
- Compliance with Australian healthcare regulations
- ROI opportunities for technology investments
- Staff productivity improvements

Provide specific, measurable recommendations with confidence scores.`
  };
  return prompts[context] || prompts['clinical_it_consultation'];
}

function fallbackMessage(context, original) {
  const basic = {
    'clinical_it_consultation': "I'm Arfa, your AI clinical IT consultant. I can help with Australian medical software, compliance, and workflow optimization. What specific challenge are you facing?",
    'content-generation': 'I can outline an article for Australian clinical IT on your topic, including compliance and implementation guidance.',
    'practice-analysis': "I can assess typical practice IT areas: infrastructure, software usage, compliance, and ROI opportunities. Share a few details about your setup to start."
  };
  return basic[context] || basic['clinical_it_consultation'];
}

async function safeText(resp) {
  try { return await resp.text(); } catch { return ''; }
}

// ---- Telegram + logging helpers (HTML parse mode) ----

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

function estimateCost(tokens) {
  // Adjust if your pricing differs
  const cost = (tokens / 1_000_000) * 2.0; // example: $2 per 1M tokens
  return `$${cost.toFixed(6)}`;
}

async function sendToTelegram(logEntry, env) {
  const botToken = env?.TELEGRAM_BOT_TOKEN || '';
  const chatId = env?.TELEGRAM_CHAT_ID || '';
  if (!botToken || !chatId) return; // quietly skip if not configured

  const text = formatTelegramMessageHTML(logEntry);
  const resp = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'HTML', disable_web_page_preview: true })
  });
  if (!resp.ok) {
    // Swallow errors to avoid breaking user flow; could log here
    // const detail = await resp.text();
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
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
