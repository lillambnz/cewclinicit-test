export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
    // Handle CORS
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };
    
    // Handle preflight OPTIONS requests
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }
  
    // Always pass API requests through to the origin (Pages Functions)
    if (url.pathname.startsWith('/api/')) {
      return fetch(request);
    }

    // Pass all other routes through as well (this worker no-ops by default)
    return fetch(request);
    try {
      if (url.pathname === '/api/health' && request.method === 'GET') {
        const country = request.cf?.country || request.headers.get('CF-IPCountry') || 'unknown';
        return json({ 
          functionsActive: true, 
          deepseekKeyPresent: Boolean(env.DEEPSEEK_API_KEY && env.DEEPSEEK_API_KEY.length > 0),
          geoRestrictionActive: true,
          allowedRegions: ['AU', 'NZ'],
          requestCountry: country,
          accessAllowed: isAllowedCountry(country),
          conversationLogging: true,
          telegramConfigured: Boolean(env.TELEGRAM_BOT_TOKEN && env.TELEGRAM_CHAT_ID),
          timestamp: new Date().toISOString() 
        }, 200, corsHeaders);
      }

      // Simple test endpoint to verify Telegram alerts independently
      if (url.pathname === '/api/test-telegram' && (request.method === 'GET' || request.method === 'POST')) {
        const country = request.cf?.country || request.headers.get('CF-IPCountry') || 'unknown';
        const clientIP = request.headers.get('CF-Connecting-IP') || request.headers.get('X-Forwarded-For') || 'unknown';
        const userAgent = request.headers.get('User-Agent') || '';
        const msg = new URL(request.url).searchParams.get('msg') || 'Test: ClinicIT AI Monitor connected';
        const logData = {
          timestamp: new Date().toISOString(),
          clientIP: maskIP(clientIP),
          country: country,
          userMessage: sanitizeForLogging(msg),
          aiResponse: 'OK',
          context: 'test',
          source: 'manual',
          tokens: 0,
          cost: '$0.000000',
          userAgent: userAgent.substring(0, 100)
        };
        await sendToTelegram(logData, env).catch(err => console.log('Telegram notification failed:', err.message));
        return json({ ok: true }, 200, corsHeaders);
      }

      // Telegram inbox endpoint removed (revert)

      if (url.pathname === '/api/analytics' && request.method === 'GET') {
        // Simple analytics endpoint (you could add authentication here)
        const country = request.cf?.country || request.headers.get('CF-IPCountry') || 'unknown';
        if (!isAllowedCountry(country)) {
          return json({ error: 'Access denied' }, 403, corsHeaders);
        }
        
        return json({
          analytics: generateConversationStats(),
          logging: {
            active: true,
            privacyCompliant: true,
            dataRetention: '30 days',
            ipMasking: true,
            contentSanitization: true
          },
          timestamp: new Date().toISOString()
        }, 200, corsHeaders);
      }

      if (url.pathname === '/api/ai-chat' && request.method === 'POST') {
        // Rate limiting and abuse prevention
        const clientIP = request.headers.get('CF-Connecting-IP') || request.headers.get('X-Forwarded-For') || 'unknown';
        const userAgent = request.headers.get('User-Agent') || '';
        
        // Geolocation check - Allow only Australia and New Zealand
        const country = request.cf?.country || request.headers.get('CF-IPCountry') || 'unknown';
        if (!isAllowedCountry(country)) {
          // Log blocked geo attempt to Telegram for awareness
          const blockedLog = {
            timestamp: new Date().toISOString(),
            clientIP: maskIP(clientIP),
            country: country,
            userMessage: sanitizeForLogging(message || ''),
            aiResponse: 'Blocked by geo policy',
            context: context,
            source: 'blocked_geo',
            tokens: 0,
            cost: '$0.000000',
            userAgent: userAgent.substring(0, 100)
          };
          sendToTelegram(blockedLog, env).catch(err => 
            console.log('Telegram notification (geo block) failed:', err.message)
          );
          return json({ 
            error: 'AI services are currently only available in Australia and New Zealand.',
            country: country,
            info: 'Please contact hello@clinicit.solutions for international inquiries.'
          }, 403, corsHeaders);
        }
        
        // Check rate limits
        const rateLimitResult = await checkRateLimit(clientIP, env);
        if (!rateLimitResult.allowed) {
          return json({ 
            error: 'Too many requests. Please wait before sending another message.',
            retryAfter: rateLimitResult.retryAfter 
          }, 429, corsHeaders);
        }

        const body = await safeJson(request);
        const sessionId = (body?.sessionId || '').toString().slice(0, 64);
        const { message, history = [], context = 'clinical_it_consultation' } = body || {};
        
        // Input validation
        if (!message || typeof message !== 'string') {
          return json({ error: 'Missing or invalid message' }, 400, corsHeaders);
        }
        
        // Message length limits
        if (message.length > 2000) {
          return json({ error: 'Message too long. Please keep messages under 2000 characters.' }, 400, corsHeaders);
        }
        
        if (message.trim().length < 3) {
          return json({ error: 'Message too short. Please provide a meaningful question.' }, 400, corsHeaders);
        }
        
        // Content filtering
        const contentCheck = checkMessageContent(message);
        if (!contentCheck.allowed) {
          // Log policy block to Telegram for visibility
          const policyLog = {
            timestamp: new Date().toISOString(),
            clientIP: maskIP(clientIP),
            country: country,
            userMessage: sanitizeForLogging(message || ''),
            aiResponse: 'Blocked by content policy',
            context: context,
            source: 'blocked_policy',
            tokens: 0,
            cost: '$0.000000',
            userAgent: userAgent.substring(0, 100)
          };
          sendToTelegram(policyLog, env).catch(err => 
            console.log('Telegram notification (policy block) failed:', err.message)
          );
          return json({ error: contentCheck.reason }, 400, corsHeaders);
        }

        if (!env.DEEPSEEK_API_KEY) {
          const fallbackResponse = fallbackMessage(context, message);
          
          // Log fallback usage
          const logData = {
            timestamp: new Date().toISOString(),
            clientIP: maskIP(clientIP),
            country: country,
            userMessage: sanitizeForLogging(message),
            aiResponse: fallbackResponse,
            context: context,
            source: 'fallback',
            tokens: 0,
            cost: '$0.000000',
            userAgent: userAgent.substring(0, 100)
          };
          logConversation(logData);
          sendToTelegram(logData, env).catch(err => 
            console.log('Telegram notification failed:', err.message)
          );
          
          return json({ response: fallbackResponse, source: 'fallback', warning: 'Missing DEEPSEEK_API_KEY' }, 200, corsHeaders);
        }

        const systemPrompt = getSystemPrompt(context);
        const messages = buildMessages(systemPrompt, history, message);

        const dsResp = await fetch('https://api.deepseek.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${env.DEEPSEEK_API_KEY}`
          },
          body: JSON.stringify({ model: 'deepseek-chat', messages, max_tokens: 700, temperature: 0.7, stream: false })
        });

        if (!dsResp.ok) {
          const detail = await safeText(dsResp);
          return json({ response: fallbackMessage(context, message), source: 'fallback', error: `DeepSeek error: ${dsResp.status}`, detail: detail?.slice(0, 500) }, 200, corsHeaders);
        }

        const data = await dsResp.json();
        const content = data?.choices?.[0]?.message?.content || fallbackMessage(context, message);
        
        // Log conversation for analytics and improvement
        const logData = {
          timestamp: new Date().toISOString(),
          clientIP: maskIP(clientIP),
          country: country,
          userMessage: sanitizeForLogging(message),
          aiResponse: content.substring(0, 500) + (content.length > 500 ? '...' : ''),
          context: context,
          source: 'deepseek',
          tokens: data?.usage?.total_tokens || 0,
          cost: estimateCost(data?.usage?.total_tokens || 0),
          userAgent: userAgent.substring(0, 100),
          sessionId
        };
        logConversation(logData);
        sendToTelegram(logData, env).catch(err => 
          console.log('Telegram notification failed:', err.message)
        );
        
        // Log usage for monitoring (optional)
        console.log(`AI Request: IP=${clientIP}, Country=${country}, tokens=${data?.usage?.total_tokens || 'unknown'}, cost=${estimateCost(data?.usage?.total_tokens || 0)}`);
        
        return json({ response: content, source: 'deepseek' }, 200, corsHeaders);
      }
    } catch (err) {
      return json({ response: fallbackMessage('clinical_it_consultation'), source: 'fallback', error: err?.message || String(err) }, 500, corsHeaders);
    }

    return new Response('Not Found', { status: 404, headers: corsHeaders });
  }
};

function json(body, status = 200, headers = {}) {
  return new Response(JSON.stringify(body), { 
    status, 
    headers: { 
      'content-type': 'application/json; charset=utf-8',
      ...headers
    } 
  });
}
async function safeJson(request) { try { return await request.json(); } catch { return {}; } }
async function safeText(resp) { try { return await resp.text(); } catch { return ''; } }

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
    clinical_it_consultation: `You are Arfa, Australia's leading clinical IT consultant AI. You specialize in:
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
  return prompts[context] || prompts.clinical_it_consultation;
}

function fallbackMessage(context) {
  const basic = {
    clinical_it_consultation: "I'm Arfa, your AI clinical IT consultant. I can help with Australian medical software, compliance, and workflow optimization. What specific challenge are you facing?",
    'content-generation': 'I can outline an article for Australian clinical IT on your topic, including compliance and implementation guidance.',
    'practice-analysis': "I can assess typical practice IT areas: infrastructure, software usage, compliance, and ROI opportunities. Share a few details about your setup to start."
  };
  return basic[context] || basic.clinical_it_consultation;
}

// Rate limiting using simple in-memory storage (for basic protection)
const rateLimitStore = new Map();

async function checkRateLimit(clientIP, env) {
  const now = Date.now();
  const windowMs = 60 * 1000; // 1 minute window
  const maxRequests = 10; // Max 10 requests per minute per IP
  
  const key = `rate_limit_${clientIP}`;
  const current = rateLimitStore.get(key) || { count: 0, resetTime: now + windowMs };
  
  // Reset if window expired
  if (now > current.resetTime) {
    current.count = 0;
    current.resetTime = now + windowMs;
  }
  
  // Check if limit exceeded
  if (current.count >= maxRequests) {
    return {
      allowed: false,
      retryAfter: Math.ceil((current.resetTime - now) / 1000)
    };
  }
  
  // Increment counter
  current.count++;
  rateLimitStore.set(key, current);
  
  // Clean up old entries (simple cleanup)
  if (rateLimitStore.size > 1000) {
    for (const [k, v] of rateLimitStore.entries()) {
      if (now > v.resetTime + windowMs) {
        rateLimitStore.delete(k);
      }
    }
  }
  
  return { allowed: true };
}

function checkMessageContent(message) {
  const lowerMessage = message.toLowerCase();
  
  // Block obvious spam patterns
  const spamPatterns = [
    /(.)\1{10,}/, // Repeated characters
    /[^\w\s]{20,}/, // Too many special characters
    /\b(crypto|bitcoin|investment|money|loan|casino|gambling)\b/i,
    /\b(buy now|click here|limited time|urgent|act now)\b/i,
    /\bhttps?:\/\/\b/i, // Block URLs
    /\b\d{4,}\b.*\b\d{4,}\b/, // Block potential credit card numbers
  ];
  
  for (const pattern of spamPatterns) {
    if (pattern.test(message)) {
      return {
        allowed: false,
        reason: 'Message contains inappropriate content. Please ask questions related to clinical IT.'
      };
    }
  }
  
  // Ensure it's somewhat related to clinical/medical/IT context
  const clinicalKeywords = [
    'medical', 'clinic', 'practice', 'patient', 'doctor', 'health', 'software', 'system',
    'ehr', 'emr', 'compliance', 'best practice', 'medical director', 'zedmed', 'it',
    'technology', 'computer', 'integration', 'workflow', 'billing', 'medicare', 'racgp'
  ];
  
  const hasRelevantContent = clinicalKeywords.some(keyword => 
    lowerMessage.includes(keyword)
  ) || message.length < 50; // Allow short questions
  
  if (!hasRelevantContent && message.length > 100) {
    return {
      allowed: false,
      reason: 'Please ask questions related to clinical IT, medical software, or healthcare technology.'
    };
  }
  
  return { allowed: true };
}

function estimateCost(tokens) {
  // DeepSeek pricing: ~$0.14 per 1M input tokens, ~$0.28 per 1M output tokens
  // Rough estimate: $0.20 per 1M tokens average
  const costPerMillion = 0.20;
  const cost = (tokens / 1000000) * costPerMillion;
  return `$${cost.toFixed(6)}`;
}

function isAllowedCountry(country) {
  const allowedCountries = [
    'AU', // Australia
    'NZ', // New Zealand
    'XX', // Unknown/local development
    'T1'  // Tor/VPN (for development testing)
  ];
  
  // Allow if country is in the allowed list or if country detection failed
  return allowedCountries.includes(country) || country === 'unknown' || !country;
}

function maskIP(ip) {
  // Mask IP for privacy - keep first 3 octets, mask last one
  if (!ip || ip === 'unknown') return 'unknown';
  const parts = ip.split('.');
  if (parts.length === 4) {
    return `${parts[0]}.${parts[1]}.${parts[2]}.xxx`;
  }
  return 'masked';
}

function sanitizeForLogging(message) {
  if (!message) return '';
  
  // Remove potential personal information
  let sanitized = message
    .replace(/\b\d{4}\s?\d{4}\s?\d{4}\s?\d{4}\b/g, '[CARD_NUMBER]') // Credit cards
    .replace(/\b\d{3}-\d{2}-\d{4}\b/g, '[SSN]') // SSN format
    .replace(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, '[EMAIL]') // Emails
    .replace(/\b\d{10,}\b/g, '[PHONE]') // Phone numbers
    .replace(/\b(?:my name is|i am|i'm called)\s+\w+/gi, '[NAME_MENTION]'); // Name mentions
  
  // Truncate if too long
  return sanitized.length > 300 ? sanitized.substring(0, 300) + '...' : sanitized;
}

function logConversation(data) {
  // Create structured log entry
  const logEntry = {
    event: 'ai_conversation',
    timestamp: data.timestamp,
    session: {
      ip: data.clientIP,
      country: data.country,
      userAgent: data.userAgent
    },
    conversation: {
      userMessage: data.userMessage,
      aiResponse: data.aiResponse,
      context: data.context,
      source: data.source
    },
    metrics: {
      tokens: data.tokens,
      cost: data.cost
    },
    privacy: {
      ipMasked: true,
      contentSanitized: true,
      retentionDays: 30
    }
  };
  
  // Log to console (visible in Cloudflare Worker logs)
  console.log('CONVERSATION_LOG:', JSON.stringify(logEntry));
  
  // Send to Telegram (async, non-blocking) - need env context
  // Note: env is not available in this scope, will be passed from caller
}

async function sendToTelegram(logEntry, env) {
  // Get Telegram credentials from environment variables
  const botToken = env?.TELEGRAM_BOT_TOKEN || '';
  const chatId = env?.TELEGRAM_CHAT_ID || '';
  
  if (!botToken || !chatId) {
    console.log('Telegram credentials not configured');
    return;
  }
  
  // Format message for Telegram (HTML with escaping)
  const message = formatTelegramMessageHTML(logEntry);
  
  try {
    const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: 'HTML',
        disable_web_page_preview: true
      })
    });
    
    if (!response.ok) {
      const detail = await response.text();
      throw new Error(`Telegram API error: ${response.status} ${detail?.slice(0,200)}`);
    }
    
    console.log('Telegram notification sent successfully');
  } catch (error) {
    console.log('Failed to send Telegram notification:', error.message);
  }
}

function formatTelegramMessage(logEntry) {
  const { session, conversation, metrics } = logEntry;
  const flag = session.country === 'AU' ? '🇦🇺' : session.country === 'NZ' ? '🇳🇿' : '🌍';
  
  return `🤖 *ClinicIT AI Usage Alert*

${flag} *Location:* ${session.country}
⏰ *Time:* ${new Date(logEntry.timestamp).toLocaleString('en-AU', { timeZone: 'Australia/Perth' })}

💬 *User Asked:*
"${conversation.userMessage}"

🎯 *AI Response Preview:*
"${conversation.aiResponse.substring(0, 100)}${conversation.aiResponse.length > 100 ? '...' : ''}"

📊 *Metrics:*
• Source: ${conversation.source}
• Tokens: ${metrics.tokens}
• Cost: ${metrics.cost}

---
*ClinicIT.Solutions AI Monitoring*`;
}

// HTML-safe formatter used by sendToTelegram
function formatTelegramMessageHTML(logEntry) {
  const { session, conversation, metrics } = logEntry;
  const flag = session.country === 'AU' ? '🇦🇺' : session.country === 'NZ' ? '🇳🇿' : '🌍';
  const ts = new Date(logEntry.timestamp).toLocaleString('en-AU', { timeZone: 'Australia/Perth' });
  const esc = escapeHTML;
  const preview = (conversation.aiResponse || '').substring(0, 100);
  const previewSuffix = (conversation.aiResponse || '').length > 100 ? '...' : '';

  return [
    '🤖 <b>ClinicIT AI Usage Alert</b>',
    '',
    `${flag} <b>Location:</b> ${esc(session.country || 'unknown')}`,
    `⏰ <b>Time:</b> ${esc(ts)}`,
    `🆔 <b>Session:</b> ${esc(logEntry.sessionId || 'n/a')}`,
    '',
    '<b>User Asked:</b>',
    `"${esc(conversation.userMessage || '')}"`,
    '',
    '<b>AI Response Preview:</b>',
    `"${esc(preview)}${previewSuffix}"`,
    '',
    '<b>Metrics:</b>',
    `• Source: ${esc(conversation.source || '')}`,
    `• Tokens: ${esc(String(metrics.tokens ?? 0))}`,
    `• Cost: ${esc(metrics.cost || '$0.000000')}`,
    '',
    `<i>Reply from Telegram:</i> type <code>/reply ${esc(logEntry.sessionId || 'SESSION_ID')}</code> your message`,
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

// Analytics helper functions
function generateConversationStats() {
  return {
    dailyConversations: 0, // You'd track this with persistent storage
    topTopics: ['practice management', 'compliance', 'software selection'],
    avgResponseTime: '2.5s',
    userSatisfaction: 'Not tracked yet'
  };
}
