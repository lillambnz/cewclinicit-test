/**
 * Google Sheets Data Logger for Visitor Intelligence
 * ClinicIT.Solutions - Permanent Data Storage
 */

class GoogleSheetsLogger {
    constructor() {
        this.sheetId = '1ySnmRBzxUwNgEyv3wJwpPnBj3V0bcswQjHzerVrtKPA';
        this.webAppUrl = 'https://script.google.com/macros/s/AKfycbysYO8FW8p_D3zwBfX4GpKyzGhyidYBPyVS7XjZlx35icpTcKUWxnr64mcchr7DTflC/exec';
        this.logQueue = [];
        this.isLogging = false;
        this.maxRetries = 3;
        
        this.init();
    }

    init() {
        console.log('📊 Google Sheets Logger initialized');
        
        // Set up Web App URL (you'll need to deploy the Google Apps Script)
        // For now, we'll use a form submission approach
        this.setupFormSubmission();
        
        // Process any queued data
        this.processLogQueue();
        
        // Set up periodic batch logging
        this.setupBatchLogging();
    }

    setupFormSubmission() {
        // Create a hidden form for Google Sheets submission
        this.createHiddenForm();
    }

    createHiddenForm() {
        // Create hidden form for Google Sheets submission
        if (!document.getElementById('sheets-logger-form')) {
            const form = document.createElement('form');
            form.id = 'sheets-logger-form';
            form.method = 'POST';
            form.style.display = 'none';
            form.target = 'sheets-logger-iframe';
            
            // Create hidden iframe for form submission
            const iframe = document.createElement('iframe');
            iframe.name = 'sheets-logger-iframe';
            iframe.style.display = 'none';
            
            document.body.appendChild(form);
            document.body.appendChild(iframe);
        }
    }

    async logVisitorData(visitorData) {
        try {
            // Prepare data for Google Sheets
            const sheetData = this.formatForSheets(visitorData);
            
            // Add to queue for batch processing
            this.logQueue.push(sheetData);
            
            // If queue is getting large, process immediately
            if (this.logQueue.length >= 5) {
                await this.processLogQueue();
            }
            
            console.log('📊 Visitor data queued for Google Sheets');
            
        } catch (error) {
            console.warn('📊 Failed to log to Google Sheets:', error);
            
            // Store failed attempts in localStorage for retry
            this.storeFailedLog(visitorData);
        }
    }

    formatForSheets(data) {
        const timestamp = new Date().toISOString();
        
        // Format data for spreadsheet columns
        return {
            timestamp: timestamp,
            visitorId: data.visitorId || 'unknown',
            sessionId: data.sessionId || 'unknown',
            
            // Location Data
            ip: data.location?.ip || 'unknown',
            country: data.location?.country || 'unknown', 
            region: data.location?.region || 'unknown',
            city: data.location?.city || 'unknown',
            isp: data.location?.isp || 'unknown',
            timezone: data.location?.timezone || 'unknown',
            
            // Device Data
            deviceType: data.device?.type || 'unknown',
            os: data.device?.os || 'unknown',
            browser: data.device?.browser?.name || 'unknown',
            browserVersion: data.device?.browser?.version || 'unknown',
            screenSize: data.device?.screen ? `${data.device.screen.width}x${data.device.screen.height}` : 'unknown',
            mobile: data.device?.mobile ? 'Yes' : 'No',
            
            // Behavior Data  
            totalTimeOnSite: Math.round((data.behavior?.totalTimeOnSite || 0) / 1000), // seconds
            pagesViewed: data.behavior?.pagesViewed?.length || 0,
            clickCount: data.behavior?.clickCount || 0,
            scrollDepth: data.behavior?.scrollDepth || 0,
            formInteractions: data.behavior?.formInteractions?.length || 0,
            
            // Tracking Data
            referrer: data.tracking?.referrer || 'direct',
            utmSource: data.tracking?.utmSource || 'none',
            utmMedium: data.tracking?.utmMedium || 'none', 
            utmCampaign: data.tracking?.utmCampaign || 'none',
            entryPage: data.tracking?.entryPage || window.location.href,
            
            // Connection Data
            connectionType: data.connection?.type || 'unknown',
            connectionSpeed: data.connection?.speed || 'unknown'
        };
    }

    async processLogQueue() {
        if (this.isLogging || this.logQueue.length === 0) {
            return;
        }
        
        this.isLogging = true;
        
        try {
            // Process in batches of 10
            const batch = this.logQueue.splice(0, 10);
            
            for (const data of batch) {
                await this.submitToSheets(data);
                // Small delay between submissions
                await this.delay(100);
            }
            
            console.log(`📊 Successfully logged ${batch.length} visitor records to Google Sheets`);
            
        } catch (error) {
            console.error('📊 Batch logging failed:', error);
            // Re-queue failed items
            this.logQueue.unshift(...batch);
            
        } finally {
            this.isLogging = false;
        }
    }

    async submitToSheets(data) {
        // Method 1: Try Google Forms submission (most reliable)
        try {
            await this.submitViaGoogleForm(data);
            return;
        } catch (error) {
            console.warn('📊 Google Form submission failed, trying alternative method');
        }

        // Method 2: Try direct API call (if Web App is set up)
        try {
            if (this.webAppUrl) {
                await this.submitViaWebApp(data);
                return;
            }
        } catch (error) {
            console.warn('📊 Web App submission failed');
        }

        // Method 3: Store locally and export manually
        this.storeForManualExport(data);
    }

    async submitViaGoogleForm(data) {
        // This uses a Google Form connected to your sheet
        // You'll need to create a Google Form with matching fields
        
        const formData = new FormData();
        
        // Map data to form fields (you'll need to update these IDs)
        formData.append('entry.123456789', data.timestamp);
        formData.append('entry.234567890', data.visitorId);
        formData.append('entry.345678901', data.ip);
        formData.append('entry.456789012', data.country);
        formData.append('entry.567890123', data.deviceType);
        formData.append('entry.678901234', data.browser);
        formData.append('entry.789012345', data.totalTimeOnSite);
        formData.append('entry.890123456', data.clickCount);
        
        // Note: You'll need to create a Google Form and update these entry IDs
        // For now, we'll use the alternative method
        throw new Error('Google Form not configured yet');
    }

    async submitViaWebApp(data) {
        const response = await fetch(this.webAppUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
    }

    storeForManualExport(data) {
        // Store failed submissions for manual export
        const stored = JSON.parse(localStorage.getItem('clinicit_sheets_pending') || '[]');
        stored.push(data);
        
        // Keep only last 1000 entries
        if (stored.length > 1000) {
            stored.splice(0, stored.length - 1000);
        }
        
        localStorage.setItem('clinicit_sheets_pending', JSON.stringify(stored));
        console.log('📊 Data stored locally for manual export');
    }

    storeFailedLog(data) {
        const failed = JSON.parse(localStorage.getItem('clinicit_sheets_failed') || '[]');
        failed.push({ data, timestamp: Date.now(), retries: 0 });
        localStorage.setItem('clinicit_sheets_failed', JSON.stringify(failed));
    }

    setupBatchLogging() {
        // Process queue every 30 seconds
        setInterval(() => {
            this.processLogQueue();
        }, 30000);

        // Process failed logs every 5 minutes
        setInterval(() => {
            this.retryFailedLogs();
        }, 300000);

        // Auto-export if too much local data
        setInterval(() => {
            this.checkForAutoExport();
        }, 600000); // Every 10 minutes
    }

    async retryFailedLogs() {
        const failed = JSON.parse(localStorage.getItem('clinicit_sheets_failed') || '[]');
        const toRetry = failed.filter(item => item.retries < this.maxRetries);
        
        if (toRetry.length === 0) return;
        
        console.log(`📊 Retrying ${toRetry.length} failed Google Sheets submissions`);
        
        for (const item of toRetry) {
            try {
                await this.logVisitorData(item.data);
                // Remove from failed list
                const index = failed.indexOf(item);
                failed.splice(index, 1);
                
            } catch (error) {
                item.retries++;
                if (item.retries >= this.maxRetries) {
                    console.warn('📊 Max retries reached for visitor data, storing locally');
                    this.storeForManualExport(this.formatForSheets(item.data));
                    // Remove from retry list
                    const index = failed.indexOf(item);
                    failed.splice(index, 1);
                }
            }
        }
        
        localStorage.setItem('clinicit_sheets_failed', JSON.stringify(failed));
    }

    checkForAutoExport() {
        const pending = JSON.parse(localStorage.getItem('clinicit_sheets_pending') || '[]');
        
        if (pending.length > 100) {
            console.warn('📊 Large amount of unsynced data detected. Consider manual export.');
            
            // Trigger export notification
            this.notifyDataExportNeeded(pending.length);
        }
    }

    notifyDataExportNeeded(count) {
        // Create a notification for manual export
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #f59e0b;
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            z-index: 10000;
            max-width: 300px;
            font-family: Arial, sans-serif;
            font-size: 14px;
            cursor: pointer;
        `;
        notification.innerHTML = `
            <strong>📊 Data Export Needed</strong><br>
            ${count} visitor records pending Google Sheets sync.<br>
            <small>Click to export manually</small>
        `;
        
        notification.onclick = () => {
            this.exportPendingData();
            document.body.removeChild(notification);
        };
        
        document.body.appendChild(notification);
        
        // Auto-remove after 10 seconds
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 10000);
    }

    exportPendingData() {
        const pending = JSON.parse(localStorage.getItem('clinicit_sheets_pending') || '[]');
        
        if (pending.length === 0) {
            alert('No pending data to export');
            return;
        }
        
        // Convert to CSV
        const csv = this.convertToCSV(pending);
        
        // Download CSV file
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `clinicit-visitor-data-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        URL.revokeObjectURL(url);
        
        // Clear pending data
        localStorage.removeItem('clinicit_sheets_pending');
        
        alert(`Exported ${pending.length} visitor records. Import this CSV to your Google Sheet.`);
    }

    convertToCSV(data) {
        if (data.length === 0) return '';
        
        // Get headers
        const headers = Object.keys(data[0]);
        
        // Create CSV content
        const csvContent = [
            headers.join(','),
            ...data.map(row => 
                headers.map(header => {
                    const value = row[header] || '';
                    // Escape commas and quotes
                    return `"${String(value).replace(/"/g, '""')}"`;
                }).join(',')
            )
        ].join('\n');
        
        return csvContent;
    }

    // Public methods
    async logCurrentVisitor() {
        try {
            // Get current visitor data from visitor intelligence
            if (window.visitorIntelligence) {
                const visitorData = window.visitorIntelligence.getVisitorProfile();
                await this.logVisitorData(visitorData.profile);
            } else {
                console.warn('📊 Visitor Intelligence not available');
            }
        } catch (error) {
            console.error('📊 Failed to log current visitor:', error);
        }
    }

    async logAllStoredVisitors() {
        try {
            // Log all visitors from localStorage
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key.startsWith('clinicit_visitor_profile')) {
                    const profile = JSON.parse(localStorage.getItem(key));
                    await this.logVisitorData(profile);
                }
            }
            
            console.log('📊 All stored visitors queued for Google Sheets logging');
        } catch (error) {
            console.error('📊 Failed to log stored visitors:', error);
        }
    }

    getStatus() {
        return {
            queueLength: this.logQueue.length,
            isLogging: this.isLogging,
            pendingCount: JSON.parse(localStorage.getItem('clinicit_sheets_pending') || '[]').length,
            failedCount: JSON.parse(localStorage.getItem('clinicit_sheets_failed') || '[]').length
        };
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Initialize Google Sheets Logger
let sheetsLogger;

function initSheetsLogger() {
    try {
        sheetsLogger = new GoogleSheetsLogger();
        window.sheetsLogger = sheetsLogger;
        
        // Auto-log current visitor if available
        setTimeout(() => {
            if (window.visitorIntelligence) {
                sheetsLogger.logCurrentVisitor();
            }
        }, 2000);
        
        console.log('📊 Google Sheets Logger initialized');
    } catch (error) {
        console.warn('📊 Google Sheets Logger initialization failed:', error);
    }
}

// Export for global access
window.GoogleSheetsLogger = GoogleSheetsLogger;

// Initialize when page loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSheetsLogger);
} else {
    setTimeout(initSheetsLogger, 100);
}

console.log('📊 Google Sheets Logger loaded');