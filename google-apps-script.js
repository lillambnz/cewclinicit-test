/**
 * Google Apps Script for ClinicIT Visitor + AI Chat Logging
 * Deploy as a Web App and (optionally) forward logs to Telegram.
 * Configure TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID in Script Properties.
 */

// Your Google Sheet ID
const SHEET_ID = '1Yiy355rJBZ2qsJ-EbBQ6noL259seS8cMOCY9IkAPga8';
const SHEET_NAME = 'Visitor Data'; // You can change this sheet name

function doPost(e) {
  try {
    // Parse incoming JSON data
    const data = JSON.parse(e.postData.contents);
    
    // Log to Google Sheets
    logVisitorData(data);
    // Forward to Telegram if configured
    safeTelegramNotify({
      source: 'post',
      event: data.event || 'visitor_data',
      message: data.message || data.userMessage || '(no message)',
      preview: (data.aiResponse || '').toString().slice(0, 160),
      page: data.page || data.entryPage || '',
      meta: {
        country: data.country || '',
        ip: data.ip || '',
        ua: data.userAgent || data.browser || ''
      }
    });
    
    // Return success response
    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      message: 'Data logged successfully',
      timestamp: new Date().toISOString()
    }))
    .setMimeType(ContentService.MimeType.JSON)
    .setHeaders({
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST',
      'Access-Control-Allow-Headers': 'Content-Type'
    });
    
  } catch (error) {
    console.error('Error processing visitor data:', error);
    
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.toString()
    }))
    .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  try {
    const p = e && e.parameter ? e.parameter : {};
    // If event params present, treat as log beacon (CORS-free via <img src>)
    if (p.event || p.msg || p.message) {
      const payload = {
        timestamp: new Date().toISOString(),
        event: p.event || 'ai_chat',
        message: (p.msg || p.message || '').toString().slice(0, 500),
        preview: (p.preview || '').toString().slice(0, 200),
        page: p.page || '',
        ua: p.ua || '',
      };
      // Forward to Telegram if configured
      safeTelegramNotify({
        source: 'get',
        event: payload.event,
        message: payload.message,
        preview: payload.preview,
        page: payload.page,
        meta: { country: p.country || '', ip: p.ip || '', ua: payload.ua }
      });

      return ContentService.createTextOutput(JSON.stringify({ ok: true }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    // Default status response
    return ContentService.createTextOutput(JSON.stringify({
      message: 'ClinicIT GAS Logger is running',
      timestamp: new Date().toISOString()
    }))
    .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ ok: false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function logVisitorData(data) {
  try {
    // Open the Google Sheet
    const sheet = SpreadsheetApp.openById(SHEET_ID);
    let worksheet = sheet.getSheetByName(SHEET_NAME);
    
    // Create the sheet if it doesn't exist
    if (!worksheet) {
      worksheet = sheet.insertSheet(SHEET_NAME);
      
      // Add headers
      const headers = [
        'Timestamp',
        'Visitor ID',
        'Session ID',
        'IP Address',
        'Country',
        'Region', 
        'City',
        'ISP',
        'Timezone',
        'Device Type',
        'Operating System',
        'Browser',
        'Browser Version',
        'Screen Size',
        'Mobile',
        'Time on Site (seconds)',
        'Pages Viewed',
        'Click Count',
        'Scroll Depth %',
        'Form Interactions',
        'Referrer',
        'UTM Source',
        'UTM Medium',
        'UTM Campaign',
        'Entry Page',
        'Connection Type',
        'Connection Speed'
      ];
      
      worksheet.getRange(1, 1, 1, headers.length).setValues([headers]);
      
      // Format header row
      const headerRange = worksheet.getRange(1, 1, 1, headers.length);
      headerRange.setBackground('#4CAF50');
      headerRange.setFontColor('#FFFFFF');
      headerRange.setFontWeight('bold');
      headerRange.setWrap(true);
    }
    
    // Prepare data row
    const rowData = [
      data.timestamp || new Date().toISOString(),
      data.visitorId || 'unknown',
      data.sessionId || 'unknown',
      data.ip || 'unknown',
      data.country || 'unknown',
      data.region || 'unknown',
      data.city || 'unknown',
      data.isp || 'unknown',
      data.timezone || 'unknown',
      data.deviceType || 'unknown',
      data.os || 'unknown',
      data.browser || 'unknown',
      data.browserVersion || 'unknown',
      data.screenSize || 'unknown',
      data.mobile || 'No',
      data.totalTimeOnSite || 0,
      data.pagesViewed || 0,
      data.clickCount || 0,
      data.scrollDepth || 0,
      data.formInteractions || 0,
      data.referrer || 'direct',
      data.utmSource || 'none',
      data.utmMedium || 'none',
      data.utmCampaign || 'none',
      data.entryPage || 'unknown',
      data.connectionType || 'unknown',
      data.connectionSpeed || 'unknown'
    ];
    
    // Add data to sheet
    worksheet.appendRow(rowData);
    
    // Format the new row
    const lastRow = worksheet.getLastRow();
    const dataRange = worksheet.getRange(lastRow, 1, 1, rowData.length);
    
    // Alternate row colors for better readability
    if (lastRow % 2 === 0) {
      dataRange.setBackground('#F5F5F5');
    }
    
    // Auto-resize columns occasionally
    if (lastRow % 10 === 0) {
      worksheet.autoResizeColumns(1, rowData.length);
    }
    
    console.log(`Visitor data logged successfully. Row: ${lastRow}`);
    
  } catch (error) {
    console.error('Error logging to sheet:', error);
    throw error;
  }
}

// Test function - you can run this to test the setup
function testLogVisitorData() {
  const testData = {
    timestamp: new Date().toISOString(),
    visitorId: 'test_visitor_123',
    sessionId: 'test_session_456',
    ip: '203.123.45.67',
    country: 'Australia',
    region: 'Western Australia',
    city: 'Perth',
    isp: 'Telstra',
    timezone: 'Australia/Perth',
    deviceType: 'desktop',
    os: 'Windows',
    browser: 'Chrome',
    browserVersion: '118.0',
    screenSize: '1920x1080',
    mobile: 'No',
    totalTimeOnSite: 245,
    pagesViewed: 3,
    clickCount: 15,
    scrollDepth: 85,
    formInteractions: 1,
    referrer: 'https://google.com',
    utmSource: 'google',
    utmMedium: 'cpc',
    utmCampaign: 'healthcare_it',
    entryPage: 'https://clinicit.solutions/',
    connectionType: '4g',
    connectionSpeed: '10'
  };
  
  logVisitorData(testData);
  console.log('Test data logged successfully!');
}

// Function to get sheet statistics
function getSheetStats() {
  try {
    const sheet = SpreadsheetApp.openById(SHEET_ID);
    const worksheet = sheet.getSheetByName(SHEET_NAME);
    
    if (!worksheet) {
      return { error: 'Sheet not found' };
    }
    
    const lastRow = worksheet.getLastRow();
    const lastColumn = worksheet.getLastColumn();
    
    return {
      totalRows: lastRow - 1, // Minus header row
      columns: lastColumn,
      lastUpdate: new Date().toISOString(),
      sheetUrl: sheet.getUrl()
    };
    
  } catch (error) {
    return { error: error.toString() };
  }
}

// Function to clean up old data (optional)
function cleanupOldData(daysToKeep = 90) {
  try {
    const sheet = SpreadsheetApp.openById(SHEET_ID);
    const worksheet = sheet.getSheetByName(SHEET_NAME);
    
    if (!worksheet) return;
    
    const data = worksheet.getDataRange().getValues();
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);
    
    let rowsDeleted = 0;
    
    // Check from bottom to top to avoid index issues
    for (let i = data.length - 1; i >= 1; i--) {
      const timestamp = new Date(data[i][0]);
      
      if (timestamp < cutoffDate) {
        worksheet.deleteRow(i + 1);
        rowsDeleted++;
      }
    }
    
    console.log(`Cleanup complete. Deleted ${rowsDeleted} old rows.`);
    return { rowsDeleted: rowsDeleted };
    
  } catch (error) {
    console.error('Cleanup error:', error);
    return { error: error.toString() };
  }
}

// --- Telegram helpers ---
function safeTelegramNotify(evt) {
  try {
    const props = PropertiesService.getScriptProperties();
    const bot = props.getProperty('TELEGRAM_BOT_TOKEN');
    const chat = props.getProperty('TELEGRAM_CHAT_ID');
    if (!bot || !chat) return; // Not configured; silently skip

    const lines = [];
    lines.push('🤖 ClinicIT Log');
    lines.push('');
    lines.push('• Event: ' + esc(evt.event || 'log'));
    if (evt.page) lines.push('• Page: ' + esc(evt.page));
    if (evt.message) {
      lines.push('');
      lines.push('<b>User:</b>');
      lines.push('"' + esc(evt.message) + '"');
    }
    if (evt.preview) {
      lines.push('');
      lines.push('<b>AI:</b>');
      lines.push('"' + esc(evt.preview) + '"');
    }
    if (evt.meta) {
      lines.push('');
      if (evt.meta.country) lines.push('• Country: ' + esc(evt.meta.country));
      if (evt.meta.ip) lines.push('• IP: ' + esc(maskIP(evt.meta.ip)));
      if (evt.meta.ua) lines.push('• UA: ' + esc(String(evt.meta.ua).slice(0, 80)));
    }
    const text = lines.join('\n');

    UrlFetchApp.fetch('https://api.telegram.org/bot' + bot + '/sendMessage', {
      method: 'post',
      contentType: 'application/json',
      payload: JSON.stringify({ chat_id: chat, text: text, parse_mode: 'HTML', disable_web_page_preview: true }),
      muteHttpExceptions: true
    });
  } catch (e) {
    // swallow errors to avoid breaking logging
  }
}

function esc(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function maskIP(ip) {
  const parts = String(ip).split('.');
  return parts.length === 4 ? parts[0] + '.' + parts[1] + '.' + parts[2] + '.xxx' : 'masked';
}

/*
DEPLOYMENT INSTRUCTIONS:

1. Go to script.google.com
2. Create a new project
3. Replace the default code with this entire script
4. Save the project (name it "ClinicIT Visitor Logger")
5. Click "Deploy" > "New deployment"
6. Choose type: "Web app"
7. Description: "ClinicIT Visitor Data API"
8. Execute as: Me
9. Who has access: Anyone
10. Click "Deploy"
11. Copy the Web App URL
12. Update the webAppUrl in sheets-logger.js with your URL

The Web App URL will look like:
https://script.google.com/macros/s/AKfycby.../exec

Test the deployment by running the testLogVisitorData() function.
*/
