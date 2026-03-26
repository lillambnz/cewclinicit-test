/**
 * AI Features Test Suite
 * Comprehensive testing for all AI components
 */

class AITestSuite {
    constructor() {
        this.tests = [];
        this.results = {
            passed: 0,
            failed: 0,
            total: 0
        };
    }

    async runAllTests() {
        console.log('🧪 Starting AI Features Test Suite...');
        console.log('=====================================');
        
        // Configuration Tests
        await this.testConfigurationLoaded();
        await this.testFeatureFlags();
        
        // Theme Integration Tests
        await this.testThemeIntegration();
        await this.testCSSVariables();
        
        // AI Chat Widget Tests
        await this.testChatWidgetCreation();
        await this.testChatInteraction();
        await this.testMobileResponsiveness();
        
        // AI Response Tests
        await this.testContextualResponses();
        await this.testErrorHandling();
        
        this.displayResults();
    }
    
    async test(name, testFunction) {
        this.results.total++;
        try {
            console.log(`🔍 Testing: ${name}`);
            await testFunction();
            console.log(`✅ PASSED: ${name}`);
            this.results.passed++;
        } catch (error) {
            console.log(`❌ FAILED: ${name} - ${error.message}`);
            this.results.failed++;
        }
    }
    
    async testConfigurationLoaded() {
        await this.test('AI Configuration Loaded', () => {
            if (typeof AI_CONFIG === 'undefined') {
                throw new Error('AI_CONFIG not loaded');
            }
            if (!AI_CONFIG.ENABLE_AI_FEATURES) {
                throw new Error('AI features not enabled');
            }
            if (!AI_CONFIG.services.chatbot.enabled) {
                throw new Error('Chatbot service not enabled');
            }
        });
    }
    
    async testFeatureFlags() {
        await this.test('Feature Flags Working', () => {
            if (!AI_CONFIG.features['ai-chat-widget']) {
                throw new Error('AI chat widget feature flag disabled');
            }
            if (!AI_CONFIG.DEVELOPMENT_MODE) {
                throw new Error('Development mode should be enabled for testing');
            }
        });
    }
    
    async testThemeIntegration() {
        await this.test('Theme Integration', () => {
            const html = document.documentElement;
            const currentTheme = html.getAttribute('data-theme');
            
            if (!currentTheme || !['light', 'dark'].includes(currentTheme)) {
                throw new Error('Invalid theme state');
            }
            
            // Test CSS variables exist
            const styles = getComputedStyle(html);
            const bgColor = styles.getPropertyValue('--background-color');
            const textColor = styles.getPropertyValue('--text-color');
            
            if (!bgColor || !textColor) {
                throw new Error('Required CSS variables not found');
            }
        });
    }
    
    async testCSSVariables() {
        await this.test('CSS Variables Available', () => {
            const styles = getComputedStyle(document.documentElement);
            const requiredVars = [
                '--accent-color',
                '--card-background', 
                '--border-color',
                '--text-color',
                '--background-color'
            ];
            
            for (const variable of requiredVars) {
                const value = styles.getPropertyValue(variable);
                if (!value.trim()) {
                    throw new Error(`Required CSS variable ${variable} not found`);
                }
            }
        });
    }
    
    async testChatWidgetCreation() {
        await this.test('Chat Widget Created', () => {
            const widget = document.getElementById('ai-chat-widget');
            const toggle = document.getElementById('chat-toggle');
            const panel = document.getElementById('chat-panel');
            
            if (!widget) {
                throw new Error('Chat widget not created');
            }
            if (!toggle) {
                throw new Error('Chat toggle button not found');
            }
            if (!panel) {
                throw new Error('Chat panel not found');
            }
            
            // Check if MedTech Clara is initialized
            if (typeof MedTechClara === 'undefined') {
                throw new Error('MedTechClara class not available');
            }
        });
    }
    
    async testChatInteraction() {
        await this.test('Chat Interaction', async () => {
            // Simulate opening chat
            const toggle = document.getElementById('chat-toggle');
            const panel = document.getElementById('chat-panel');
            
            if (toggle) {
                toggle.click();
                
                // Wait for animation
                await new Promise(resolve => setTimeout(resolve, 350));
                
                if (!panel.classList.contains('open')) {
                    throw new Error('Chat panel did not open');
                }
                
                // Test input field
                const input = document.getElementById('chat-input');
                if (!input) {
                    throw new Error('Chat input field not found');
                }
                
                // Close chat
                const closeBtn = document.getElementById('chat-close');
                if (closeBtn) {
                    closeBtn.click();
                }
            }
        });
    }
    
    async testMobileResponsiveness() {
        await this.test('Mobile Responsiveness', () => {
            const widget = document.getElementById('ai-chat-widget');
            if (!widget) {
                throw new Error('Widget not found for mobile test');
            }
            
            // Test mobile media query exists
            const styles = document.getElementById('ai-chat-styles');
            if (!styles || !styles.textContent.includes('@media (max-width: 480px)')) {
                throw new Error('Mobile responsive styles not found');
            }
        });
    }
    
    async testContextualResponses() {
        await this.test('Contextual AI Responses', () => {
            // Test if MedTech Clara instance exists
            if (!window.medTechClara && !window.MedTechClara) {
                throw new Error('MedTech Clara instance not found');
            }
            
            // Test contextual response method
            const clara = window.medTechClara || new MedTechClara();
            
            // Test integration response
            const integrationResponse = clara.getContextualResponse('How do I integrate Best Practice with Zedmed?');
            if (!integrationResponse.includes('Integration')) {
                throw new Error('Contextual response for integration failed');
            }
            
            // Test compliance response  
            const complianceResponse = clara.getContextualResponse('What are RACGP requirements?');
            if (!complianceResponse.includes('RACGP')) {
                throw new Error('Contextual response for compliance failed');
            }
        });
    }
    
    async testErrorHandling() {
        await this.test('Error Handling', () => {
            // Test that required methods exist and handle errors gracefully
            const clara = new MedTechClara();
            
            if (typeof clara.getContextualResponse !== 'function') {
                throw new Error('getContextualResponse method not found');
            }
            
            // Test error response for empty input
            try {
                const response = clara.getContextualResponse('');
                if (!response || response.length === 0) {
                    throw new Error('Empty response for empty input');
                }
            } catch (error) {
                throw new Error('Error handling failed for empty input');
            }
        });
    }
    
    displayResults() {
        console.log('\n=====================================');
        console.log('🧪 AI Test Suite Results');
        console.log('=====================================');
        console.log(`✅ Passed: ${this.results.passed}`);
        console.log(`❌ Failed: ${this.results.failed}`);
        console.log(`📊 Total:  ${this.results.total}`);
        console.log(`📈 Success Rate: ${(this.results.passed / this.results.total * 100).toFixed(1)}%`);
        
        if (this.results.failed === 0) {
            console.log('\n🎉 All tests passed! AI features are ready for deployment.');
        } else {
            console.log('\n⚠️  Some tests failed. Please review and fix issues before deployment.');
        }
        
        console.log('\n📋 Next Steps:');
        console.log('1. Review any failed tests');
        console.log('2. Test in different browsers');
        console.log('3. Verify mobile responsiveness');
        console.log('4. Prepare for production deployment');
    }
}

// Auto-run tests when page loads (in development mode)
document.addEventListener('DOMContentLoaded', () => {
    if (typeof AI_CONFIG !== 'undefined' && AI_CONFIG.DEVELOPMENT_MODE) {
        // Wait a bit for everything to initialize
        setTimeout(() => {
            const testSuite = new AITestSuite();
            testSuite.runAllTests();
        }, 2000);
    }
});

// Make available globally for manual testing
window.AITestSuite = AITestSuite;