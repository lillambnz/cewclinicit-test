/**
 * DeepSeek AI Integration for ClinicIT.Solutions AI Empire
 * High-performance, cost-effective AI backend
 */

class DeepSeekAI {
    constructor() {
        // Read from AI_CONFIG to avoid hardcoding secrets in code
        try {
            this.apiKey = (typeof AI_CONFIG !== 'undefined' && AI_CONFIG.api_keys && AI_CONFIG.api_keys.deepseek)
                ? AI_CONFIG.api_keys.deepseek
                : '';
        } catch (_) {
            this.apiKey = '';
        }
        this.baseUrl = 'https://api.deepseek.com/v1';
        this.model = 'deepseek-chat';
        this.initialized = false;
    }

    async initialize() {
        console.log('🤖 DeepSeek AI: Initializing high-performance backend...');
        if (!this.apiKey || /^sk-?\b?(?:your|test|example)/i.test(this.apiKey)) {
            console.warn('⚠️ DeepSeek API key is not set. Live AI responses will use local fallbacks.');
        }
        this.initialized = true;
        console.log('✅ DeepSeek AI: Ready for Australian Clinical IT');
    }

    async generateChatResponse(userMessage, context = 'clinical-it') {
        if (!this.initialized) await this.initialize();

        const systemPrompt = this.getSystemPrompt(context);
        
        try {
            if (!this.apiKey) {
                throw new Error('Missing DeepSeek API key');
            }
            const response = await fetch(`${this.baseUrl}/chat/completions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.apiKey}`
                },
                body: JSON.stringify({
                    model: this.model,
                    messages: [
                        { role: 'system', content: systemPrompt },
                        { role: 'user', content: userMessage }
                    ],
                    max_tokens: 1000,
                    temperature: 0.7,
                    stream: false
                })
            });

            if (!response.ok) {
                throw new Error(`DeepSeek API Error: ${response.status}`);
            }

            const data = await response.json();
            return {
                success: true,
                message: data.choices[0].message.content,
                confidence: 0.9,
                source: 'deepseek-ai'
            };

        } catch (error) {
            console.warn('DeepSeek API unavailable or misconfigured, using fallback. Reason:', error && error.message ? error.message : error);
            return this.getFallbackResponse(userMessage, context);
        }
    }

    getSystemPrompt(context) {
        const prompts = {
            'clinical-it': `You are Arfa, Australia's leading clinical IT consultant AI. You specialize in:
- Australian medical software (Best Practice, Medical Director, Zedmed)
- RACGP and Medicare compliance requirements
- Practice management system optimization
- Clinical workflow automation
- Healthcare cybersecurity

Respond professionally with specific, actionable advice for Australian medical practices. Keep responses concise but comprehensive.`,

            'practice-analysis': `You are an expert practice analyzer for Australian medical clinics. Analyze practices based on:
- IT infrastructure efficiency
- Software utilization optimization
- Compliance with Australian healthcare regulations
- ROI opportunities for technology investments
- Staff productivity improvements

Provide specific, measurable recommendations with confidence scores.`,

            'content-generation': `You are a clinical IT content expert creating authoritative articles for Australian healthcare professionals. Focus on:
- Latest medical software developments
- Regulatory compliance updates
- Practice efficiency improvements
- Technology adoption strategies
- Industry trend analysis

Generate SEO-optimized, professionally written content that establishes market authority.`
        };

        return prompts[context] || prompts['clinical-it'];
    }

    getFallbackResponse(userMessage, context) {
        const fallbacks = {
            'clinical-it': "I'm Arfa, your AI clinical IT consultant. I'm currently processing your request and will provide expert guidance on Australian medical practice technology shortly. What specific IT challenge would you like to discuss?",
            
            'practice-analysis': "I'm analyzing your practice's IT infrastructure. Based on typical Australian medical practices, I recommend focusing on practice management system optimization, cloud migration for better accessibility, and cybersecurity enhancements. Would you like a detailed assessment?",
            
            'software-recommendation': "For Australian practices, I typically recommend Best Practice for comprehensive functionality, Medical Director for established workflows, or Zedmed for cost-effectiveness. Each has specific advantages depending on your practice size and needs."
        };

        return {
            success: true,
            message: fallbacks[context] || fallbacks['clinical-it'],
            confidence: 0.8,
            source: 'fallback-system'
        };
    }

    async generateContent(topic, type = 'article') {
        const prompt = `Write a comprehensive ${type} about "${topic}" for Australian medical practices. Include:
- Current industry context
- Practical implementation steps
- Australian compliance considerations
- ROI and efficiency benefits
- Specific software/vendor recommendations

Target 800-1200 words, professional tone, SEO-optimized.`;

        return await this.generateChatResponse(prompt, 'content-generation');
    }

    async analyzeUserIntent(message) {
        // Simple intent classification for now
        const intents = {
            'software': /software|system|application|platform/i,
            'compliance': /compliance|regulation|racgp|medicare/i,
            'cost': /cost|price|budget|roi|investment/i,
            'support': /help|support|troubleshoot|problem/i,
            'integration': /integration|connect|sync|interoperability/i
        };

        for (const [intent, pattern] of Object.entries(intents)) {
            if (pattern.test(message)) {
                return intent;
            }
        }
        return 'general';
    }
}

// Initialize global DeepSeek AI instance
window.deepSeekAI = new DeepSeekAI();

// Auto-initialize when loaded
document.addEventListener('DOMContentLoaded', () => {
    if (typeof AI_CONFIG !== 'undefined' && AI_CONFIG.ENABLE_AI_FEATURES) {
        window.deepSeekAI.initialize();
    }
});

console.log('🚀 DeepSeek AI Integration: Loaded and ready for production');
