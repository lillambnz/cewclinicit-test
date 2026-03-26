/**
 * Cookie Consent Manager for ClinicIT.Solutions
 * Compliant with Australian Privacy Act 1988 and GDPR standards
 */

class CookieConsent {
    constructor() {
        this.cookieName = 'clinicit_cookie_consent';
        this.consentDuration = 365; // days
        this.init();
    }

    init() {
        this.createConsentBanner();
        this.checkExistingConsent();
        this.setupEventListeners();
    }

    createConsentBanner() {
        const banner = document.createElement('div');
        banner.id = 'cookie-consent-banner';
        banner.className = 'cookie-consent-banner';
        banner.innerHTML = `
            <div class="cookie-consent-container">
                <div class="cookie-consent-content">
                    <div class="cookie-consent-text">
                        <h3>Cookie Preferences</h3>
                        <p>We use cookies to enhance your browsing experience, provide personalized content, and analyze our traffic. You can choose which cookies you're comfortable with.</p>
                    </div>
                    <div class="cookie-consent-actions">
                        <button id="cookie-accept-all" class="cookie-btn cookie-btn-primary">Accept All</button>
                        <button id="cookie-customize" class="cookie-btn cookie-btn-secondary">Customize</button>
                        <button id="cookie-reject-all" class="cookie-btn cookie-btn-tertiary">Reject All</button>
                    </div>
                </div>
                <div class="cookie-consent-details" id="cookie-details" style="display: none;">
                    <div class="cookie-categories">
                        <div class="cookie-category">
                            <div class="cookie-category-header">
                                <label class="cookie-toggle">
                                    <input type="checkbox" id="essential-cookies" checked disabled>
                                    <span class="cookie-toggle-slider"></span>
                                </label>
                                <h4>Essential Cookies <span class="required">(Required)</span></h4>
                            </div>
                            <p>These cookies are necessary for the website to function and cannot be switched off. They enable basic functions like page navigation and access to secure areas.</p>
                        </div>
                        
                        <div class="cookie-category">
                            <div class="cookie-category-header">
                                <label class="cookie-toggle">
                                    <input type="checkbox" id="analytics-cookies">
                                    <span class="cookie-toggle-slider"></span>
                                </label>
                                <h4>Analytics Cookies</h4>
                            </div>
                            <p>These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously via Google Analytics.</p>
                            <div class="cookie-details-list">
                                <strong>Cookies used:</strong> _ga, _gid, _gat_gtag_*
                            </div>
                        </div>
                        
                        <div class="cookie-category">
                            <div class="cookie-category-header">
                                <label class="cookie-toggle">
                                    <input type="checkbox" id="marketing-cookies">
                                    <span class="cookie-toggle-slider"></span>
                                </label>
                                <h4>Marketing Cookies</h4>
                            </div>
                            <p>These cookies track your visits to our website and help us show you relevant content and advertisements on other websites.</p>
                            <div class="cookie-details-list">
                                <strong>Purpose:</strong> Campaign tracking, conversion measurement
                            </div>
                        </div>
                        
                        <div class="cookie-category">
                            <div class="cookie-category-header">
                                <label class="cookie-toggle">
                                    <input type="checkbox" id="preference-cookies">
                                    <span class="cookie-toggle-slider"></span>
                                </label>
                                <h4>Preference Cookies</h4>
                            </div>
                            <p>These cookies remember your preferences and settings to provide you with a more personalized experience.</p>
                            <div class="cookie-details-list">
                                <strong>Purpose:</strong> Form data, language preferences, theme settings
                            </div>
                        </div>
                    </div>
                    
                    <div class="cookie-actions-detailed">
                        <button id="cookie-save-preferences" class="cookie-btn cookie-btn-primary">Save Preferences</button>
                        <button id="cookie-back" class="cookie-btn cookie-btn-secondary">Back</button>
                    </div>
                    
                    <div class="cookie-policy-links">
                        <a href="privacy-policy.html" target="_blank">Privacy Policy</a> | 
                        <a href="#" id="cookie-manage-link">Manage Cookies</a>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(banner);
        this.addConsentStyles();
    }

    addConsentStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .cookie-consent-banner {
                position: fixed;
                bottom: 0;
                left: 0;
                right: 0;
                background: linear-gradient(135deg, #1a365d 0%, #2d5a87 100%);
                color: white;
                z-index: 10000;
                box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.3);
                transform: translateY(100%);
                transition: transform 0.4s ease-in-out;
            }
            
            .cookie-consent-banner.show {
                transform: translateY(0);
            }
            
            .cookie-consent-container {
                max-width: 1200px;
                margin: 0 auto;
                padding: 20px;
            }
            
            .cookie-consent-content {
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 20px;
                flex-wrap: wrap;
            }
            
            .cookie-consent-text h3 {
                margin: 0 0 8px 0;
                color: #ffffff;
                font-size: 1.2em;
                font-weight: 600;
            }
            
            .cookie-consent-text p {
                margin: 0;
                color: #e2e8f0;
                font-size: 0.95em;
                line-height: 1.5;
            }
            
            .cookie-consent-actions {
                display: flex;
                gap: 10px;
                flex-wrap: wrap;
            }
            
            .cookie-btn {
                padding: 10px 20px;
                border: none;
                border-radius: 6px;
                cursor: pointer;
                font-weight: 500;
                font-size: 0.9em;
                transition: all 0.3s ease;
                white-space: nowrap;
            }
            
            .cookie-btn-primary {
                background: #10a37f;
                color: white;
            }
            
            .cookie-btn-primary:hover {
                background: #0d8f6f;
                transform: translateY(-1px);
            }
            
            .cookie-btn-secondary {
                background: transparent;
                color: white;
                border: 2px solid #4a5568;
            }
            
            .cookie-btn-secondary:hover {
                background: #4a5568;
                border-color: #718096;
            }
            
            .cookie-btn-tertiary {
                background: transparent;
                color: #cbd5e0;
                border: 1px solid #4a5568;
            }
            
            .cookie-btn-tertiary:hover {
                background: #2d3748;
                color: white;
            }
            
            .cookie-consent-details {
                margin-top: 20px;
                border-top: 1px solid #4a5568;
                padding-top: 20px;
            }
            
            .cookie-categories {
                margin-bottom: 20px;
            }
            
            .cookie-category {
                margin-bottom: 16px;
                padding: 16px;
                background: rgba(255, 255, 255, 0.05);
                border-radius: 8px;
                border: 1px solid rgba(255, 255, 255, 0.1);
            }
            
            .cookie-category-header {
                display: flex;
                align-items: center;
                gap: 12px;
                margin-bottom: 8px;
            }
            
            .cookie-category h4 {
                margin: 0;
                font-size: 1.1em;
                color: #ffffff;
                font-weight: 600;
            }
            
            .required {
                color: #fbbf24;
                font-size: 0.85em;
                font-weight: normal;
            }
            
            .cookie-category p {
                margin: 0 0 8px 0;
                color: #e2e8f0;
                font-size: 0.9em;
                line-height: 1.5;
            }
            
            .cookie-details-list {
                color: #cbd5e0;
                font-size: 0.85em;
                font-style: italic;
            }
            
            .cookie-toggle {
                position: relative;
                display: inline-block;
                width: 50px;
                height: 24px;
                flex-shrink: 0;
            }
            
            .cookie-toggle input {
                opacity: 0;
                width: 0;
                height: 0;
            }
            
            .cookie-toggle-slider {
                position: absolute;
                cursor: pointer;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background-color: #4a5568;
                transition: 0.4s;
                border-radius: 24px;
            }
            
            .cookie-toggle-slider:before {
                position: absolute;
                content: "";
                height: 18px;
                width: 18px;
                left: 3px;
                bottom: 3px;
                background-color: white;
                transition: 0.4s;
                border-radius: 50%;
            }
            
            .cookie-toggle input:checked + .cookie-toggle-slider {
                background-color: #10a37f;
            }
            
            .cookie-toggle input:checked + .cookie-toggle-slider:before {
                transform: translateX(26px);
            }
            
            .cookie-toggle input:disabled + .cookie-toggle-slider {
                opacity: 0.6;
                cursor: not-allowed;
            }
            
            .cookie-actions-detailed {
                display: flex;
                gap: 10px;
                margin-bottom: 16px;
                flex-wrap: wrap;
            }
            
            .cookie-policy-links {
                text-align: center;
                font-size: 0.85em;
            }
            
            .cookie-policy-links a {
                color: #90cdf4;
                text-decoration: none;
            }
            
            .cookie-policy-links a:hover {
                text-decoration: underline;
            }
            
            .cookie-settings-trigger {
                position: fixed;
                bottom: 20px;
                left: 20px;
                background: #10a37f;
                color: white;
                border: none;
                padding: 12px;
                border-radius: 50%;
                cursor: pointer;
                box-shadow: 0 4px 12px rgba(16, 163, 127, 0.3);
                transition: all 0.3s ease;
                z-index: 9999;
            }
            
            .cookie-settings-trigger:hover {
                transform: translateY(-2px);
                box-shadow: 0 6px 16px rgba(16, 163, 127, 0.4);
            }
            
            .cookie-settings-trigger i {
                font-size: 1.2em;
            }
            
            @media (max-width: 768px) {
                .cookie-consent-content {
                    flex-direction: column;
                    text-align: center;
                }
                
                .cookie-consent-actions {
                    justify-content: center;
                }
                
                .cookie-btn {
                    flex: 1;
                    min-width: 120px;
                }
                
                .cookie-actions-detailed {
                    justify-content: center;
                }
                
                .cookie-settings-trigger {
                    bottom: 80px;
                }
            }
        `;
        document.head.appendChild(style);
    }

    setupEventListeners() {
        // Accept All
        document.getElementById('cookie-accept-all').addEventListener('click', () => {
            this.setConsent({
                essential: true,
                analytics: true,
                marketing: true,
                preferences: true
            });
            this.hideConsentBanner();
            this.enableAllCookies();
        });

        // Reject All
        document.getElementById('cookie-reject-all').addEventListener('click', () => {
            this.setConsent({
                essential: true,
                analytics: false,
                marketing: false,
                preferences: false
            });
            this.hideConsentBanner();
            this.disableOptionalCookies();
        });

        // Customize
        document.getElementById('cookie-customize').addEventListener('click', () => {
            document.getElementById('cookie-details').style.display = 'block';
        });

        // Back
        document.getElementById('cookie-back').addEventListener('click', () => {
            document.getElementById('cookie-details').style.display = 'none';
        });

        // Save Preferences
        document.getElementById('cookie-save-preferences').addEventListener('click', () => {
            const consent = {
                essential: true,
                analytics: document.getElementById('analytics-cookies').checked,
                marketing: document.getElementById('marketing-cookies').checked,
                preferences: document.getElementById('preference-cookies').checked
            };
            this.setConsent(consent);
            this.hideConsentBanner();
            this.applyCookieSettings(consent);
        });

        // Manage Cookies Link
        document.getElementById('cookie-manage-link').addEventListener('click', (e) => {
            e.preventDefault();
            this.showConsentBanner();
            document.getElementById('cookie-details').style.display = 'block';
        });
    }

    checkExistingConsent() {
        const consent = this.getConsent();
        if (!consent) {
            setTimeout(() => this.showConsentBanner(), 1000);
        } else {
            this.applyCookieSettings(consent);
            this.addCookieSettingsButton();
        }
    }

    showConsentBanner() {
        const banner = document.getElementById('cookie-consent-banner');
        if (banner) {
            banner.classList.add('show');
        }
    }

    hideConsentBanner() {
        const banner = document.getElementById('cookie-consent-banner');
        if (banner) {
            banner.classList.remove('show');
            setTimeout(() => {
                banner.style.display = 'none';
                this.addCookieSettingsButton();
            }, 400);
        }
    }

    addCookieSettingsButton() {
        if (document.getElementById('cookie-settings-btn')) return;
        
        const button = document.createElement('button');
        button.id = 'cookie-settings-btn';
        button.className = 'cookie-settings-trigger';
        button.innerHTML = '<i class="fas fa-cookie-bite"></i>';
        button.title = 'Cookie Settings';
        button.addEventListener('click', () => {
            const banner = document.getElementById('cookie-consent-banner');
            banner.style.display = 'block';
            this.showConsentBanner();
            // Load current preferences
            const consent = this.getConsent();
            if (consent) {
                document.getElementById('analytics-cookies').checked = consent.analytics;
                document.getElementById('marketing-cookies').checked = consent.marketing;
                document.getElementById('preference-cookies').checked = consent.preferences;
            }
        });
        document.body.appendChild(button);
    }

    setConsent(consent) {
        const consentData = {
            ...consent,
            timestamp: Date.now(),
            expires: Date.now() + (this.consentDuration * 24 * 60 * 60 * 1000)
        };
        localStorage.setItem(this.cookieName, JSON.stringify(consentData));
        
        // Set cookie for server-side detection
        document.cookie = `${this.cookieName}=${JSON.stringify(consent)}; max-age=${this.consentDuration * 24 * 60 * 60}; path=/; secure; samesite=strict`;
    }

    getConsent() {
        try {
            const stored = localStorage.getItem(this.cookieName);
            if (!stored) return null;
            
            const consent = JSON.parse(stored);
            if (consent.expires && consent.expires < Date.now()) {
                localStorage.removeItem(this.cookieName);
                return null;
            }
            return consent;
        } catch (e) {
            return null;
        }
    }

    applyCookieSettings(consent) {
        // Analytics
        if (consent.analytics) {
            this.enableAnalytics();
        } else {
            this.disableAnalytics();
        }

        // Marketing
        if (consent.marketing) {
            this.enableMarketing();
        } else {
            this.disableMarketing();
        }

        // Preferences
        if (consent.preferences) {
            this.enablePreferences();
        } else {
            this.disablePreferences();
        }
    }

    enableAllCookies() {
        this.enableAnalytics();
        this.enableMarketing();
        this.enablePreferences();
    }

    disableOptionalCookies() {
        this.disableAnalytics();
        this.disableMarketing();
        this.disablePreferences();
    }

    enableAnalytics() {
        // Google Analytics is already loaded, just ensure it's tracking
        if (typeof gtag !== 'undefined') {
            gtag('consent', 'update', {
                'analytics_storage': 'granted'
            });
        }
        
        // Re-enable if it was disabled
        if (window.dataLayer) {
            gtag('config', 'G-81P3CZ3QFX');
        }
    }

    disableAnalytics() {
        if (typeof gtag !== 'undefined') {
            gtag('consent', 'update', {
                'analytics_storage': 'denied'
            });
        }
        
        // Clear existing GA cookies
        this.deleteCookiesByName(['_ga', '_gid', '_gat']);
    }

    enableMarketing() {
        if (typeof gtag !== 'undefined') {
            gtag('consent', 'update', {
                'ad_storage': 'granted'
            });
        }
    }

    disableMarketing() {
        if (typeof gtag !== 'undefined') {
            gtag('consent', 'update', {
                'ad_storage': 'denied'
            });
        }
    }

    enablePreferences() {
        // Enable preference tracking
        sessionStorage.setItem('preferences_enabled', 'true');
    }

    disablePreferences() {
        // Clear preference data
        sessionStorage.removeItem('preferences_enabled');
    }

    deleteCookiesByName(names) {
        names.forEach(name => {
            document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
            document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=.${window.location.hostname}`;
        });
    }
}

// Initialize cookie consent when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new CookieConsent());
} else {
    new CookieConsent();
}

// Export for potential external use
window.CookieConsent = CookieConsent;