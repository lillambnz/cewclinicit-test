/**
 * Simple Pixel Visitor Tracking System
 * ClinicIT.Solutions - No CORS Issues
 */

class PixelTracker {
    constructor() {
        this.webAppUrl = 'https://script.google.com/macros/s/AKfycbzk7qgBctHI9iJbBaxQq3pJmsLH6Sc9GEYgtS8ZmD_YFjs9g6mv1G0F3eDMnFWY5cOE/exec';
        this.visitorId = this.generateVisitorId();
        this.sessionStart = Date.now();
        this.clickCount = 0;
        this.pageViews = 0;
        this.maxScrollDepth = 0;
        this.isTracking = false;
        
        console.log('📊 Pixel Tracker initialized');
        this.init();
    }
    
    generateVisitorId() {
        // Check for existing visitor ID
        let visitorId = localStorage.getItem('clinicit_visitor_id');
        if (!visitorId) {
            visitorId = 'visitor_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            localStorage.setItem('clinicit_visitor_id', visitorId);
        }
        return visitorId;
    }
    
    async init() {
        // Get visitor info
        const visitorInfo = await this.gatherVisitorInfo();
        
        // Track page view immediately
        this.trackPageView(visitorInfo);
        
        // Set up event listeners
        this.setupEventListeners();
        
        // Send data every 30 seconds
        this.startPeriodicTracking(visitorInfo);
    }
    
    async gatherVisitorInfo() {
        const info = {
            visitor: this.visitorId,
            page: window.location.href,
            referrer: document.referrer || 'direct',
            device: this.getDeviceType(),
            browser: this.getBrowser(),
            screen: `${screen.width}x${screen.height}`,
            timeOnSite: 0,
            clicks: 0
        };
        
        // Try to get IP and location
        try {
            const response = await fetch('https://ipapi.co/json/', { timeout: 3000 });
            const data = await response.json();
            info.ip = data.ip || 'unknown';
            info.country = data.country_name || 'unknown';
            info.city = data.city || 'unknown';
        } catch (error) {
            console.log('📍 Location detection failed, using defaults');
            info.ip = 'unknown';
            info.country = 'unknown'; 
            info.city = 'unknown';
        }
        
        return info;
    }
    
    getDeviceType() {
        const width = window.innerWidth;
        if (width <= 768) return 'mobile';
        if (width <= 1024) return 'tablet';
        return 'desktop';
    }
    
    getBrowser() {
        const ua = navigator.userAgent;
        if (ua.includes('Chrome')) return 'Chrome';
        if (ua.includes('Firefox')) return 'Firefox';
        if (ua.includes('Safari')) return 'Safari';
        if (ua.includes('Edge')) return 'Edge';
        return 'Unknown';
    }
    
    setupEventListeners() {
        // Click tracking
        document.addEventListener('click', () => {
            this.clickCount++;
        });
        
        // Scroll tracking
        window.addEventListener('scroll', () => {
            const scrollPercent = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
            this.maxScrollDepth = Math.max(this.maxScrollDepth, scrollPercent || 0);
        });
        
        // Page visibility (when user leaves)
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.sendFinalData();
            }
        });
        
        // Before page unload
        window.addEventListener('beforeunload', () => {
            this.sendFinalData();
        });
    }
    
    trackPageView(visitorInfo) {
        this.pageViews++;
        this.sendPixelData(visitorInfo);
        console.log('📄 Page view tracked');
    }
    
    startPeriodicTracking(visitorInfo) {
        // Send updated data every 30 seconds
        setInterval(() => {
            const timeOnSite = Math.round((Date.now() - this.sessionStart) / 1000);
            const updatedInfo = {
                ...visitorInfo,
                timeOnSite: timeOnSite,
                clicks: this.clickCount,
                scrollDepth: this.maxScrollDepth,
                pageViews: this.pageViews
            };
            this.sendPixelData(updatedInfo);
        }, 30000);
    }
    
    sendFinalData() {
        if (this.isTracking) return; // Prevent multiple calls
        this.isTracking = true;
        
        const timeOnSite = Math.round((Date.now() - this.sessionStart) / 1000);
        const finalData = {
            visitor: this.visitorId,
            page: window.location.href,
            timeOnSite: timeOnSite,
            clicks: this.clickCount,
            scrollDepth: this.maxScrollDepth,
            finalData: 'true'
        };
        
        this.sendPixelData(finalData);
        console.log('📤 Final visitor data sent');
    }
    
    sendPixelData(data) {
        try {
            // Create tracking pixel
            const img = new Image();
            const params = new URLSearchParams();
            
            // Add all data as URL parameters
            Object.keys(data).forEach(key => {
                if (data[key] !== undefined && data[key] !== null) {
                    params.append(key, String(data[key]));
                }
            });
            
            // Send pixel request (bypasses CORS)
            img.src = `${this.webAppUrl}?${params.toString()}`;
            
            // Optional: Log for debugging (remove in production)
            console.log('📊 Tracking data sent:', Object.keys(data).length, 'parameters');
            
        } catch (error) {
            console.warn('📊 Tracking failed:', error);
        }
    }
    
    // Manual tracking methods
    trackEvent(eventName, eventData = {}) {
        const data = {
            visitor: this.visitorId,
            event: eventName,
            page: window.location.href,
            ...eventData
        };
        this.sendPixelData(data);
    }
    
    trackFormInteraction(formName) {
        this.trackEvent('form_interaction', { form: formName });
    }
    
    trackButtonClick(buttonName) {
        this.trackEvent('button_click', { button: buttonName });
    }
}

// Initialize pixel tracker
let pixelTracker;

function initPixelTracker() {
    try {
        pixelTracker = new PixelTracker();
        window.pixelTracker = pixelTracker;
        console.log('📊 Pixel Tracker System Active');
    } catch (error) {
        console.warn('📊 Pixel Tracker initialization failed:', error);
    }
}

// Export for global access
window.PixelTracker = PixelTracker;

// Initialize when page loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPixelTracker);
} else {
    setTimeout(initPixelTracker, 100);
}

console.log('📊 Pixel Tracker System Loaded');