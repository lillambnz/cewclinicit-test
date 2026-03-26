# ClinicIT.Solutions Tawk.to Ticketing Setup Guide

## 🎯 COMPLETE CONFIGURATION CHECKLIST

### STEP 1: Access Ticketing Settings
- [ ] Login to https://dashboard.tawk.to
- [ ] Go to: Administration → Chat Widget → Ticketing
- [ ] Enable "Convert chats to tickets" toggle
- [ ] Enable "Allow visitors to create tickets via email"

### STEP 2: Create Ticket Categories
**Copy these exactly into your Categories section:**

```
Technical Support
├── Network Issues
├── Software Problems  
├── Hardware Failures
├── System Maintenance

Project Requests
├── System Integration
├── Infrastructure Upgrade
├── EHR Implementation
├── Security Audit

Consultations
├── IT Assessment
├── Quote Request
├── System Planning
├── Training Request

Urgent/Critical
├── System Down
├── Security Breach
├── Data Recovery
├── Emergency Support
```

### STEP 3: Configure Priority Levels
**Settings → Ticketing → Priorities:**

- **CRITICAL** (Red) - 4 hour SLA
- **HIGH** (Orange) - 24 hour SLA  
- **MEDIUM** (Yellow) - 3 day SLA
- **LOW** (Green) - 7 day SLA

### STEP 4: Setup Email Templates
**Administration → Messaging → Email Templates:**

#### New Ticket Created Template:
```
Subject: Your IT Support Request #{{ticket_id}} - ClinicIT.Solutions

Hi {{customer_name}},

Thank you for contacting ClinicIT.Solutions! We've received your IT support request:

📋 Ticket #: {{ticket_id}}
📝 Subject: {{ticket_subject}}
⏰ Priority: {{priority}}
🎯 Category: {{category}}

Our Perth-based IT specialists will respond within {{sla_time}}.

Track your request: {{ticket_url}}

Need urgent assistance?
📞 0434 509 800
📧 hello@clinicit.solutions

Best regards,
ClinicIT.Solutions Team
```

#### Ticket Updated Template:
```
Subject: Update on IT Request #{{ticket_id}} - ClinicIT.Solutions

Hi {{customer_name}},

Your IT support request #{{ticket_id}} has been updated:

{{update_message}}

Current Status: {{status}}
Track progress: {{ticket_url}}

Questions? Reply to this email or call 0434 509 800.

Best regards,
ClinicIT.Solutions Team
```

#### Ticket Resolved Template:
```
Subject: ✅ Resolved: IT Request #{{ticket_id}} - ClinicIT.Solutions

Hi {{customer_name}},

Great news! Your IT support request #{{ticket_id}} has been resolved.

{{resolution_message}}

Please rate your experience: {{satisfaction_survey_url}}

For future IT support needs:
📞 0434 509 800
📧 hello@clinicit.solutions

Thank you for choosing ClinicIT.Solutions!
```

### STEP 5: Automatic Ticket Rules
**Administration → Ticketing → Automation Rules:**

#### Rule 1: Auto-Assign Critical Issues
- **Trigger:** New ticket with "Critical" priority
- **Action:** Assign to you immediately + Send SMS alert

#### Rule 2: Auto-Categorize Common Requests
- **Trigger:** Message contains "quote", "assessment", "consultation"
- **Action:** Set category to "Consultations" + Medium priority

#### Rule 3: Project Tracking
- **Trigger:** Category contains "Project Requests"
- **Action:** Set High priority + Add "Project" tag

### STEP 6: Client Portal Settings
**Administration → Ticketing → Portal Settings:**

- [x] Enable ticket portal
- [x] Allow file uploads (max 10MB)
- [x] Show ticket history
- [x] Enable satisfaction surveys
- [x] Send email notifications for updates
- **Portal URL:** Set to https://support.clinicit.solutions

### STEP 7: Team & Assignment (if you have staff)
**Administration → Team:**

- **Primary Agent:** Your account (all categories)
- **Backup:** Secondary contact for critical issues
- **Auto-assign:** Enable round-robin or category-based

### STEP 8: Working Hours & SLA
**Administration → Settings → Working Hours:**

- **Business Hours:** 8:00 AM - 6:00 PM AWST (Perth time)
- **Time Zone:** Australia/Perth
- **SLA Calculation:** Business hours only
- **Weekend Support:** Emergency only (Critical priority)

### STEP 9: Ticket Fields (Custom)
**Administration → Ticketing → Custom Fields:**

#### For IT Assessments:
- **Practice Management System:** [Dropdown: Best Practice, Medical Director, Zedmed, Other]
- **Number of Staff:** [Number field]
- **Current IT Issues:** [Text area]
- **Budget Range:** [Dropdown: Under $5k, $5k-$15k, $15k-$30k, $30k+]

#### For Projects:
- **Project Type:** [Dropdown: Integration, Upgrade, Implementation, Audit]
- **Timeline:** [Dropdown: Urgent, 1-3 months, 3-6 months, 6+ months]
- **Clinic Size:** [Dropdown: Solo practice, 2-5 GPs, 5-10 GPs, 10+ GPs]

### STEP 10: Testing & Go-Live
- [ ] Create test ticket via chat
- [ ] Verify email notifications work
- [ ] Test client portal access
- [ ] Check mobile app functionality
- [ ] Confirm SLA timers are working

## 🎯 POST-SETUP OPTIMIZATION

### Week 1: Monitor & Adjust
- Track response times
- Review common ticket types
- Adjust categories if needed
- Fine-tune email templates

### Month 1: Analyze Performance  
- Review ticket volume by category
- Check client satisfaction scores
- Optimize automation rules
- Add FAQ section for common issues

### Ongoing: Continuous Improvement
- Monthly ticket analytics review
- Client feedback implementation
- Staff training on ticket handling
- Knowledge base expansion

## 📞 QUICK REFERENCE

**Dashboard Access:** https://dashboard.tawk.to
**Mobile App:** "Tawk.to" (iOS/Android)
**Client Portal:** https://support.clinicit.solutions (after setup)

**Emergency Contact Integration:**
- SMS alerts for Critical tickets
- After-hours notification settings
- Escalation procedures

---

*This setup transforms your IT business from reactive to proactive client management!*