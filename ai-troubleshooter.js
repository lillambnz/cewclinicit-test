/**
 * AI Troubleshooter - Intelligent Problem Diagnosis and Resolution System
 * Provides step-by-step troubleshooting for clinical IT issues
 */

class AITroubleshooter {
    constructor() {
        this.isEnabled = AI_CONFIG.features['ai-troubleshooting'];
        this.troubleshootingData = {};
        this.currentSession = null;
        
        if (this.isEnabled) {
            this.init();
        }
    }
    
    init() {
        this.loadTroubleshootingDatabase();
        this.createTroubleshooterInterface();
    }
    
    loadTroubleshootingDatabase() {
        // Comprehensive troubleshooting decision trees and solutions
        this.troubleshootingData = {
            categories: {
                'performance': {
                    name: 'Performance Issues',
                    icon: '🐌',
                    description: 'System running slowly, freezing, or unresponsive',
                    diagnosticTree: {
                        initialQuestions: [
                            {
                                id: 'perf_type',
                                question: 'What type of performance issue are you experiencing?',
                                type: 'single-choice',
                                options: [
                                    { value: 'slow_startup', label: 'System takes long time to start' },
                                    { value: 'slow_response', label: 'System responds slowly to clicks/commands' },
                                    { value: 'freezing', label: 'System freezes or becomes unresponsive' },
                                    { value: 'slow_reports', label: 'Reports take too long to generate' },
                                    { value: 'slow_search', label: 'Patient search is very slow' }
                                ]
                            },
                            {
                                id: 'when_started',
                                question: 'When did this problem start?',
                                type: 'single-choice',
                                options: [
                                    { value: 'today', label: 'Today' },
                                    { value: 'this_week', label: 'This week' },
                                    { value: 'gradual', label: 'Got worse gradually' },
                                    { value: 'after_update', label: 'After a software update' },
                                    { value: 'always', label: 'Has always been slow' }
                                ]
                            }
                        ],
                        diagnosticPaths: {
                            slow_startup: {
                                questions: [
                                    {
                                        id: 'startup_time',
                                        question: 'How long does it take to start?',
                                        type: 'single-choice',
                                        options: [
                                            { value: 'under_5min', label: 'Under 5 minutes' },
                                            { value: '5_to_10min', label: '5-10 minutes' },
                                            { value: 'over_10min', label: 'Over 10 minutes' }
                                        ]
                                    },
                                    {
                                        id: 'other_programs',
                                        question: 'Do other programs on the computer start slowly too?',
                                        type: 'yes-no'
                                    }
                                ],
                                solutions: {
                                    'under_5min_yes': {
                                        diagnosis: 'Computer-wide performance issue',
                                        confidence: 85,
                                        steps: [
                                            'Check if Windows is running updates in the background',
                                            'Restart your computer to clear memory',
                                            'Run a virus scan to check for malware',
                                            'Check available disk space (should be >20% free)',
                                            'Consider adding more RAM if less than 8GB'
                                        ],
                                        severity: 'medium',
                                        timeEstimate: '15-30 minutes'
                                    },
                                    'under_5min_no': {
                                        diagnosis: 'PMS-specific startup issue',
                                        confidence: 90,
                                        steps: [
                                            'Close PMS completely and restart it',
                                            'Check if PMS is set to start with Windows (may conflict)',
                                            'Temporarily disable antivirus to test if it\'s blocking PMS',
                                            'Clear PMS temporary files and cache',
                                            'Contact your PMS vendor if issue persists'
                                        ],
                                        severity: 'low',
                                        timeEstimate: '10-20 minutes'
                                    },
                                    'over_10min_yes': {
                                        diagnosis: 'Serious computer performance problem',
                                        confidence: 95,
                                        steps: [
                                            '⚠️ URGENT: This indicates a serious system issue',
                                            'Check Task Manager for high CPU/memory usage',
                                            'Run full system virus scan immediately',
                                            'Check hard drive health using built-in tools',
                                            'Consider professional IT support if steps don\'t help',
                                            'May need hardware upgrade or replacement'
                                        ],
                                        severity: 'high',
                                        timeEstimate: '1-2 hours',
                                        urgent: true
                                    }
                                }
                            },
                            slow_response: {
                                questions: [
                                    {
                                        id: 'response_delay',
                                        question: 'How long is the delay when you click something?',
                                        type: 'single-choice',
                                        options: [
                                            { value: '1_3_seconds', label: '1-3 seconds' },
                                            { value: '3_10_seconds', label: '3-10 seconds' },
                                            { value: 'over_10_seconds', label: 'Over 10 seconds' }
                                        ]
                                    },
                                    {
                                        id: 'specific_functions',
                                        question: 'Which functions are slowest?',
                                        type: 'multiple-choice',
                                        options: [
                                            { value: 'opening_patients', label: 'Opening patient records' },
                                            { value: 'saving_notes', label: 'Saving clinical notes' },
                                            { value: 'appointments', label: 'Appointment booking' },
                                            { value: 'billing', label: 'Billing/claiming' },
                                            { value: 'reports', label: 'Running reports' }
                                        ]
                                    }
                                ]
                            }
                        }
                    }
                },
                
                'connectivity': {
                    name: 'Connection Issues',
                    icon: '🌐',
                    description: 'Internet, network, or integration connection problems',
                    diagnosticTree: {
                        initialQuestions: [
                            {
                                id: 'connection_type',
                                question: 'What type of connection issue are you having?',
                                type: 'single-choice',
                                options: [
                                    { value: 'internet_down', label: 'No internet connection' },
                                    { value: 'medicare_down', label: 'Can\'t connect to Medicare' },
                                    { value: 'pathology_down', label: 'Pathology results not coming through' },
                                    { value: 'telehealth_issues', label: 'Telehealth connection problems' },
                                    { value: 'slow_internet', label: 'Internet is very slow' }
                                ]
                            }
                        ],
                        diagnosticPaths: {
                            medicare_down: {
                                questions: [
                                    {
                                        id: 'error_message',
                                        question: 'What error message do you see?',
                                        type: 'single-choice',
                                        options: [
                                            { value: 'timeout', label: 'Connection timeout or network error' },
                                            { value: 'certificate', label: 'Certificate or authentication error' },
                                            { value: 'service_unavailable', label: 'Service unavailable' },
                                            { value: 'no_error', label: 'No specific error, just not working' }
                                        ]
                                    },
                                    {
                                        id: 'other_claiming',
                                        question: 'Are other practices in your area having claiming issues?',
                                        type: 'unknown-allowed',
                                        options: [
                                            { value: 'yes', label: 'Yes, others are affected' },
                                            { value: 'no', label: 'No, seems to be just us' },
                                            { value: 'unknown', label: 'Not sure' }
                                        ]
                                    }
                                ],
                                solutions: {
                                    'timeout_unknown': {
                                        diagnosis: 'Network connectivity issue with Medicare',
                                        confidence: 80,
                                        steps: [
                                            'Check your internet connection by browsing to other websites',
                                            'Try accessing Medicare portal directly through web browser',
                                            'Restart your modem/router and wait 5 minutes',
                                            'Check if your firewall is blocking the PMS',
                                            'Contact Medicare IT on 132 011 if problem persists'
                                        ],
                                        severity: 'medium',
                                        timeEstimate: '15-30 minutes',
                                        contacts: ['Medicare IT: 132 011']
                                    },
                                    'certificate_no': {
                                        diagnosis: 'PKI certificate authentication problem',
                                        confidence: 90,
                                        steps: [
                                            '⚠️ This is a certificate issue - requires IT support',
                                            'Check if your PKI certificate has expired',
                                            'Verify certificate is installed correctly',
                                            'Contact your PMS vendor for certificate support',
                                            'May need to renew or reinstall certificates'
                                        ],
                                        severity: 'high',
                                        timeEstimate: '30-60 minutes',
                                        requiresSupport: true
                                    },
                                    'service_unavailable_yes': {
                                        diagnosis: 'Medicare system outage',
                                        confidence: 95,
                                        steps: [
                                            '✅ This appears to be a Medicare system outage',
                                            'Check Medicare service status website',
                                            'Switch to manual claiming temporarily',
                                            'Keep records of all claims to submit later',
                                            'Monitor Medicare announcements for updates'
                                        ],
                                        severity: 'low',
                                        timeEstimate: 'Wait for service restoration',
                                        external: true
                                    }
                                }
                            }
                        }
                    }
                },
                
                'data': {
                    name: 'Data Issues',
                    icon: '📊',
                    description: 'Missing data, corrupted files, or backup problems',
                    diagnosticTree: {
                        initialQuestions: [
                            {
                                id: 'data_problem',
                                question: 'What type of data issue are you experiencing?',
                                type: 'single-choice',
                                options: [
                                    { value: 'missing_patients', label: 'Patient records are missing' },
                                    { value: 'missing_appointments', label: 'Appointments have disappeared' },
                                    { value: 'corrupt_data', label: 'Data appears corrupted or wrong' },
                                    { value: 'backup_failed', label: 'Backup system isn\'t working' },
                                    { value: 'sync_issues', label: 'Data not syncing between locations' }
                                ]
                            }
                        ],
                        diagnosticPaths: {
                            missing_patients: {
                                questions: [
                                    {
                                        id: 'how_many_missing',
                                        question: 'How many patient records are missing?',
                                        type: 'single-choice',
                                        options: [
                                            { value: 'one_or_few', label: 'One or a few specific patients' },
                                            { value: 'many', label: 'Many patients (10+)' },
                                            { value: 'all', label: 'All or most patients' }
                                        ]
                                    },
                                    {
                                        id: 'when_noticed',
                                        question: 'When did you first notice they were missing?',
                                        type: 'single-choice',
                                        options: [
                                            { value: 'today', label: 'Today' },
                                            { value: 'yesterday', label: 'Yesterday' },
                                            { value: 'this_week', label: 'Earlier this week' },
                                            { value: 'longer', label: 'More than a week ago' }
                                        ]
                                    }
                                ],
                                solutions: {
                                    'all_today': {
                                        diagnosis: 'Critical data loss - immediate action required',
                                        confidence: 95,
                                        steps: [
                                            '🚨 CRITICAL: Stop using the system immediately',
                                            'Do not enter any new data',
                                            'Contact your IT support provider urgently',
                                            'Locate your most recent backup',
                                            'Document exactly what you were doing when noticed',
                                            'Switch to paper records temporarily'
                                        ],
                                        severity: 'critical',
                                        timeEstimate: 'Immediate action required',
                                        urgent: true,
                                        stopWork: true
                                    },
                                    'one_or_few_today': {
                                        diagnosis: 'Individual record issue - likely search problem',
                                        confidence: 75,
                                        steps: [
                                            'Try searching with different criteria (DOB, phone, Medicare)',
                                            'Check if patient was merged with another record',
                                            'Look in archived or inactive patient lists',
                                            'Check spelling of patient name carefully',
                                            'Contact PMS support if still can\'t locate'
                                        ],
                                        severity: 'low',
                                        timeEstimate: '5-15 minutes'
                                    }
                                }
                            }
                        }
                    }
                },
                
                'software': {
                    name: 'Software Problems',
                    icon: '💻',
                    description: 'Application crashes, error messages, or functionality issues',
                    diagnosticTree: {
                        initialQuestions: [
                            {
                                id: 'software_issue',
                                question: 'What software problem are you experiencing?',
                                type: 'single-choice',
                                options: [
                                    { value: 'wont_start', label: 'Software won\'t start at all' },
                                    { value: 'crashes', label: 'Software keeps crashing' },
                                    { value: 'error_messages', label: 'Getting error messages' },
                                    { value: 'feature_broken', label: 'Specific feature not working' },
                                    { value: 'update_problems', label: 'Problems after update' }
                                ]
                            }
                        ],
                        diagnosticPaths: {
                            crashes: {
                                questions: [
                                    {
                                        id: 'crash_frequency',
                                        question: 'How often does it crash?',
                                        type: 'single-choice',
                                        options: [
                                            { value: 'every_few_minutes', label: 'Every few minutes' },
                                            { value: 'few_times_day', label: 'A few times per day' },
                                            { value: 'specific_actions', label: 'Only when doing specific things' },
                                            { value: 'randomly', label: 'Randomly/unpredictably' }
                                        ]
                                    },
                                    {
                                        id: 'crash_error',
                                        question: 'Do you get an error message when it crashes?',
                                        type: 'yes-no'
                                    }
                                ]
                            }
                        }
                    }
                }
            },
            
            emergencyProcedures: {
                'critical_data_loss': {
                    title: 'Critical Data Loss Emergency Procedure',
                    steps: [
                        '🚨 STOP: Do not use the system',
                        '📞 Call IT support immediately',
                        '📄 Switch to paper records',
                        '💾 Locate latest backup',
                        '📝 Document the incident',
                        '⏰ Note exact time of discovery'
                    ],
                    contacts: ['IT Support', 'Practice Manager', 'PMS Vendor']
                },
                'security_breach': {
                    title: 'Security Breach Response',
                    steps: [
                        '🔒 Disconnect from internet immediately',
                        '📞 Contact IT security team',
                        '📝 Document what was accessed',
                        '🚫 Do not restart or shutdown computers',
                        '📋 Notify practice manager',
                        '⚖️ Consider legal/compliance requirements'
                    ]
                }
            }
        };
    }
    
    createTroubleshooterInterface() {
        const troubleshooterHTML = `
            <div id="troubleshooter-modal" class="ai-modal">
                <div class="modal-content troubleshooter-modal">
                    <div class="modal-header">
                        <h2>🔧 AI Troubleshooter</h2>
                        <p>Step-by-step problem diagnosis and resolution</p>
                        <button id="close-troubleshooter" class="modal-close">×</button>
                    </div>
                    
                    <div class="troubleshooter-content">
                        <!-- Problem Selection -->
                        <div id="problem-selection" class="troubleshooter-section">
                            <h3>What type of problem are you experiencing?</h3>
                            <div class="problem-categories">
                                ${Object.entries(this.troubleshootingData.categories).map(([key, category]) => `
                                    <div class="problem-category" data-category="${key}">
                                        <div class="category-icon">${category.icon}</div>
                                        <div class="category-content">
                                            <h4>${category.name}</h4>
                                            <p>${category.description}</p>
                                        </div>
                                        <div class="category-arrow">→</div>
                                    </div>
                                `).join('')}
                            </div>
                            
                            <div class="emergency-section">
                                <h4>🚨 Emergency Situations</h4>
                                <p>If you're experiencing a critical issue that's stopping all work:</p>
                                <button id="emergency-help" class="btn-emergency">Get Emergency Help</button>
                            </div>
                        </div>
                        
                        <!-- Diagnostic Questions -->
                        <div id="diagnostic-questions" class="troubleshooter-section" style="display: none;">
                            <div class="progress-header">
                                <button id="back-to-categories" class="back-btn">← Change Problem Type</button>
                                <div class="progress-indicator">
                                    <div class="progress-bar">
                                        <div class="progress-fill" style="width: 0%"></div>
                                    </div>
                                    <span class="progress-text">Step 1 of 3</span>
                                </div>
                            </div>
                            
                            <div class="question-container">
                                <h3 id="current-question">Loading question...</h3>
                                <div id="question-options"></div>
                                <div class="question-actions">
                                    <button id="prev-question" class="btn-secondary" style="display: none;">Previous</button>
                                    <button id="next-question" class="btn-primary" disabled>Next</button>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Solution Display -->
                        <div id="solution-display" class="troubleshooter-section" style="display: none;">
                            <div class="solution-header">
                                <button id="back-to-questions" class="back-btn">← Change Answers</button>
                                <div class="solution-confidence">
                                    <span>AI Confidence:</span>
                                    <span id="confidence-score">85%</span>
                                </div>
                            </div>
                            
                            <div class="solution-content">
                                <div class="diagnosis-section">
                                    <h3>🔍 Diagnosis</h3>
                                    <div class="diagnosis-box">
                                        <h4 id="diagnosis-title">Problem identified</h4>
                                        <div class="diagnosis-meta">
                                            <span class="severity-badge" id="severity-badge">Medium</span>
                                            <span class="time-estimate" id="time-estimate">15-30 minutes</span>
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="solution-steps">
                                    <h3>🛠️ Solution Steps</h3>
                                    <div id="steps-container"></div>
                                </div>
                                
                                <div class="additional-help">
                                    <h4>Need More Help?</h4>
                                    <div class="help-options">
                                        <button id="contact-support" class="btn-secondary">📞 Contact Support</button>
                                        <button id="book-help" class="btn-primary">📅 Book IT Help</button>
                                        <button id="try-different" class="btn-outline">🔄 Try Different Problem</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Emergency Help -->
                        <div id="emergency-help-section" class="troubleshooter-section" style="display: none;">
                            <div class="emergency-header">
                                <h3>🚨 Emergency IT Support</h3>
                                <p>Follow these steps for immediate assistance</p>
                            </div>
                            
                            <div class="emergency-contacts">
                                <h4>Immediate Contacts</h4>
                                <div class="contact-list">
                                    <div class="contact-item urgent">
                                        <div class="contact-title">Your IT Support Provider</div>
                                        <div class="contact-action">Call your regular IT support first</div>
                                    </div>
                                    <div class="contact-item">
                                        <div class="contact-title">ClinicIT Emergency Line</div>
                                        <div class="contact-phone">📞 1800-CLINIC-IT</div>
                                        <div class="contact-hours">24/7 Emergency Support</div>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="emergency-steps">
                                <h4>While You Wait for Help</h4>
                                <div class="step-list">
                                    <div class="emergency-step">
                                        <div class="step-number">1</div>
                                        <div class="step-content">
                                            <strong>Document the Problem</strong>
                                            <p>Write down exactly what happened and when</p>
                                        </div>
                                    </div>
                                    <div class="emergency-step">
                                        <div class="step-number">2</div>
                                        <div class="step-content">
                                            <strong>Switch to Backup Procedures</strong>
                                            <p>Use paper forms or alternative systems</p>
                                        </div>
                                    </div>
                                    <div class="emergency-step">
                                        <div class="step-number">3</div>
                                        <div class="step-content">
                                            <strong>Inform Your Team</strong>
                                            <p>Let staff know about the issue and procedures</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', troubleshooterHTML);
        this.bindTroubleshooterEvents();
        this.loadTroubleshooterStyles();
    }
    
    bindTroubleshooterEvents() {
        const closeBtn = document.getElementById('close-troubleshooter');
        const emergencyBtn = document.getElementById('emergency-help');
        const backToCategoriesBtn = document.getElementById('back-to-categories');
        const backToQuestionsBtn = document.getElementById('back-to-questions');
        const nextBtn = document.getElementById('next-question');
        const prevBtn = document.getElementById('prev-question');
        
        closeBtn.addEventListener('click', () => this.closeTroubleshooter());
        emergencyBtn.addEventListener('click', () => this.showEmergencyHelp());
        backToCategoriesBtn.addEventListener('click', () => this.showProblemSelection());
        backToQuestionsBtn.addEventListener('click', () => this.showQuestions());
        nextBtn.addEventListener('click', () => this.nextQuestion());
        prevBtn.addEventListener('click', () => this.previousQuestion());
        
        // Problem category selection
        document.querySelectorAll('.problem-category').forEach(category => {
            category.addEventListener('click', () => {
                const categoryType = category.getAttribute('data-category');
                this.startDiagnostic(categoryType);
            });
        });
    }
    
    showProblemSelection() {
        this.hideAllSections();
        document.getElementById('problem-selection').style.display = 'block';
        this.currentSession = null;
    }
    
    showEmergencyHelp() {
        this.hideAllSections();
        document.getElementById('emergency-help-section').style.display = 'block';
    }
    
    startDiagnostic(categoryType) {
        const category = this.troubleshootingData.categories[categoryType];
        if (!category) return;
        
        this.currentSession = {
            category: categoryType,
            questions: [...category.diagnosticTree.initialQuestions],
            answers: {},
            currentQuestionIndex: 0
        };
        
        this.hideAllSections();
        document.getElementById('diagnostic-questions').style.display = 'block';
        this.showCurrentQuestion();
    }
    
    hideAllSections() {
        document.querySelectorAll('.troubleshooter-section').forEach(section => {
            section.style.display = 'none';
        });
    }
    
    showCurrentQuestion() {
        if (!this.currentSession) return;
        
        const question = this.currentSession.questions[this.currentSession.currentQuestionIndex];
        const questionElement = document.getElementById('current-question');
        const optionsElement = document.getElementById('question-options');
        const nextBtn = document.getElementById('next-question');
        const prevBtn = document.getElementById('prev-question');
        
        questionElement.textContent = question.question;
        
        // Update progress
        const progress = ((this.currentSession.currentQuestionIndex + 1) / this.currentSession.questions.length) * 100;
        document.querySelector('.progress-fill').style.width = `${progress}%`;
        document.querySelector('.progress-text').textContent = 
            `Step ${this.currentSession.currentQuestionIndex + 1} of ${this.currentSession.questions.length}`;
        
        // Show/hide navigation buttons
        prevBtn.style.display = this.currentSession.currentQuestionIndex > 0 ? 'inline-block' : 'none';
        
        // Generate options based on question type
        optionsElement.innerHTML = this.generateQuestionOptions(question);
        
        // Check if we have an existing answer
        const existingAnswer = this.currentSession.answers[question.id];
        if (existingAnswer) {
            this.selectExistingAnswer(question, existingAnswer);
            nextBtn.disabled = false;
        } else {
            nextBtn.disabled = true;
        }
        
        // Bind option events
        this.bindQuestionOptions(question);
    }
    
    generateQuestionOptions(question) {
        switch (question.type) {
            case 'single-choice':
                return question.options.map(option => `
                    <div class="option-item single-choice" data-value="${option.value}">
                        <input type="radio" name="question_${question.id}" value="${option.value}" id="opt_${option.value}">
                        <label for="opt_${option.value}">${option.label}</label>
                    </div>
                `).join('');
                
            case 'multiple-choice':
                return question.options.map(option => `
                    <div class="option-item multiple-choice" data-value="${option.value}">
                        <input type="checkbox" name="question_${question.id}" value="${option.value}" id="opt_${option.value}">
                        <label for="opt_${option.value}">${option.label}</label>
                    </div>
                `).join('');
                
            case 'yes-no':
                return `
                    <div class="option-item single-choice" data-value="yes">
                        <input type="radio" name="question_${question.id}" value="yes" id="opt_yes">
                        <label for="opt_yes">Yes</label>
                    </div>
                    <div class="option-item single-choice" data-value="no">
                        <input type="radio" name="question_${question.id}" value="no" id="opt_no">
                        <label for="opt_no">No</label>
                    </div>
                `;
                
            case 'unknown-allowed':
                return question.options.map(option => `
                    <div class="option-item single-choice" data-value="${option.value}">
                        <input type="radio" name="question_${question.id}" value="${option.value}" id="opt_${option.value}">
                        <label for="opt_${option.value}">${option.label}</label>
                    </div>
                `).join('');
                
            default:
                return '<p>Unknown question type</p>';
        }
    }
    
    bindQuestionOptions(question) {
        const inputs = document.querySelectorAll(`input[name="question_${question.id}"]`);
        const nextBtn = document.getElementById('next-question');
        
        inputs.forEach(input => {
            input.addEventListener('change', () => {
                if (question.type === 'single-choice' || question.type === 'yes-no' || question.type === 'unknown-allowed') {
                    this.currentSession.answers[question.id] = input.value;
                } else if (question.type === 'multiple-choice') {
                    const checkedValues = Array.from(inputs)
                        .filter(i => i.checked)
                        .map(i => i.value);
                    this.currentSession.answers[question.id] = checkedValues;
                }
                
                nextBtn.disabled = false;
            });
        });
    }
    
    selectExistingAnswer(question, answer) {
        if (question.type === 'multiple-choice') {
            answer.forEach(value => {
                const input = document.querySelector(`input[value="${value}"]`);
                if (input) input.checked = true;
            });
        } else {
            const input = document.querySelector(`input[value="${answer}"]`);
            if (input) input.checked = true;
        }
    }
    
    nextQuestion() {
        if (!this.currentSession) return;
        
        // Check if we're at the end
        if (this.currentSession.currentQuestionIndex >= this.currentSession.questions.length - 1) {
            this.generateSolution();
            return;
        }
        
        // Check if we need to branch based on current answers
        const currentAnswer = this.getCurrentAnswer();
        const additionalQuestions = this.getAdditionalQuestions(currentAnswer);
        
        if (additionalQuestions && additionalQuestions.length > 0) {
            // Add additional questions to the sequence
            this.currentSession.questions = [
                ...this.currentSession.questions.slice(0, this.currentSession.currentQuestionIndex + 1),
                ...additionalQuestions,
                ...this.currentSession.questions.slice(this.currentSession.currentQuestionIndex + 1)
            ];
        }
        
        this.currentSession.currentQuestionIndex++;
        this.showCurrentQuestion();
    }
    
    previousQuestion() {
        if (!this.currentSession || this.currentSession.currentQuestionIndex <= 0) return;
        
        this.currentSession.currentQuestionIndex--;
        this.showCurrentQuestion();
    }
    
    getCurrentAnswer() {
        const currentQuestion = this.currentSession.questions[this.currentSession.currentQuestionIndex];
        return this.currentSession.answers[currentQuestion.id];
    }
    
    getAdditionalQuestions(currentAnswer) {
        // This would determine if we need to ask follow-up questions based on the current path
        const category = this.troubleshootingData.categories[this.currentSession.category];
        const currentQuestion = this.currentSession.questions[this.currentSession.currentQuestionIndex];
        
        // Check if there are specific follow-up questions for this answer path
        const diagnosticPath = category.diagnosticTree.diagnosticPaths[currentAnswer];
        return diagnosticPath?.questions || [];
    }
    
    generateSolution() {
        const solution = this.findBestSolution();
        this.displaySolution(solution);
    }
    
    findBestSolution() {
        // AI logic to determine the best solution based on all answers
        const category = this.troubleshootingData.categories[this.currentSession.category];
        const answers = this.currentSession.answers;
        
        // Create a key from the primary answers to find the best solution
        const solutionKey = this.generateSolutionKey(answers);
        
        // Look for exact match first
        for (const [pathKey, path] of Object.entries(category.diagnosticTree.diagnosticPaths)) {
            if (path.solutions && path.solutions[solutionKey]) {
                return path.solutions[solutionKey];
            }
        }
        
        // Fallback to partial matches or default solutions
        return this.findFallbackSolution(category, answers);
    }
    
    generateSolutionKey(answers) {
        // Generate a key based on the most important answers
        const primaryAnswers = [];
        
        // Get the first two answers as they're usually the most important
        const questionIds = Object.keys(answers);
        if (questionIds.length >= 2) {
            primaryAnswers.push(answers[questionIds[0]], answers[questionIds[1]]);
        }
        
        return primaryAnswers.join('_');
    }
    
    findFallbackSolution(category, answers) {
        // Return a generic solution based on the category and common patterns
        return {
            diagnosis: 'General troubleshooting approach needed',
            confidence: 70,
            steps: [
                'Try restarting the application',
                'Check for software updates',
                'Contact your IT support provider',
                'Document the specific error messages or symptoms'
            ],
            severity: 'medium',
            timeEstimate: '15-30 minutes'
        };
    }
    
    displaySolution(solution) {
        this.hideAllSections();
        document.getElementById('solution-display').style.display = 'block';
        
        // Update solution content
        document.getElementById('diagnosis-title').textContent = solution.diagnosis;
        document.getElementById('confidence-score').textContent = `${solution.confidence}%`;
        document.getElementById('time-estimate').textContent = solution.timeEstimate;
        
        const severityBadge = document.getElementById('severity-badge');
        severityBadge.textContent = solution.severity.charAt(0).toUpperCase() + solution.severity.slice(1);
        severityBadge.className = `severity-badge severity-${solution.severity}`;
        
        // Generate steps
        const stepsContainer = document.getElementById('steps-container');
        stepsContainer.innerHTML = solution.steps.map((step, index) => {
            const isUrgent = step.startsWith('🚨') || step.startsWith('⚠️');
            return `
                <div class="solution-step ${isUrgent ? 'urgent-step' : ''}">
                    <div class="step-number">${index + 1}</div>
                    <div class="step-content">
                        <div class="step-text">${step}</div>
                        <div class="step-actions">
                            <input type="checkbox" id="step_${index}" class="step-checkbox">
                            <label for="step_${index}" class="step-label">Completed</label>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
        
        // Show emergency warning if needed
        if (solution.urgent || solution.stopWork) {
            this.showUrgentWarning(solution);
        }
        
        // Bind solution actions
        this.bindSolutionActions();
    }
    
    showUrgentWarning(solution) {
        const urgentWarning = document.createElement('div');
        urgentWarning.className = 'urgent-warning';
        urgentWarning.innerHTML = `
            <div class="warning-header">
                <span class="warning-icon">🚨</span>
                <span class="warning-title">URGENT ACTION REQUIRED</span>
            </div>
            <div class="warning-content">
                ${solution.stopWork ? '<p><strong>STOP:</strong> Do not continue using the system until this is resolved.</p>' : ''}
                <p>This issue requires immediate attention to prevent data loss or security risks.</p>
            </div>
        `;
        
        const solutionContent = document.querySelector('.solution-content');
        solutionContent.insertBefore(urgentWarning, solutionContent.firstChild);
    }
    
    bindSolutionActions() {
        const contactBtn = document.getElementById('contact-support');
        const bookBtn = document.getElementById('book-help');
        const tryDifferentBtn = document.getElementById('try-different');
        
        contactBtn.addEventListener('click', () => this.showSupportContacts());
        bookBtn.addEventListener('click', () => this.bookITHelp());
        tryDifferentBtn.addEventListener('click', () => this.showProblemSelection());
        
        // Bind step checkboxes
        document.querySelectorAll('.step-checkbox').forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                const stepElement = checkbox.closest('.solution-step');
                stepElement.classList.toggle('completed', checkbox.checked);
            });
        });
    }
    
    showSupportContacts() {
        // This would show relevant support contact information
        console.log('📞 Showing support contacts...');
    }
    
    bookITHelp() {
        // This would open booking system
        console.log('📅 Opening IT help booking...');
    }
    
    showQuestions() {
        this.hideAllSections();
        document.getElementById('diagnostic-questions').style.display = 'block';
    }
    
    openTroubleshooter() {
        document.getElementById('troubleshooter-modal').style.display = 'flex';
        document.body.style.overflow = 'hidden';
        this.showProblemSelection();
    }
    
    closeTroubleshooter() {
        document.getElementById('troubleshooter-modal').style.display = 'none';
        document.body.style.overflow = '';
    }
    
    loadTroubleshooterStyles() {
        if (document.getElementById('troubleshooter-styles')) return;
        
        const styles = `
            <style id="troubleshooter-styles">
                .troubleshooter-modal {
                    max-width: 900px;
                    width: 95%;
                    max-height: 95vh;
                }
                
                .troubleshooter-content {
                    padding: 30px;
                    max-height: calc(95vh - 200px);
                    overflow-y: auto;
                }
                
                .troubleshooter-section h3 {
                    color: var(--text-color);
                    margin-bottom: 25px;
                    text-align: center;
                }
                
                .problem-categories {
                    display: flex;
                    flex-direction: column;
                    gap: 15px;
                    margin-bottom: 40px;
                }
                
                .problem-category {
                    display: flex;
                    align-items: center;
                    background: var(--card-background);
                    border: 2px solid var(--border-color);
                    border-radius: 12px;
                    padding: 20px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }
                
                .problem-category:hover {
                    border-color: var(--accent-color);
                    transform: translateX(5px);
                    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
                }
                
                .category-icon {
                    font-size: 32px;
                    margin-right: 20px;
                    min-width: 50px;
                }
                
                .category-content {
                    flex: 1;
                }
                
                .category-content h4 {
                    color: var(--text-color);
                    margin: 0 0 8px 0;
                    font-size: 18px;
                }
                
                .category-content p {
                    color: var(--text-light);
                    margin: 0;
                    font-size: 14px;
                }
                
                .category-arrow {
                    font-size: 24px;
                    color: var(--accent-color);
                    margin-left: 15px;
                }
                
                .emergency-section {
                    background: #fef5e7;
                    border: 2px solid #f6cc8f;
                    border-radius: 12px;
                    padding: 20px;
                    text-align: center;
                }
                
                /* Dark theme removed */
                
                .emergency-section h4 {
                    color: #d97706;
                    margin: 0 0 10px 0;
                }
                
                .emergency-section p {
                    margin: 0 0 15px 0;
                    color: var(--text-color);
                }
                
                .btn-emergency {
                    background: #dc2626;
                    color: white;
                    border: none;
                    padding: 12px 25px;
                    border-radius: 8px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                
                .btn-emergency:hover {
                    background: #b91c1c;
                    transform: scale(1.05);
                }
                
                .progress-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 30px;
                    padding-bottom: 20px;
                    border-bottom: 2px solid var(--border-color);
                }
                
                .progress-indicator {
                    display: flex;
                    align-items: center;
                    gap: 15px;
                }
                
                .progress-bar {
                    width: 200px;
                    height: 8px;
                    background: var(--border-color);
                    border-radius: 4px;
                    overflow: hidden;
                }
                
                .progress-fill {
                    height: 100%;
                    background: linear-gradient(90deg, var(--accent-color), var(--accent-hover));
                    transition: width 0.5s ease;
                }
                
                .progress-text {
                    font-size: 14px;
                    color: var(--text-light);
                    font-weight: 600;
                }
                
                .question-container {
                    background: var(--card-background);
                    border-radius: 15px;
                    padding: 30px;
                }
                
                .question-container h3 {
                    color: var(--text-color);
                    margin-bottom: 25px;
                    font-size: 20px;
                    text-align: left;
                }
                
                .option-item {
                    display: flex;
                    align-items: center;
                    background: var(--background-color);
                    border: 2px solid var(--border-color);
                    border-radius: 8px;
                    padding: 15px;
                    margin-bottom: 10px;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                
                .option-item:hover {
                    border-color: var(--accent-color);
                    background: var(--accent-color-light, rgba(16, 163, 127, 0.1));
                }
                
                .option-item input {
                    margin-right: 12px;
                }
                
                .option-item label {
                    cursor: pointer;
                    color: var(--text-color);
                    font-size: 16px;
                }
                
                .question-actions {
                    display: flex;
                    justify-content: space-between;
                    margin-top: 30px;
                    padding-top: 20px;
                    border-top: 1px solid var(--border-color);
                }
                
                .solution-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 30px;
                    padding-bottom: 20px;
                    border-bottom: 2px solid var(--border-color);
                }
                
                .solution-confidence {
                    color: var(--text-light);
                    font-size: 14px;
                }
                
                .diagnosis-section {
                    margin-bottom: 30px;
                }
                
                .diagnosis-box {
                    background: var(--card-background);
                    border: 2px solid var(--accent-color);
                    border-radius: 12px;
                    padding: 25px;
                }
                
                .diagnosis-box h4 {
                    color: var(--text-color);
                    margin: 0 0 15px 0;
                    font-size: 20px;
                }
                
                .diagnosis-meta {
                    display: flex;
                    gap: 15px;
                    align-items: center;
                }
                
                .severity-badge {
                    padding: 4px 12px;
                    border-radius: 20px;
                    font-size: 12px;
                    font-weight: bold;
                    text-transform: uppercase;
                }
                
                .severity-low {
                    background: #d1fae5;
                    color: #065f46;
                }
                
                .severity-medium {
                    background: #fef3c7;
                    color: #92400e;
                }
                
                .severity-high {
                    background: #fecaca;
                    color: #991b1b;
                }
                
                .severity-critical {
                    background: #dc2626;
                    color: white;
                }
                
                .time-estimate {
                    color: var(--text-light);
                    font-size: 14px;
                }
                
                .solution-steps {
                    margin-bottom: 30px;
                }
                
                .solution-step {
                    display: flex;
                    align-items: flex-start;
                    background: var(--background-color);
                    border: 2px solid var(--border-color);
                    border-radius: 8px;
                    padding: 20px;
                    margin-bottom: 15px;
                    transition: all 0.3s ease;
                }
                
                .solution-step.completed {
                    opacity: 0.6;
                    border-color: #10b981;
                    background: rgba(16, 185, 129, 0.1);
                }
                
                .solution-step.urgent-step {
                    border-color: #dc2626;
                    background: rgba(220, 38, 38, 0.1);
                }
                
                .step-number {
                    background: var(--accent-color);
                    color: white;
                    width: 30px;
                    height: 30px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: bold;
                    margin-right: 15px;
                    flex-shrink: 0;
                }
                
                .step-content {
                    flex: 1;
                }
                
                .step-text {
                    color: var(--text-color);
                    margin-bottom: 10px;
                    line-height: 1.5;
                }
                
                .step-actions {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }
                
                .step-checkbox {
                    margin: 0;
                }
                
                .step-label {
                    color: var(--text-light);
                    font-size: 13px;
                    cursor: pointer;
                }
                
                .urgent-warning {
                    background: linear-gradient(135deg, #fef2f2, #fee2e2);
                    border: 2px solid #dc2626;
                    border-radius: 12px;
                    padding: 20px;
                    margin-bottom: 30px;
                }
                
                /* Dark theme removed */
                
                .warning-header {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    margin-bottom: 15px;
                }
                
                .warning-icon {
                    font-size: 24px;
                }
                
                .warning-title {
                    color: #dc2626;
                    font-weight: bold;
                    font-size: 16px;
                }
                
                .warning-content {
                    color: var(--text-color);
                }
                
                .additional-help {
                    background: var(--card-background);
                    border-radius: 12px;
                    padding: 25px;
                    text-align: center;
                }
                
                .additional-help h4 {
                    color: var(--text-color);
                    margin-bottom: 20px;
                }
                
                .help-options {
                    display: flex;
                    gap: 15px;
                    justify-content: center;
                }
                
                .emergency-contacts {
                    margin-bottom: 30px;
                }
                
                .contact-list {
                    display: flex;
                    flex-direction: column;
                    gap: 15px;
                }
                
                .contact-item {
                    background: var(--card-background);
                    border: 2px solid var(--border-color);
                    border-radius: 8px;
                    padding: 20px;
                    text-align: center;
                }
                
                .contact-item.urgent {
                    border-color: var(--accent-color);
                    background: var(--accent-color-light, rgba(16, 163, 127, 0.1));
                }
                
                .contact-title {
                    font-weight: bold;
                    color: var(--text-color);
                    margin-bottom: 8px;
                }
                
                .contact-phone {
                    font-size: 18px;
                    color: var(--accent-color);
                    font-weight: bold;
                    margin-bottom: 5px;
                }
                
                .contact-action, .contact-hours {
                    color: var(--text-light);
                    font-size: 14px;
                }
                
                .emergency-steps {
                    background: var(--background-color);
                    border-radius: 12px;
                    padding: 25px;
                }
                
                .step-list {
                    display: flex;
                    flex-direction: column;
                    gap: 20px;
                }
                
                .emergency-step {
                    display: flex;
                    align-items: flex-start;
                    gap: 15px;
                }
                
                .emergency-step .step-number {
                    background: #dc2626;
                    width: 35px;
                    height: 35px;
                }
                
                .emergency-step .step-content strong {
                    color: var(--text-color);
                }
                
                .emergency-step .step-content p {
                    color: var(--text-light);
                    margin: 5px 0 0 0;
                    font-size: 14px;
                }
                
                .back-btn {
                    background: var(--card-background);
                    border: 2px solid var(--border-color);
                    color: var(--text-color);
                    padding: 8px 15px;
                    border-radius: 20px;
                    cursor: pointer;
                    font-size: 14px;
                    transition: all 0.2s;
                }
                
                .back-btn:hover {
                    border-color: var(--accent-color);
                    color: var(--accent-color);
                }
                
                @media (max-width: 768px) {
                    .troubleshooter-content {
                        padding: 20px;
                    }
                    
                    .progress-header {
                        flex-direction: column;
                        gap: 15px;
                        text-align: center;
                    }
                    
                    .help-options {
                        flex-direction: column;
                    }
                    
                    .diagnosis-meta {
                        flex-direction: column;
                        align-items: flex-start;
                        gap: 10px;
                    }
                    
                    .question-actions {
                        flex-direction: column;
                        gap: 10px;
                    }
                }
            </style>
        `;
        
        document.head.insertAdjacentHTML('beforeend', styles);
    }
    
    // Public method for external access
    openTroubleshooter() {
        this.showTroubleshooter();
    }
    
    showTroubleshooter() {
        const modal = document.getElementById('troubleshooter-modal');
        if (modal) {
            modal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
            
            // Reset to problem selection
            this.resetTroubleshooter();
        } else {
            console.log('Creating new troubleshooter modal...');
            this.createTroubleshooter();
        }
    }
    
    resetTroubleshooter() {
        this.currentStep = 'problem-selection';
        this.currentProblem = null;
        this.problemPath = [];
        
        // Reset UI to initial state
        const content = document.getElementById('troubleshooter-content');
        if (content) {
            this.showProblemSelection();
        }
    }
}

// Initialize and make available globally
document.addEventListener('DOMContentLoaded', () => {
    if (typeof AI_CONFIG !== 'undefined' && AI_CONFIG.ENABLE_AI_FEATURES) {
        window.aiTroubleshooter = new AITroubleshooter();
        console.log('🔧 AI Troubleshooter initialized');
    }
});

window.AITroubleshooter = AITroubleshooter;
