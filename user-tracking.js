/**
 * Advanced User Behavior Tracking & Recording System
 * ClinicIT.Solutions - Customer Profiling & Analytics
 */

class UserTracker {
    constructor() {
        this.sessionId = this.generateSessionId();
        this.userId = this.getOrCreateUserId();
        this.startTime = Date.now();
        this.pageData = [];
        this.interactions = [];
        this.leadScore = 0;
        this.userProfile = this.loadUserProfile();
        
        this.init();
    }

    init() {
        // Only track if analytics consent is given
        if (this.hasAnalyticsConsent()) {
            this.trackPageView();
            this.setupEventListeners();
            this.startSessionRecording();
            this.trackEngagement();
            this.setupHeatMapping();
        }
    }

    hasAnalyticsConsent() {
        try {
            const consent = JSON.parse(localStorage.getItem('clinicit_cookie_consent') || '{}');
            return consent.analytics === true;
        } catch (e) {
            return false;
        }
    }

    generateSessionId() {
        return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    getOrCreateUserId() {
        let userId = this.getCookie('clinicit_user_id');
        if (!userId) {
            userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            this.setCookie('clinicit_user_id', userId, 365);
        }
        return userId;
    }

    loadUserProfile() {
        const stored = localStorage.getItem('clinicit_user_profile');
        return stored ? JSON.parse(stored) : {
            totalVisits: 0,
            totalPageViews: 0,
            totalTimeSpent: 0,
            servicesViewed: [],
            formsStarted: 0,
            formsCompleted: 0,
            downloadsCount: 0,
            leadScore: 0,
            lastVisit: null,
            firstVisit: Date.now(),
            interests: [],
            engagementLevel: 'low',
            conversionEvents: []
        };
    }

    saveUserProfile() {
        localStorage.setItem('clinicit_user_profile', JSON.stringify(this.userProfile));
        
        // Also store in cookie for server-side access
        this.setCookie('clinicit_profile', JSON.stringify({
            score: this.leadScore,
            level: this.userProfile.engagementLevel,
            visits: this.userProfile.totalVisits
        }), 30);
    }

    // COOKIE MANAGEMENT
    setCookie(name, value, days) {
        const expires = new Date();
        expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
        document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires.toUTCString()}; path=/; secure; samesite=strict`;
    }

    getCookie(name) {
        const nameEQ = name + "=";
        const ca = document.cookie.split(';');
        for(let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0) return decodeURIComponent(c.substring(nameEQ.length, c.length));
        }
        return null;
    }

    // PAGE VIEW TRACKING
    trackPageView() {
        const pageData = {
            url: window.location.href,
            title: document.title,
            timestamp: Date.now(),
            referrer: document.referrer,
            userAgent: navigator.userAgent,
            screenResolution: `${screen.width}x${screen.height}`,
            viewportSize: `${window.innerWidth}x${window.innerHeight}`,
            sessionId: this.sessionId,
            userId: this.userId
        };

        this.pageData.push(pageData);
        this.userProfile.totalPageViews++;
        this.userProfile.lastVisit = Date.now();

        // Track service page visits
        this.trackServiceInterest();

        // Send to Google Analytics
        if (typeof gtag !== 'undefined') {
            gtag('event', 'page_view', {
                'custom_parameter': 'user_tracking',
                'session_id': this.sessionId,
                'user_id': this.userId
            });
        }

        this.updateLeadScore('page_view', 10);
    }

    trackServiceInterest() {
        const url = window.location.pathname;
        const servicePages = {
            '/clinical-systems-integration.html': 'Clinical Systems Integration',
            '/infrastructure-modernisation.html': 'Infrastructure Modernisation', 
            '/electronic-health-records.html': 'Electronic Health Records',
            '/automation-ai-tools.html': 'Automation & AI Tools',
            '/team-training-support.html': 'Team Training & Support',
            '/major-it-project-delivery.html': 'Major IT Project Delivery'
        };

        if (servicePages[url]) {
            const service = servicePages[url];
            if (!this.userProfile.servicesViewed.includes(service)) {
                this.userProfile.servicesViewed.push(service);
                this.userProfile.interests.push(service);
                this.updateLeadScore('service_page_view', 25);
                
                // Track in Google Analytics
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'service_interest', {
                        'service_name': service,
                        'total_services_viewed': this.userProfile.servicesViewed.length
                    });
                }
            }
        }
    }

    // EVENT LISTENERS SETUP
    setupEventListeners() {
        // Form interactions
        this.trackFormInteractions();
        
        // Link clicks
        this.trackLinkClicks();
        
        // Scroll tracking
        this.trackScrollBehavior();
        
        // Time on page
        this.trackTimeOnPage();
        
        // Download tracking
        this.trackDownloads();
        
        // Exit intent
        this.trackExitIntent();
        
        // Phone number clicks
        this.trackPhoneClicks();
    }

    trackFormInteractions() {
        const forms = document.querySelectorAll('form');
        forms.forEach(form => {
            // Form start
            form.addEventListener('focusin', () => {
                if (!form.dataset.started) {
                    form.dataset.started = 'true';
                    this.userProfile.formsStarted++;
                    this.updateLeadScore('form_started', 50);
                    
                    this.logInteraction('form_started', {
                        formId: form.id || 'unnamed',
                        url: window.location.href
                    });
                }
            });

            // Form submission
            form.addEventListener('submit', () => {
                this.userProfile.formsCompleted++;
                this.userProfile.conversionEvents.push({
                    type: 'form_submission',
                    timestamp: Date.now(),
                    url: window.location.href
                });
                this.updateLeadScore('form_completed', 200);
                
                this.logInteraction('form_completed', {
                    formId: form.id || 'unnamed',
                    url: window.location.href
                });

                // High-value conversion event
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'conversion', {
                        'send_to': 'G-81P3CZ3QFX/form_submission',
                        'value': 1000,
                        'currency': 'AUD'
                    });
                }
            });

            // Form abandonment
            const inputs = form.querySelectorAll('input, textarea, select');
            inputs.forEach(input => {
                input.addEventListener('blur', () => {
                    setTimeout(() => {
                        if (!form.dataset.submitted && form.dataset.started) {
                            this.logInteraction('form_field_blur', {
                                fieldName: input.name || input.id,
                                fieldValue: input.value ? 'filled' : 'empty'
                            });
                        }
                    }, 100);
                });
            });
        });
    }

    trackLinkClicks() {
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a');
            if (link) {
                this.logInteraction('link_click', {
                    url: link.href,
                    text: link.textContent.trim(),
                    internal: link.hostname === window.location.hostname
                });

                // Track external links
                if (link.hostname !== window.location.hostname) {
                    this.updateLeadScore('external_link_click', 5);
                }
            }
        });
    }

    trackScrollBehavior() {
        let maxScroll = 0;
        let scrollTimeout;

        window.addEventListener('scroll', () => {
            const scrollPercent = Math.round(
                (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
            );
            
            if (scrollPercent > maxScroll) {
                maxScroll = scrollPercent;
            }

            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                this.logInteraction('scroll_depth', {
                    maxScrollPercent: maxScroll,
                    currentScroll: scrollPercent
                });

                // Award points for deep scrolling
                if (maxScroll > 75) {
                    this.updateLeadScore('deep_scroll', 15);
                }
            }, 1000);
        });

        // Track when user leaves page
        window.addEventListener('beforeunload', () => {
            this.logInteraction('page_exit', {
                maxScrollPercent: maxScroll,
                timeOnPage: Date.now() - this.startTime
            });
        });
    }

    trackTimeOnPage() {
        // Track engagement time
        let engagementTime = 0;
        let isActive = true;
        let lastActiveTime = Date.now();

        const updateEngagementTime = () => {
            if (isActive) {
                const now = Date.now();
                engagementTime += now - lastActiveTime;
                lastActiveTime = now;
            }
        };

        // Track when user is active/inactive
        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'visible') {
                isActive = true;
                lastActiveTime = Date.now();
            } else {
                updateEngagementTime();
                isActive = false;
            }
        });

        // Update engagement time periodically
        setInterval(() => {
            updateEngagementTime();
            this.userProfile.totalTimeSpent = engagementTime;
            
            // Award points for time spent
            if (engagementTime > 180000) { // 3 minutes
                this.updateLeadScore('long_engagement', 30);
            }
        }, 30000); // Every 30 seconds
    }

    trackDownloads() {
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a');
            if (link && this.isDownloadLink(link.href)) {
                this.userProfile.downloadsCount++;
                this.updateLeadScore('download', 75);
                
                this.logInteraction('download', {
                    url: link.href,
                    filename: link.href.split('/').pop()
                });

                if (typeof gtag !== 'undefined') {
                    gtag('event', 'file_download', {
                        'file_name': link.href.split('/').pop(),
                        'file_extension': link.href.split('.').pop()
                    });
                }
            }
        });
    }

    trackExitIntent() {
        document.addEventListener('mouseleave', (e) => {
            if (e.clientY <= 0) {
                this.logInteraction('exit_intent', {
                    timeOnPage: Date.now() - this.startTime,
                    scrollPercent: Math.round(
                        (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
                    )
                });
            }
        });
    }

    trackPhoneClicks() {
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a');
            if (link && link.href.startsWith('tel:')) {
                this.updateLeadScore('phone_click', 100);
                
                this.logInteraction('phone_click', {
                    phoneNumber: link.href.replace('tel:', '')
                });

                if (typeof gtag !== 'undefined') {
                    gtag('event', 'phone_call_intent', {
                        'phone_number': link.href.replace('tel:', '')
                    });
                }
            }
        });
    }

    // SESSION RECORDING
    startSessionRecording() {
        this.mouseMovements = [];
        this.clickEvents = [];
        
        // Track mouse movements (throttled)
        let mouseTimeout;
        document.addEventListener('mousemove', (e) => {
            clearTimeout(mouseTimeout);
            mouseTimeout = setTimeout(() => {
                this.mouseMovements.push({
                    x: e.clientX,
                    y: e.clientY,
                    timestamp: Date.now()
                });
                
                // Keep only last 1000 movements to avoid memory issues
                if (this.mouseMovements.length > 1000) {
                    this.mouseMovements.shift();
                }
            }, 100);
        });

        // Track clicks with element info
        document.addEventListener('click', (e) => {
            this.clickEvents.push({
                x: e.clientX,
                y: e.clientY,
                element: this.getElementInfo(e.target),
                timestamp: Date.now()
            });

            // Keep only last 100 clicks
            if (this.clickEvents.length > 100) {
                this.clickEvents.shift();
            }
        });
    }

    // HEAT MAPPING
    setupHeatMapping() {
        this.heatmapData = new Map();
        
        document.addEventListener('click', (e) => {
            const rect = document.documentElement.getBoundingClientRect();
            const x = Math.round((e.clientX / window.innerWidth) * 100);
            const y = Math.round((e.clientY / window.innerHeight) * 100);
            const key = `${x},${y}`;
            
            this.heatmapData.set(key, (this.heatmapData.get(key) || 0) + 1);
        });

        // Save heatmap data periodically
        setInterval(() => {
            if (this.heatmapData.size > 0) {
                const heatmapArray = Array.from(this.heatmapData.entries());
                localStorage.setItem('clinicit_heatmap_' + window.location.pathname, JSON.stringify(heatmapArray));
            }
        }, 60000); // Every minute
    }

    // UTILITY FUNCTIONS
    isDownloadLink(url) {
        const downloadExtensions = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'zip', 'rar'];
        const extension = url.split('.').pop().toLowerCase();
        return downloadExtensions.includes(extension);
    }

    getElementInfo(element) {
        return {
            tagName: element.tagName,
            id: element.id,
            className: element.className,
            textContent: element.textContent?.substring(0, 50) || ''
        };
    }

    logInteraction(type, data) {
        const interaction = {
            type,
            data,
            timestamp: Date.now(),
            url: window.location.href,
            sessionId: this.sessionId,
            userId: this.userId
        };
        
        this.interactions.push(interaction);
        
        // Send to Google Analytics as custom event
        if (typeof gtag !== 'undefined') {
            gtag('event', 'user_interaction', {
                'interaction_type': type,
                'custom_data': JSON.stringify(data)
            });
        }
        
        // Keep only last 500 interactions
        if (this.interactions.length > 500) {
            this.interactions.shift();
        }
    }

    // LEAD SCORING
    updateLeadScore(action, points) {
        this.leadScore += points;
        this.userProfile.leadScore = this.leadScore;
        
        // Update engagement level
        if (this.leadScore > 200) {
            this.userProfile.engagementLevel = 'high';
        } else if (this.leadScore > 100) {
            this.userProfile.engagementLevel = 'medium';
        } else {
            this.userProfile.engagementLevel = 'low';
        }
        
        this.saveUserProfile();
        
        // Send lead score to analytics
        if (typeof gtag !== 'undefined') {
            gtag('event', 'lead_score_update', {
                'score': this.leadScore,
                'action': action,
                'points_added': points,
                'engagement_level': this.userProfile.engagementLevel
            });
        }
    }

    // PUBLIC METHODS FOR EXTERNAL USE
    getUserProfile() {
        return {
            userId: this.userId,
            sessionId: this.sessionId,
            profile: this.userProfile,
            currentScore: this.leadScore,
            interactions: this.interactions.slice(-10), // Last 10 interactions
            pageData: this.pageData
        };
    }

    trackCustomEvent(eventName, eventData) {
        this.logInteraction('custom_event', { eventName, eventData });
        this.updateLeadScore('custom_event', 20);
    }

    // Export data for analysis
    exportData() {
        return {
            userId: this.userId,
            sessionId: this.sessionId,
            userProfile: this.userProfile,
            interactions: this.interactions,
            pageData: this.pageData,
            mouseMovements: this.mouseMovements.slice(-100), // Last 100 movements
            clickEvents: this.clickEvents,
            heatmapData: Array.from(this.heatmapData.entries())
        };
    }
}

// Export UserTracker class immediately
window.UserTracker = UserTracker;

// Initialize tracker when page loads
let userTracker;

function initializeTracker() {
    try {
        userTracker = new UserTracker();
        window.userTracker = userTracker;
        console.log('🎯 UserTracker initialized successfully');
    } catch (error) {
        console.warn('🎯 UserTracker initialization failed:', error);
        // Still export the class even if initialization fails
        window.userTracker = null;
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeTracker);
} else {
    // Use setTimeout to ensure all scripts are loaded
    setTimeout(initializeTracker, 100);
}

// Auto-save session data before page unload
window.addEventListener('beforeunload', () => {
    if (userTracker) {
        userTracker.saveUserProfile();
        
        // Save session summary
        const sessionSummary = {
            sessionId: userTracker.sessionId,
            duration: Date.now() - userTracker.startTime,
            pageViews: userTracker.pageData.length,
            interactions: userTracker.interactions.length,
            finalScore: userTracker.leadScore,
            engagementLevel: userTracker.userProfile.engagementLevel
        };
        
        localStorage.setItem('clinicit_last_session', JSON.stringify(sessionSummary));
    }
});

console.log('🎯 ClinicIT User Tracking System Initialized');