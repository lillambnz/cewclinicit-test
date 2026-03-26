/**
 * Advanced Visitor Intelligence & Behavior Analytics
 * ClinicIT.Solutions - Comprehensive User Profiling System
 */

class VisitorIntelligence {
    constructor() {
        this.visitorId = this.generateVisitorId();
        this.sessionId = this.generateSessionId();
        this.visitorProfile = this.createVisitorProfile();
        this.clickMap = new Map();
        this.scrollData = [];
        this.interactionTimeline = [];
        this.deviceFingerprint = null;
        
        this.init();
    }

    async init() {
        console.log('🕵️ Visitor Intelligence System Starting...');
        
        // Gather comprehensive visitor data
        await this.collectDeviceIntelligence();
        await this.collectLocationData();
        await this.collectNetworkInfo();
        
        // Start tracking
        this.setupAdvancedTracking();
        this.setupRealTimeMonitoring();
        
        // Save initial profile
        this.saveVisitorProfile();
        
        console.log('🕵️ Visitor Intelligence Active:', this.visitorProfile);
    }

    generateVisitorId() {
        let id = localStorage.getItem('clinicit_visitor_id');
        if (!id) {
            id = 'visitor_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            localStorage.setItem('clinicit_visitor_id', id);
        }
        return id;
    }

    generateSessionId() {
        return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    async createVisitorProfile() {
        const profile = {
            // Identity
            visitorId: this.visitorId,
            sessionId: this.sessionId,
            firstVisit: Date.now(),
            lastVisit: Date.now(),
            visitCount: 1,
            
            // Device Intelligence
            device: {
                type: this.getDeviceType(),
                os: this.getOperatingSystem(),
                browser: this.getBrowserInfo(),
                screen: {
                    width: screen.width,
                    height: screen.height,
                    colorDepth: screen.colorDepth,
                    pixelRatio: window.devicePixelRatio || 1
                },
                viewport: {
                    width: window.innerWidth,
                    height: window.innerHeight
                },
                touch: 'ontouchstart' in window,
                mobile: /Mobi|Android/i.test(navigator.userAgent),
                platform: navigator.platform
            },
            
            // Location & Network
            location: {
                ip: null,
                country: null,
                region: null,
                city: null,
                timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                language: navigator.language,
                languages: navigator.languages
            },
            
            // Connection Info
            connection: {
                type: null,
                speed: null,
                rtt: null
            },
            
            // Behavior Analytics
            behavior: {
                totalTimeOnSite: 0,
                pagesViewed: [],
                clickCount: 0,
                scrollDepth: 0,
                interactions: [],
                formInteractions: [],
                downloadAttempts: [],
                exitIntents: 0
            },
            
            // Tracking Data
            tracking: {
                referrer: document.referrer,
                utmSource: this.getUrlParameter('utm_source'),
                utmMedium: this.getUrlParameter('utm_medium'),
                utmCampaign: this.getUrlParameter('utm_campaign'),
                entryPage: window.location.href,
                userAgent: navigator.userAgent
            }
        };

        return profile;
    }

    async collectDeviceIntelligence() {
        // Enhanced device fingerprinting
        this.deviceFingerprint = {
            canvas: this.getCanvasFingerprint(),
            webgl: this.getWebGLFingerprint(),
            audio: this.getAudioFingerprint(),
            fonts: await this.detectFonts(),
            plugins: this.getPluginInfo(),
            hardware: this.getHardwareInfo()
        };
        
        this.visitorProfile.device.fingerprint = this.deviceFingerprint;
    }

    async collectLocationData() {
        try {
            // Get IP and location data from multiple sources
            const ipData = await this.getIPInformation();
            if (ipData) {
                this.visitorProfile.location = { ...this.visitorProfile.location, ...ipData };
            }
            
            // Try to get precise location if permission granted
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        this.visitorProfile.location.coordinates = {
                            latitude: position.coords.latitude,
                            longitude: position.coords.longitude,
                            accuracy: position.coords.accuracy
                        };
                        this.saveVisitorProfile();
                    },
                    () => {
                        console.log('🌍 Precise location permission denied');
                    }
                );
            }
        } catch (error) {
            console.warn('🌍 Location collection failed:', error);
        }
    }

    async collectNetworkInfo() {
        if ('connection' in navigator) {
            const conn = navigator.connection;
            this.visitorProfile.connection = {
                type: conn.effectiveType,
                speed: conn.downlink,
                rtt: conn.rtt,
                saveData: conn.saveData
            };
        }
    }

    async getIPInformation() {
        try {
            // Try multiple IP services for reliability
            const services = [
                'https://ipapi.co/json/',
                'https://ip-api.com/json/',
                'https://ipinfo.io/json'
            ];
            
            for (const service of services) {
                try {
                    const response = await fetch(service);
                    const data = await response.json();
                    
                    // Normalize data from different services
                    return {
                        ip: data.ip || data.query,
                        country: data.country_name || data.country,
                        region: data.region || data.regionName,
                        city: data.city,
                        isp: data.org || data.isp,
                        coordinates: {
                            latitude: data.latitude || data.lat,
                            longitude: data.longitude || data.lon
                        }
                    };
                } catch (e) {
                    continue; // Try next service
                }
            }
        } catch (error) {
            console.warn('🌍 IP information collection failed:', error);
        }
        return null;
    }

    setupAdvancedTracking() {
        // Enhanced click tracking
        document.addEventListener('click', (e) => this.trackClick(e), true);
        
        // Mouse movement heatmap
        this.setupMouseTracking();
        
        // Scroll behavior analysis  
        this.setupScrollTracking();
        
        // Form interaction monitoring
        this.setupFormTracking();
        
        // Link and download tracking
        this.setupLinkTracking();
        
        // Time on page tracking
        this.setupTimeTracking();
        
        // Exit intent detection
        this.setupExitIntentTracking();
        
        // Visibility change tracking
        this.setupVisibilityTracking();
    }

    trackClick(event) {
        const clickData = {
            timestamp: Date.now(),
            x: event.clientX,
            y: event.clientY,
            pageX: event.pageX,
            pageY: event.pageY,
            element: {
                tag: event.target.tagName,
                id: event.target.id,
                className: event.target.className,
                text: event.target.textContent?.substring(0, 100),
                href: event.target.href,
                type: event.target.type
            },
            viewport: {
                width: window.innerWidth,
                height: window.innerHeight,
                scrollX: window.scrollX,
                scrollY: window.scrollY
            }
        };
        
        this.visitorProfile.behavior.clickCount++;
        this.interactionTimeline.push({ type: 'click', data: clickData });
        
        // Update click heatmap
        const key = `${Math.round(clickData.x/10)*10},${Math.round(clickData.y/10)*10}`;
        this.clickMap.set(key, (this.clickMap.get(key) || 0) + 1);
        
        this.saveVisitorProfile();
    }

    setupMouseTracking() {
        let mouseMovements = [];
        let lastSave = Date.now();
        
        document.addEventListener('mousemove', (e) => {
            mouseMovements.push({
                x: e.clientX,
                y: e.clientY,
                timestamp: Date.now()
            });
            
            // Save mouse data every 30 seconds
            if (Date.now() - lastSave > 30000) {
                localStorage.setItem('clinicit_mouse_data', JSON.stringify(mouseMovements.slice(-1000)));
                lastSave = Date.now();
            }
        });
    }

    setupScrollTracking() {
        let maxScroll = 0;
        
        window.addEventListener('scroll', () => {
            const scrollPercent = Math.round(
                (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
            );
            
            if (scrollPercent > maxScroll) {
                maxScroll = scrollPercent;
                this.visitorProfile.behavior.scrollDepth = maxScroll;
            }
            
            this.scrollData.push({
                timestamp: Date.now(),
                scrollY: window.scrollY,
                scrollPercent: scrollPercent
            });
        });
    }

    setupFormTracking() {
        document.querySelectorAll('form').forEach(form => {
            const formData = {
                formId: form.id || 'unnamed',
                started: false,
                completed: false,
                abandoned: false,
                fields: []
            };
            
            // Track form start
            form.addEventListener('focusin', () => {
                if (!formData.started) {
                    formData.started = true;
                    formData.startTime = Date.now();
                    this.visitorProfile.behavior.formInteractions.push({
                        ...formData,
                        action: 'started'
                    });
                }
            });
            
            // Track field interactions
            form.querySelectorAll('input, textarea, select').forEach(field => {
                field.addEventListener('change', () => {
                    formData.fields.push({
                        name: field.name || field.id,
                        type: field.type,
                        filled: field.value.length > 0,
                        timestamp: Date.now()
                    });
                });
            });
            
            // Track form submission
            form.addEventListener('submit', () => {
                formData.completed = true;
                formData.completionTime = Date.now();
                this.visitorProfile.behavior.formInteractions.push({
                    ...formData,
                    action: 'completed'
                });
                this.saveVisitorProfile();
            });
        });
    }

    setupLinkTracking() {
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a');
            if (link) {
                const linkData = {
                    href: link.href,
                    text: link.textContent,
                    external: link.hostname !== window.location.hostname,
                    download: this.isDownloadLink(link.href),
                    timestamp: Date.now()
                };
                
                if (linkData.download) {
                    this.visitorProfile.behavior.downloadAttempts.push(linkData);
                }
                
                this.interactionTimeline.push({ type: 'link_click', data: linkData });
            }
        });
    }

    setupTimeTracking() {
        let startTime = Date.now();
        let activeTime = 0;
        let isActive = true;
        
        // Track active time (when tab is visible)
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                if (isActive) {
                    activeTime += Date.now() - startTime;
                    isActive = false;
                }
            } else {
                startTime = Date.now();
                isActive = true;
            }
            
            this.visitorProfile.behavior.totalTimeOnSite = activeTime;
        });
        
        // Update time periodically
        setInterval(() => {
            if (isActive) {
                activeTime += 5000; // Add 5 seconds
                this.visitorProfile.behavior.totalTimeOnSite = activeTime;
            }
        }, 5000);
    }

    setupExitIntentTracking() {
        document.addEventListener('mouseleave', (e) => {
            if (e.clientY <= 0) {
                this.visitorProfile.behavior.exitIntents++;
                this.interactionTimeline.push({
                    type: 'exit_intent',
                    data: { timestamp: Date.now() }
                });
            }
        });
    }

    setupVisibilityTracking() {
        document.addEventListener('visibilitychange', () => {
            this.interactionTimeline.push({
                type: document.hidden ? 'tab_hidden' : 'tab_visible',
                data: { timestamp: Date.now() }
            });
        });
    }

    // Device fingerprinting methods
    getDeviceType() {
        const ua = navigator.userAgent;
        if (/tablet|ipad|playbook|silk/i.test(ua)) return 'tablet';
        if (/mobile|iphone|ipod|android|blackberry|opera|mini|windows\sce|palm|smartphone|iemobile/i.test(ua)) return 'mobile';
        return 'desktop';
    }

    getOperatingSystem() {
        const os = navigator.platform;
        if (os.includes('Win')) return 'Windows';
        if (os.includes('Mac')) return 'macOS';
        if (os.includes('Linux')) return 'Linux';
        if (os.includes('iPhone') || os.includes('iPad')) return 'iOS';
        if (/Android/i.test(navigator.userAgent)) return 'Android';
        return 'Unknown';
    }

    getBrowserInfo() {
        const ua = navigator.userAgent;
        let browser = 'Unknown';
        let version = 'Unknown';
        
        if (ua.includes('Chrome')) {
            browser = 'Chrome';
            version = ua.match(/Chrome\/([0-9.]+)/)?.[1];
        } else if (ua.includes('Firefox')) {
            browser = 'Firefox';
            version = ua.match(/Firefox\/([0-9.]+)/)?.[1];
        } else if (ua.includes('Safari')) {
            browser = 'Safari';
            version = ua.match(/Safari\/([0-9.]+)/)?.[1];
        } else if (ua.includes('Edge')) {
            browser = 'Edge';
            version = ua.match(/Edge\/([0-9.]+)/)?.[1];
        }
        
        return { name: browser, version, userAgent: ua };
    }

    getCanvasFingerprint() {
        try {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            ctx.textBaseline = 'top';
            ctx.font = '14px Arial';
            ctx.fillText('ClinicIT Analytics 🎯', 2, 2);
            return canvas.toDataURL();
        } catch (e) {
            return null;
        }
    }

    getWebGLFingerprint() {
        try {
            const canvas = document.createElement('canvas');
            const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
            if (!gl) return null;
            
            return {
                vendor: gl.getParameter(gl.VENDOR),
                renderer: gl.getParameter(gl.RENDERER),
                version: gl.getParameter(gl.VERSION)
            };
        } catch (e) {
            return null;
        }
    }

    getAudioFingerprint() {
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            return audioContext.sampleRate;
        } catch (e) {
            return null;
        }
    }

    async detectFonts() {
        const fonts = [
            'Arial', 'Helvetica', 'Times', 'Courier', 'Verdana', 'Georgia', 'Palatino',
            'Garamond', 'Bookman', 'Trebuchet MS', 'Arial Black', 'Impact'
        ];
        
        const detected = [];
        for (const font of fonts) {
            if (this.isFontAvailable(font)) {
                detected.push(font);
            }
        }
        return detected;
    }

    isFontAvailable(font) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        ctx.font = '12px monospace';
        const baselineWidth = ctx.measureText('test').width;
        ctx.font = `12px ${font}, monospace`;
        return ctx.measureText('test').width !== baselineWidth;
    }

    getPluginInfo() {
        const plugins = [];
        for (let i = 0; i < navigator.plugins.length; i++) {
            plugins.push(navigator.plugins[i].name);
        }
        return plugins;
    }

    getHardwareInfo() {
        return {
            cores: navigator.hardwareConcurrency || 'unknown',
            memory: navigator.deviceMemory || 'unknown',
            platform: navigator.platform
        };
    }

    getUrlParameter(name) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(name);
    }

    isDownloadLink(url) {
        const downloadExtensions = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'zip', 'rar', 'exe'];
        const extension = url.split('.').pop()?.toLowerCase();
        return downloadExtensions.includes(extension);
    }

    saveVisitorProfile() {
        // Save to localStorage
        localStorage.setItem('clinicit_visitor_profile', JSON.stringify(this.visitorProfile));
        
        // Save interaction timeline (keep last 1000 interactions)
        const timeline = this.interactionTimeline.slice(-1000);
        localStorage.setItem('clinicit_interaction_timeline', JSON.stringify(timeline));
        
        // Save click heatmap data
        localStorage.setItem('clinicit_click_map', JSON.stringify(Array.from(this.clickMap.entries())));
        
        // Send to analytics if available
        if (typeof gtag !== 'undefined') {
            gtag('event', 'visitor_intelligence_update', {
                'visitor_id': this.visitorId,
                'session_id': this.sessionId,
                'device_type': this.visitorProfile.device.type,
                'country': this.visitorProfile.location.country,
                'click_count': this.visitorProfile.behavior.clickCount
            });
        }
    }

    // Public methods for external access
    getVisitorProfile() {
        return {
            profile: this.visitorProfile,
            interactions: this.interactionTimeline.slice(-50),
            clickMap: Array.from(this.clickMap.entries()),
            scrollData: this.scrollData.slice(-100)
        };
    }

    exportDetailedData() {
        return {
            visitorProfile: this.visitorProfile,
            deviceFingerprint: this.deviceFingerprint,
            interactionTimeline: this.interactionTimeline,
            clickMap: Array.from(this.clickMap.entries()),
            scrollData: this.scrollData,
            mouseData: JSON.parse(localStorage.getItem('clinicit_mouse_data') || '[]'),
            exportTimestamp: new Date().toISOString()
        };
    }

    setupRealTimeMonitoring() {
        // Send periodic updates for real-time monitoring
        setInterval(() => {
            this.saveVisitorProfile();
            
            // Trigger custom event for real-time dashboard
            window.dispatchEvent(new CustomEvent('visitorUpdate', {
                detail: this.getVisitorProfile()
            }));
        }, 30000); // Every 30 seconds
    }
}

// Initialize Visitor Intelligence
let visitorIntelligence;

function initVisitorIntelligence() {
    try {
        visitorIntelligence = new VisitorIntelligence();
        window.visitorIntelligence = visitorIntelligence;
        console.log('🕵️ Visitor Intelligence System Active');
    } catch (error) {
        console.warn('🕵️ Visitor Intelligence initialization failed:', error);
    }
}

// Export for global access
window.VisitorIntelligence = VisitorIntelligence;

// Initialize when page loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initVisitorIntelligence);
} else {
    setTimeout(initVisitorIntelligence, 100);
}

console.log('🕵️ Visitor Intelligence System Loaded');