/**
 * Arfa - AI Chat Assistant for Clinical IT
 * Provides instant answers about healthcare technology, integrations, and compliance
 */

class ArfaAI {
    constructor() {
        this.isEnabled = AI_CONFIG.features['ai-chat-widget'];
        this.isOpen = false;
        this.conversationHistory = [];
        this.gasLoggerUrl = (window && window.GAS_LOGGER_URL) ? window.GAS_LOGGER_URL : '';
        
        if (this.isEnabled) {
            this.init();
        }
    }
    
    init() {
        this.createChatWidget();
        this.bindEvents();
        this.loadKnowledgeBase();
    }
    
    createChatWidget() {
        const chatHTML = `
            <div id="ai-chat-widget" class="ai-chat-widget ${AI_CONFIG.DEVELOPMENT_MODE ? 'dev-mode' : ''}">
                <div id="chat-toggle" class="chat-toggle">
                    <div class="chat-icon">
                        <i class="fas fa-robot"></i>
                        <span class="chat-label">Ask Arfa AI</span>
                    </div>
                    ${AI_CONFIG.DEVELOPMENT_MODE ? '<span class="dev-badge">DEV</span>' : ''}
                </div>
                
                <div id="chat-panel" class="chat-panel">
                    <div class="chat-header">
                        <div class="ai-avatar">
                            <i class="fas fa-robot"></i>
                        </div>
                        <div class="ai-info">
                            <h4>Arfa</h4>
                            <p>Your AI Clinical IT Specialist</p>
                        </div>
                        <button id="chat-close" class="chat-close">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    
                    <div id="chat-messages" class="chat-messages">
                        <div class="message ai-message">
                            <div class="message-content">
                                <p>Hi! I'm Arfa, your AI assistant for clinical IT questions.</p>
                                <p>Ask me about:</p>
                                <ul>
                                    <li>Software integrations (Best Practice, Medical Director, Zedmed)</li>
                                    <li>RACGP & Medicare compliance</li>
                                    <li>System troubleshooting</li>
                                    <li>Cost optimization</li>
                                    <li>Implementation planning</li>
                                </ul>
                                <p><strong>What can I help you with today?</strong></p>
                            </div>
                        </div>
                    </div>
                    
                    <div class="chat-input-container">
                        <div class="chat-input-wrapper">
                            <input 
                                type="text" 
                                id="chat-input" 
                                placeholder="Ask about clinical IT, integrations, compliance..."
                                autocomplete="off"
                            >
                            <button id="chat-send" class="chat-send">
                                <i class="fas fa-paper-plane"></i>
                            </button>
                        </div>
                        <div class="chat-suggestions">
                            <button class="suggestion-btn" data-question="How do I integrate Best Practice with Zedmed?">
                                Integration Help
                            </button>
                            <button class="suggestion-btn" data-question="What are the RACGP IT requirements for 2024?">
                                Compliance Check
                            </button>
                            <button class="suggestion-btn" data-question="My practice management system is slow, what should I do?">
                                Troubleshooting
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', chatHTML);
        this.loadChatStyles();
    }
    
    bindEvents() {
        const toggle = document.getElementById('chat-toggle');
        const close = document.getElementById('chat-close');
        const send = document.getElementById('chat-send');
        const input = document.getElementById('chat-input');
        const suggestions = document.querySelectorAll('.suggestion-btn');
        
        toggle.addEventListener('click', () => this.toggleChat());
        close.addEventListener('click', () => this.closeChat());
        send.addEventListener('click', () => this.sendMessage());
        
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.sendMessage();
        });
        
        suggestions.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const question = e.target.getAttribute('data-question');
                this.sendMessage(question);
            });
        });
    }
    
    toggleChat() {
        this.isOpen = !this.isOpen;
        const panel = document.getElementById('chat-panel');
        panel.classList.toggle('open', this.isOpen);
        
        if (this.isOpen) {
            document.getElementById('chat-input').focus();
        }
    }
    
    closeChat() {
        this.isOpen = false;
        document.getElementById('chat-panel').classList.remove('open');
    }
    
    async sendMessage(text = null) {
        const input = document.getElementById('chat-input');
        const message = text || input.value.trim();
        
        if (!message) return;
        
        // Clear input and add user message
        input.value = '';
        this.addMessage(message, 'user');
        
        // Show typing indicator
        this.showTypingIndicator();
        
        try {
            // Get AI response
            const response = await this.getAIResponse(message);
            this.hideTypingIndicator();
            this.addMessage(response, 'ai');
            // Fire-and-forget: log to GAS -> Telegram via GET beacon (no CORS)
            this.logToGAS({
                event: 'ai_chat',
                message,
                preview: (response || '').toString().slice(0, 160),
            });
            // Minimal: GA event + optional Formspree email
            try { window.EASY_LOGGER && window.EASY_LOGGER.gaEvent && window.EASY_LOGGER.gaEvent('ai_chat', { message: String(message).slice(0,80) }); } catch(_){}
            try { window.EASY_LOGGER && window.EASY_LOGGER.emailAlert && window.EASY_LOGGER.emailAlert({ message, preview: (response||'').toString().slice(0,160) }); } catch(_){}
            // Optional: Cloudflare Zaraz native event (if enabled on domain)
            try {
                if (window.zaraz && typeof window.zaraz.track === 'function') {
                    window.zaraz.track('ai_chat', {
                        message: String(message).slice(0, 500),
                        preview: String(response || '').slice(0, 160),
                        page: window.location.href
                    });
                }
            } catch (_) { /* ignore */ }
        } catch (error) {
            console.error('AI Response Error:', error);
            this.hideTypingIndicator();
            this.addMessage('I apologize, but I\'m experiencing technical difficulties. Please try again or contact our support team directly.', 'ai', true);
            // Log failure as well
            this.logToGAS({ event: 'ai_chat_error', message, preview: String(error && error.message || error).slice(0,160) });
            try { window.EASY_LOGGER && window.EASY_LOGGER.gaEvent && window.EASY_LOGGER.gaEvent('ai_chat_error', { message: String(message).slice(0,80) }); } catch(_){}
            try { window.EASY_LOGGER && window.EASY_LOGGER.emailAlert && window.EASY_LOGGER.emailAlert({ subject: 'AI Chat Error', message, preview: String(error && error.message || error).slice(0,160) }); } catch(_){}
            try {
                if (window.zaraz && typeof window.zaraz.track === 'function') {
                    window.zaraz.track('ai_chat_error', {
                        message: String(message).slice(0, 500),
                        preview: String(error && error.message || error).slice(0, 160),
                        page: window.location.href
                    });
                }
            } catch (_) { /* ignore */ }
        }
    }
    
    addMessage(content, sender, isError = false) {
        const messagesContainer = document.getElementById('chat-messages');
        const messageHTML = `
            <div class="message ${sender}-message ${isError ? 'error-message' : ''}">
                <div class="message-content">
                    ${sender === 'ai' ? this.formatAIResponse(content) : `<p>${content}</p>`}
                </div>
                ${AI_CONFIG.debug.show_confidence_scores && sender === 'ai' ? 
                    `<div class="confidence-score">Confidence: 85%</div>` : ''}
            </div>
        `;
        
        messagesContainer.insertAdjacentHTML('beforeend', messageHTML);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        
        // Store in conversation history
        this.conversationHistory.push({ sender, content, timestamp: new Date() });
    }

    logToGAS({ event, message, preview }) {
        try {
            if (!this.gasLoggerUrl) return;
            const params = new URLSearchParams({
                event: String(event || 'log'),
                msg: String(message || '').slice(0, 500),
                preview: String(preview || '').slice(0, 200),
                page: window.location.href,
                ua: navigator.userAgent.slice(0, 100)
            });
            const img = new Image();
            img.src = `${this.gasLoggerUrl}?${params.toString()}`;
        } catch (_) {
            // ignore
        }
    }
    
    formatAIResponse(content) {
        // Convert markdown-style formatting to HTML
        return content
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/\n\n/g, '</p><p>')
            .replace(/^(.*)$/gm, '<p>$1</p>')
            .replace(/^- (.*?)$/gm, '<li>$1</li>')
            .replace(/(<li>.*<\/li>)/gs, '<ul>$1</ul>');
    }
    
    showTypingIndicator() {
        const indicator = `
            <div id="typing-indicator" class="message ai-message typing">
                <div class="message-content">
                    <div class="typing-dots">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                </div>
            </div>
        `;
        document.getElementById('chat-messages').insertAdjacentHTML('beforeend', indicator);
        document.getElementById('chat-messages').scrollTop = document.getElementById('chat-messages').scrollHeight;
    }
    
    hideTypingIndicator() {
        const indicator = document.getElementById('typing-indicator');
        if (indicator) indicator.remove();
    }
    
    async getAIResponse(message) {
        // 1) Development: return contextual responses
        if (AI_CONFIG.DEVELOPMENT_MODE) {
            return this.getContextualResponse(message);
        }

        // 2) Try backend endpoint if present
        try {
            const controller = new AbortController();
            const timeout = setTimeout(() => controller.abort(), 8000);
            // Ensure a stable session id for operator replies
            const sessionId = this.getSessionId();
            const response = await fetch('/api/ai-chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message,
                    history: this.conversationHistory.slice(-5),
                    context: 'clinical_it_consultation',
                    sessionId
                }),
                signal: controller.signal
            });
            clearTimeout(timeout);

            if (response.ok) {
                const data = await response.json();
                if (data && data.response) return data.response;
            } else if (response.status === 404) {
                console.warn('AI endpoint /api/ai-chat not found. Falling back to client-side integration.');
            } else {
                console.warn('AI endpoint responded with status', response.status, '— falling back to client-side integration.');
            }
        } catch (err) {
            console.warn('Backend AI endpoint unreachable — falling back to client-side integration.', err && err.message ? err.message : err);
        }

    

        // 3) Fallback: use DeepSeek integration if available
        if (window.deepSeekAI && typeof window.deepSeekAI.generateChatResponse === 'function') {
            try {
                const result = await window.deepSeekAI.generateChatResponse(message, 'clinical-it');
                if (result && result.success && result.message) return result.message;
            } catch (e) {
                console.warn('DeepSeek fallback failed, reverting to contextual response. Reason:', e && e.message ? e.message : e);
            }
        }

        // 4) Last resort: contextual response
        return this.getContextualResponse(message);
    }
    
    getSessionId() {
        try {
            const key = 'clinicit_session_id';
            let id = localStorage.getItem(key);
            if (!id) {
                id = Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-6);
                localStorage.setItem(key, id);
            }
            return id;
        } catch {
            return 'sess_' + Math.random().toString(36).slice(2, 10);
        }
    }
    
    startOperatorReplyPolling() {
        const sessionId = this.getSessionId();
        if (this._replyPoller) return;
        const poll = async () => {
            try {
                const resp = await fetch(`/api/telegram-inbox?sessionId=${encodeURIComponent(sessionId)}`);
                if (resp.ok) {
                    const data = await resp.json();
                    if (Array.isArray(data.replies) && data.replies.length) {
                        for (const r of data.replies.slice(-3)) {
                            this.addMessage(r.text || '', 'ai');
                        }
                    }
                }
            } catch (_) {}
        };
        poll();
        this._replyPoller = setInterval(poll, 10000);
    }

    // No operator polling

    getContextualResponse(message) {
        const msg = message.toLowerCase();
        
        // Integration questions
        if (msg.includes('integrat') || msg.includes('connect')) {
            return `🔗 **System Integration Help**\n\nI can help you connect your clinical systems! Based on your question about "${message}", here are some key points:\n\n**Common Integration Scenarios:**\n- Best Practice + Zedmed: Use HL7 messaging for seamless data flow\n- Medical Director + Pathology labs: FHIR API integration recommended\n- Practice management + Telehealth: Most platforms support OAuth connections\n\n**Next Steps:**\n1. Identify your current software versions\n2. Check API documentation for both systems\n3. Plan your data mapping strategy\n\nWould you like specific guidance for your particular software combination?`;
        }
        
        // Compliance questions
        if (msg.includes('racgp') || msg.includes('compliance') || msg.includes('medicare')) {
            return `📋 **Compliance Guidance**\n\nGreat question about compliance! Here's what you need to know:\n\n**RACGP Standards (2024):**\n- Patient data encryption at rest and in transit\n- Regular security audits and staff training\n- Backup and disaster recovery procedures\n- Access control and user authentication\n\n**Medicare Requirements:**\n- Electronic claiming compliance\n- Patient privacy safeguards\n- Audit trail maintenance\n\n**Action Items:**\n✅ Review your current security settings\n✅ Update staff training materials\n✅ Schedule quarterly compliance reviews\n\nNeed help with a specific compliance area?`;
        }
        
        // Troubleshooting
        if (msg.includes('slow') || msg.includes('problem') || msg.includes('error') || msg.includes('crash')) {
            return `🔧 **Troubleshooting Assistant**\n\nI can help diagnose your system issues! For "${message}", let's start with these common solutions:\n\n**Quick Fixes to Try:**\n1. **Restart your practice management software**\n2. **Clear browser cache** (if web-based)\n3. **Check network connectivity**\n4. **Update to latest software version**\n\n**If problems persist:**\n- Check system requirements vs. current hardware\n- Review error logs for specific error codes\n- Contact your IT provider with exact error messages\n\n**Performance Optimization:**\n- Regular database maintenance\n- Adequate RAM (minimum 8GB recommended)\n- SSD storage for faster data access\n\nWhat specific symptoms are you experiencing?`;
        }
        
        // Cost/ROI questions
        if (msg.includes('cost') || msg.includes('price') || msg.includes('roi') || msg.includes('save')) {
            return `💰 **Cost Analysis & ROI**\n\nSmart question about costs! Let me break down the financial aspects:\n\n**Typical IT Investment ROI:**\n- Practice Management upgrade: 15-25% efficiency gain\n- System integration: Saves 2-4 hours/day staff time\n- Cloud migration: Reduces IT maintenance by 30-50%\n\n**Cost Optimization Strategies:**\n1. **Audit current software licenses** - eliminate duplicates\n2. **Consider cloud-based solutions** - reduce hardware costs\n3. **Automate routine tasks** - reduce manual labor\n4. **Negotiate vendor contracts** - often 10-15% savings available\n\n**Hidden Costs to Watch:**\n- Data migration and training\n- Downtime during implementation\n- Ongoing support and maintenance\n\nWould you like a personalized ROI calculation for your practice?`;
        }
        
        // Default response
        return `🤖 **Happy to Help!**\n\nThanks for your question about "${message}". I'm Arfa, your AI Clinical IT specialist, and I'm here to help with:\n\n**My Expertise Areas:**\n- Software integrations and compatibility\n- RACGP and Medicare compliance\n- System troubleshooting and optimization\n- Cost analysis and ROI planning\n- Implementation project guidance\n\n**Popular Topics:**\n- "How do I integrate Best Practice with [other system]?"\n- "What are the latest RACGP IT requirements?"\n- "My system is slow - how can I optimize it?"\n- "What's the ROI of upgrading our practice management?"\n\nCould you provide more details about your specific situation so I can give you targeted advice?`;
    }
    
    loadKnowledgeBase() {
        // Load clinical IT knowledge base for better responses
        // This would typically load from a JSON file or API
        console.log('Loading AI knowledge base...');
    }
    
    loadChatStyles() {
        if (document.getElementById('ai-chat-styles')) return;
        
        const styles = `
            <style id="ai-chat-styles">
                .ai-chat-widget {
                    position: fixed;
                    bottom: 20px;
                    right: 20px;
                    z-index: 999998;
                    font-family: var(--font-family, 'Inter', sans-serif);
                }
                
                .chat-toggle {
                    background: linear-gradient(135deg, var(--accent-color), var(--accent-hover));
                    color: white;
                    padding: 15px 20px;
                    border-radius: 50px;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    box-shadow: 0 4px 20px rgba(16, 163, 127, 0.3);
                    transition: all 0.3s ease;
                    position: relative;
                }
                
                .chat-toggle:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 25px rgba(16, 163, 127, 0.4);
                }
                
                .dev-badge {
                    position: absolute;
                    top: -8px;
                    right: -8px;
                    background: #ff6b6b;
                    color: white;
                    font-size: 10px;
                    padding: 2px 6px;
                    border-radius: 10px;
                    font-weight: bold;
                }
                
                .chat-icon i {
                    font-size: 20px;
                    margin-right: 5px;
                }
                
                .chat-label {
                    font-weight: 600;
                    font-size: 14px;
                }
                
                .chat-panel {
                    position: absolute;
                    bottom: 80px;
                    right: 0;
                    width: 400px;
                    height: 600px;
                    background: var(--card-background);
                    border-radius: 20px;
                    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
                    border: 1px solid var(--border-color);
                    display: flex;
                    flex-direction: column;
                    opacity: 0;
                    transform: translateY(20px) scale(0.95);
                    visibility: hidden;
                    transition: all 0.3s ease;
                }
                
                .chat-panel.open {
                    opacity: 1;
                    transform: translateY(0) scale(1);
                    visibility: visible;
                }
                
                .chat-header {
                    background: linear-gradient(135deg, var(--primary-green, #10a37f), #0d8f6f);
                    color: white;
                    padding: 20px;
                    border-radius: 20px 20px 0 0;
                    display: flex;
                    align-items: center;
                    gap: 15px;
                }
                
                .ai-avatar {
                    width: 45px;
                    height: 45px;
                    background: rgba(255, 255, 255, 0.2);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 20px;
                }
                
                .ai-info h4 {
                    margin: 0;
                    font-size: 16px;
                    font-weight: 600;
                }
                
                .ai-info p {
                    margin: 0;
                    font-size: 12px;
                    opacity: 0.9;
                }
                
                .chat-close {
                    background: none;
                    border: none;
                    color: white;
                    font-size: 18px;
                    cursor: pointer;
                    margin-left: auto;
                    padding: 5px;
                    border-radius: 50%;
                    transition: background-color 0.2s;
                }
                
                .chat-close:hover {
                    background: rgba(255, 255, 255, 0.2);
                }
                
                .chat-messages {
                    flex: 1;
                    overflow-y: auto;
                    padding: 20px;
                    display: flex;
                    flex-direction: column;
                    gap: 15px;
                }
                
                .message {
                    display: flex;
                    flex-direction: column;
                    max-width: 85%;
                }
                
                .user-message {
                    align-self: flex-end;
                }
                
                .ai-message {
                    align-self: flex-start;
                }
                
                .message-content {
                    padding: 12px 16px;
                    border-radius: 18px;
                    line-height: 1.5;
                }
                
                .user-message .message-content {
                    background: var(--accent-color);
                    color: white;
                }
                
                .ai-message .message-content {
                    background: var(--card-background);
                    color: var(--text-color);
                    border: 1px solid var(--border-color);
                }
                
                .message-content p {
                    margin: 0 0 8px 0;
                }
                
                .message-content p:last-child {
                    margin: 0;
                }
                
                .message-content ul {
                    margin: 8px 0;
                    padding-left: 20px;
                }
                
                .message-content li {
                    margin: 4px 0;
                }
                
                .typing-dots {
                    display: flex;
                    gap: 4px;
                    align-items: center;
                }
                
                .typing-dots span {
                    width: 8px;
                    height: 8px;
                    border-radius: 50%;
                    background: var(--text-secondary, #718096);
                    animation: typing 1.4s infinite;
                }
                
                .typing-dots span:nth-child(2) {
                    animation-delay: 0.2s;
                }
                
                .typing-dots span:nth-child(3) {
                    animation-delay: 0.4s;
                }
                
                @keyframes typing {
                    0%, 60%, 100% { opacity: 0.3; }
                    30% { opacity: 1; }
                }
                
                .confidence-score {
                    font-size: 10px;
                    color: var(--text-muted, #a0aec0);
                    margin-top: 5px;
                }
                
                .chat-input-container {
                    padding: 20px;
                    border-top: 1px solid var(--border-color, #e2e8f0);
                }
                
                .chat-input-wrapper {
                    display: flex;
                    gap: 10px;
                    margin-bottom: 15px;
                }
                
                .chat-input-wrapper input {
                    flex: 1;
                    padding: 12px 16px;
                    border: 1px solid var(--border-color);
                    border-radius: 25px;
                    outline: none;
                    font-size: 14px;
                    background: var(--background-color);
                    color: var(--text-color);
                }
                
                .chat-input-wrapper input:focus {
                    border-color: var(--accent-color);
                    box-shadow: 0 0 0 3px rgba(16, 163, 127, 0.1);
                }
                
                .chat-send {
                    background: var(--accent-color);
                    color: white;
                    border: none;
                    width: 45px;
                    height: 45px;
                    border-radius: 50%;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.2s;
                }
                
                .chat-send:hover {
                    background: var(--accent-hover);
                    transform: scale(1.05);
                }
                
                .chat-suggestions {
                    display: flex;
                    gap: 8px;
                    flex-wrap: wrap;
                }
                
                .suggestion-btn {
                    background: var(--bg-accent, #f0f9f6);
                    color: var(--text-primary, #2d3748);
                    border: 1px solid var(--border-color, #e2e8f0);
                    padding: 8px 12px;
                    border-radius: 20px;
                    font-size: 12px;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                
                .suggestion-btn:hover {
                    background: var(--primary-green, #10a37f);
                    color: white;
                    border-color: var(--primary-green, #10a37f);
                }
                
                @media (max-width: 480px) {
                    .chat-panel {
                        width: 90vw;
                        height: 80vh;
                        right: 5vw;
                    }
                }
                
                /* Dark theme support removed: light theme only */
            </style>
        `;
        
        document.head.insertAdjacentHTML('beforeend', styles);
    }
    
    // Public methods for external access
    openChat() {
        this.showChat();
    }
    
    showChat() {
        const panel = document.getElementById('chat-panel');
        if (panel) {
            panel.classList.add('open');
            this.isOpen = true;
            // Begin polling for operator replies when chat is opened
            this.startOperatorReplyPolling();
            
            // Focus on input
            setTimeout(() => {
                const input = document.getElementById('chat-input');
                if (input) input.focus();
            }, 300);
        } else {
            if (typeof window !== 'undefined' && typeof window.showToast === 'function') {
                window.showToast('AI chat is still loading. Please try again.', 'warning');
            }
        }
    }
    
    hideChat() {
        const panel = document.getElementById('chat-panel');
        if (panel) {
            panel.classList.remove('open');
            this.isOpen = false;
        }
    }
    
    toggleChat() {
        if (this.isOpen) {
            this.hideChat();
        } else {
            this.showChat();
        }
    }
}

// Initialize AI chat when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    if (typeof AI_CONFIG !== 'undefined' && AI_CONFIG.ENABLE_AI_FEATURES) {
        window.arfaAI = new ArfaAI();
        window.medTechClara = window.arfaAI; // Keep backward compatibility
        console.log('🤖 Arfa AI initialized');
    }
});
