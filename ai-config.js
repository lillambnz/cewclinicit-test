/**
 * AI Development Configuration
 * This file controls all AI features and can be easily disabled for production
 */

const AI_CONFIG = {
    // Master switch for all AI features
    ENABLE_AI_FEATURES: true,
    
    // Development vs Production mode
    DEVELOPMENT_MODE: false,  // PRODUCTION MODE - AI EMPIRE IS LIVE!
    
    // AI Services Configuration
    services: {
        chatbot: {
            enabled: true,
            provider: 'deepseek', // Primary AI provider for production
            model: 'deepseek-chat',
            base_url: 'https://api.deepseek.com',
            max_tokens: 1000,
            temperature: 0.7
        },
        
        content_generator: {
            enabled: true,
            auto_generate_articles: true, // AUTO CONTENT EMPIRE ACTIVATED!
            update_frequency: 'daily',   // Daily content generation for market dominance
            target_articles_per_month: 247
        },
        
        recommendation_engine: {
            enabled: true,
            learning_mode: true,
            confidence_threshold: 0.8
        },
        
        predictive_analytics: {
            enabled: false, // Enable in Phase 2
            data_sources: ['industry_news', 'regulatory_changes', 'user_behavior']
        }
    },
    
    // API Keys (Environment Variables)
    api_keys: {
        // Client-side code should not carry live API keys.
        // Use Cloudflare Pages Functions and environment variables instead.
        deepseek: '',
        openai: '',
        google_ai: '',
        anthropic: ''
    },
    
    // Feature Flags for Empire Launch
    features: {
        'ai-chat-widget': true,
        'smart-recommendations': true,
        'auto-content-generation': true,  // CONTENT EMPIRE UNLEASHED!
        'predictive-insights': true,
        'ai-troubleshooting': true,
        'clinic-analyzer': true,
        'software-matchmaker': true,
        'roi-calculator': true,
        'smart-knowledge-base': true
    },
    
    // Development Tools
    debug: {
        log_ai_requests: true,
        show_confidence_scores: true,
        enable_test_mode: true
    }
};

// Export for both browser and Node.js environments
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AI_CONFIG;
} else {
    window.AI_CONFIG = AI_CONFIG;
}
