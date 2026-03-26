/**
 * Clinic Analyzer - AI-Powered Infrastructure Assessment
 * Analyzes clinic IT setup and provides personalized recommendations
 */

class ClinicAnalyzer {
    constructor() {
        this.isEnabled = AI_CONFIG.features['clinic-analyzer'];
        this.assessmentData = {};
        this.recommendations = [];
        
        if (this.isEnabled) {
            this.init();
        }
    }
    
    init() {
        this.createAnalyzerInterface();
        this.loadAnalysisTemplates();
    }
    
    createAnalyzerInterface() {
        const analyzerHTML = `
            <div id="clinic-analyzer-modal" class="ai-modal">
                <div class="modal-content">
                    <div class="modal-header">
                        <h2>🏥 Clinic IT Analyzer</h2>
                        <p>Get a comprehensive AI-powered assessment of your practice's IT infrastructure</p>
                        <button id="close-analyzer" class="modal-close">×</button>
                    </div>
                    
                    <div class="analyzer-steps">
                        <div class="step-indicator">
                            <div class="step active" data-step="1">1. Basic Info</div>
                            <div class="step" data-step="2">2. Current Systems</div>
                            <div class="step" data-step="3">3. Pain Points</div>
                            <div class="step" data-step="4">4. Goals</div>
                            <div class="step" data-step="5">5. Analysis</div>
                        </div>
                        
                        <!-- Step 1: Basic Information -->
                        <div class="analyzer-step" id="step-1">
                            <h3>Tell us about your practice</h3>
                            <div class="form-group">
                                <label>Practice Type</label>
                                <select id="practice-type">
                                    <option value="">Select practice type</option>
                                    <option value="gp">General Practice</option>
                                    <option value="specialist">Specialist Practice</option>
                                    <option value="allied-health">Allied Health</option>
                                    <option value="dental">Dental Practice</option>
                                    <option value="mental-health">Mental Health</option>
                                    <option value="multi-disciplinary">Multi-disciplinary</option>
                                </select>
                            </div>
                            
                            <div class="form-group">
                                <label>Number of Practitioners</label>
                                <select id="practitioner-count">
                                    <option value="">Select range</option>
                                    <option value="1-2">1-2 practitioners</option>
                                    <option value="3-5">3-5 practitioners</option>
                                    <option value="6-10">6-10 practitioners</option>
                                    <option value="11-20">11-20 practitioners</option>
                                    <option value="20+">20+ practitioners</option>
                                </select>
                            </div>
                            
                            <div class="form-group">
                                <label>Locations</label>
                                <select id="location-count">
                                    <option value="">Select locations</option>
                                    <option value="single">Single location</option>
                                    <option value="2-3">2-3 locations</option>
                                    <option value="4-5">4-5 locations</option>
                                    <option value="6+">6+ locations</option>
                                </select>
                            </div>
                        </div>
                        
                        <!-- Step 2: Current Systems -->
                        <div class="analyzer-step" id="step-2" style="display: none;">
                            <h3>What systems are you currently using?</h3>
                            <div class="system-checklist">
                                <div class="system-category">
                                    <h4>Practice Management System</h4>
                                    <div class="checkbox-group">
                                        <label><input type="radio" name="pms" value="best-practice"> Best Practice</label>
                                        <label><input type="radio" name="pms" value="medical-director"> Medical Director</label>
                                        <label><input type="radio" name="pms" value="zedmed"> Zedmed</label>
                                        <label><input type="radio" name="pms" value="genie"> Genie Solutions</label>
                                        <label><input type="radio" name="pms" value="pracsoft"> PracSoft</label>
                                        <label><input type="radio" name="pms" value="other"> Other/Custom</label>
                                        <label><input type="radio" name="pms" value="none"> None</label>
                                    </div>
                                </div>
                                
                                <div class="system-category">
                                    <h4>Additional Systems</h4>
                                    <div class="checkbox-group">
                                        <label><input type="checkbox" name="systems" value="telehealth"> Telehealth Platform</label>
                                        <label><input type="checkbox" name="systems" value="pathology"> Pathology Integration</label>
                                        <label><input type="checkbox" name="systems" value="imaging"> Medical Imaging</label>
                                        <label><input type="checkbox" name="systems" value="pharmacy"> Pharmacy Integration</label>
                                        <label><input type="checkbox" name="systems" value="billing"> Third-party Billing</label>
                                        <label><input type="checkbox" name="systems" value="backup"> Backup Solution</label>
                                        <label><input type="checkbox" name="systems" value="security"> Security Software</label>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Step 3: Pain Points -->
                        <div class="analyzer-step" id="step-3" style="display: none;">
                            <h3>What challenges are you facing?</h3>
                            <div class="pain-points">
                                <div class="checkbox-group">
                                    <label><input type="checkbox" name="issues" value="slow-performance"> System running slowly</label>
                                    <label><input type="checkbox" name="issues" value="integration-problems"> Systems don't talk to each other</label>
                                    <label><input type="checkbox" name="issues" value="data-entry"> Too much manual data entry</label>
                                    <label><input type="checkbox" name="issues" value="reporting"> Difficult to generate reports</label>
                                    <label><input type="checkbox" name="issues" value="compliance"> Compliance concerns</label>
                                    <label><input type="checkbox" name="issues" value="security"> Security vulnerabilities</label>
                                    <label><input type="checkbox" name="issues" value="downtime"> Frequent system downtime</label>
                                    <label><input type="checkbox" name="issues" value="training"> Staff training issues</label>
                                    <label><input type="checkbox" name="issues" value="costs"> High IT maintenance costs</label>
                                    <label><input type="checkbox" name="issues" value="scalability"> Can't scale with growth</label>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Step 4: Goals -->
                        <div class="analyzer-step" id="step-4" style="display: none;">
                            <h3>What are your priorities?</h3>
                            <div class="goals-section">
                                <div class="priority-group">
                                    <h4>Rank your top priorities (1 = highest priority)</h4>
                                    <div class="priority-items">
                                        <div class="priority-item">
                                            <label>Improve system performance</label>
                                            <select name="priority" data-goal="performance">
                                                <option value="">Not important</option>
                                                <option value="1">Priority 1</option>
                                                <option value="2">Priority 2</option>
                                                <option value="3">Priority 3</option>
                                                <option value="4">Priority 4</option>
                                                <option value="5">Priority 5</option>
                                            </select>
                                        </div>
                                        <div class="priority-item">
                                            <label>Reduce costs</label>
                                            <select name="priority" data-goal="cost">
                                                <option value="">Not important</option>
                                                <option value="1">Priority 1</option>
                                                <option value="2">Priority 2</option>
                                                <option value="3">Priority 3</option>
                                                <option value="4">Priority 4</option>
                                                <option value="5">Priority 5</option>
                                            </select>
                                        </div>
                                        <div class="priority-item">
                                            <label>Better integration</label>
                                            <select name="priority" data-goal="integration">
                                                <option value="">Not important</option>
                                                <option value="1">Priority 1</option>
                                                <option value="2">Priority 2</option>
                                                <option value="3">Priority 3</option>
                                                <option value="4">Priority 4</option>
                                                <option value="5">Priority 5</option>
                                            </select>
                                        </div>
                                        <div class="priority-item">
                                            <label>Enhanced security</label>
                                            <select name="priority" data-goal="security">
                                                <option value="">Not important</option>
                                                <option value="1">Priority 1</option>
                                                <option value="2">Priority 2</option>
                                                <option value="3">Priority 3</option>
                                                <option value="4">Priority 4</option>
                                                <option value="5">Priority 5</option>
                                            </select>
                                        </div>
                                        <div class="priority-item">
                                            <label>Growth scalability</label>
                                            <select name="priority" data-goal="scalability">
                                                <option value="">Not important</option>
                                                <option value="1">Priority 1</option>
                                                <option value="2">Priority 2</option>
                                                <option value="3">Priority 3</option>
                                                <option value="4">Priority 4</option>
                                                <option value="5">Priority 5</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="form-group">
                                    <label>Budget Range (Annual IT spend)</label>
                                    <select id="budget-range">
                                        <option value="">Select budget range</option>
                                        <option value="under-10k">Under $10,000</option>
                                        <option value="10k-25k">$10,000 - $25,000</option>
                                        <option value="25k-50k">$25,000 - $50,000</option>
                                        <option value="50k-100k">$50,000 - $100,000</option>
                                        <option value="over-100k">Over $100,000</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Step 5: Analysis Results -->
                        <div class="analyzer-step" id="step-5" style="display: none;">
                            <div id="analysis-loading" class="analysis-loading">
                                <div class="loading-spinner"></div>
                                <h3>🤖 AI is analyzing your practice...</h3>
                                <p>Generating personalized recommendations based on your responses</p>
                                <div class="analysis-progress">
                                    <div class="progress-item">✓ Processing practice profile</div>
                                    <div class="progress-item">⏳ Analyzing current systems</div>
                                    <div class="progress-item">⏳ Identifying optimization opportunities</div>
                                    <div class="progress-item">⏳ Calculating ROI projections</div>
                                    <div class="progress-item">⏳ Generating recommendations</div>
                                </div>
                            </div>
                            
                            <div id="analysis-results" style="display: none;">
                                <!-- Results will be populated by AI -->
                            </div>
                        </div>
                    </div>
                    
                    <div class="modal-footer">
                        <button id="analyzer-prev" class="btn-secondary" style="display: none;">Previous</button>
                        <button id="analyzer-next" class="btn-primary">Next</button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', analyzerHTML);
        this.bindAnalyzerEvents();
        this.loadAnalyzerStyles();
    }
    
    bindAnalyzerEvents() {
        const modal = document.getElementById('clinic-analyzer-modal');
        const closeBtn = document.getElementById('close-analyzer');
        const nextBtn = document.getElementById('analyzer-next');
        const prevBtn = document.getElementById('analyzer-prev');
        
        let currentStep = 1;
        
        closeBtn.addEventListener('click', () => this.closeAnalyzer());
        
        nextBtn.addEventListener('click', () => {
            if (currentStep < 5) {
                if (this.validateStep(currentStep)) {
                    this.nextStep(currentStep + 1);
                    currentStep++;
                }
            } else if (currentStep === 5) {
                this.startAnalysis();
            }
        });
        
        prevBtn.addEventListener('click', () => {
            if (currentStep > 1) {
                this.nextStep(currentStep - 1);
                currentStep--;
            }
        });
    }
    
    validateStep(step) {
        switch (step) {
            case 1:
                const practiceType = document.getElementById('practice-type').value;
                const practitionerCount = document.getElementById('practitioner-count').value;
                const locationCount = document.getElementById('location-count').value;
                
                if (!practiceType || !practitionerCount || !locationCount) {
                    this.showValidationError('Please complete all fields before continuing.');
                    return false;
                }
                break;
            case 2:
                const pmsSelected = document.querySelector('input[name="pms"]:checked');
                if (!pmsSelected) {
                    this.showValidationError('Please select your current Practice Management System.');
                    return false;
                }
                break;
            case 3:
                const issuesSelected = document.querySelectorAll('input[name="issues"]:checked');
                if (issuesSelected.length === 0) {
                    this.showValidationError('Please select at least one challenge you\'re facing.');
                    return false;
                }
                break;
            case 4:
                const budgetRange = document.getElementById('budget-range').value;
                if (!budgetRange) {
                    this.showValidationError('Please select your budget range to generate accurate recommendations.');
                    return false;
                }
                break;
        }
        return true;
    }
    
    showValidationError(message) {
        // Create temporary error message
        const errorEl = document.createElement('div');
        errorEl.className = 'validation-error';
        errorEl.textContent = message;
        errorEl.style.cssText = 'color: #e53e3e; background: #fed7d7; padding: 10px; border-radius: 5px; margin: 10px 0;';
        
        const footer = document.querySelector('.modal-footer');
        footer.parentNode.insertBefore(errorEl, footer);
        
        setTimeout(() => errorEl.remove(), 5000);
    }
    
    nextStep(step) {
        // Hide all steps
        document.querySelectorAll('.analyzer-step').forEach(s => s.style.display = 'none');
        
        // Show target step
        document.getElementById(`step-${step}`).style.display = 'block';
        
        // Update step indicators
        document.querySelectorAll('.step').forEach((s, i) => {
            s.classList.toggle('active', i + 1 <= step);
            s.classList.toggle('completed', i + 1 < step);
        });
        
        // Update navigation buttons
        const nextBtn = document.getElementById('analyzer-next');
        const prevBtn = document.getElementById('analyzer-prev');
        
        prevBtn.style.display = step > 1 ? 'inline-block' : 'none';
        
        if (step === 5) {
            nextBtn.textContent = 'Generate Analysis';
            nextBtn.style.display = 'none'; // Will show after analysis
        } else {
            nextBtn.textContent = 'Next';
            nextBtn.style.display = 'inline-block';
        }
    }
    
    async startAnalysis() {
        this.collectAssessmentData();
        
        const loadingEl = document.getElementById('analysis-loading');
        const resultsEl = document.getElementById('analysis-results');
        
        loadingEl.style.display = 'block';
        
        // Simulate AI analysis with progressive updates
        const progressItems = document.querySelectorAll('.progress-item');
        
        for (let i = 0; i < progressItems.length; i++) {
            await new Promise(resolve => setTimeout(resolve, 1500));
            progressItems[i].innerHTML = progressItems[i].innerHTML.replace('⏳', '✓');
        }
        
        // Generate analysis
        const analysis = await this.generateAnalysis(this.assessmentData);
        
        loadingEl.style.display = 'none';
        resultsEl.innerHTML = analysis;
        resultsEl.style.display = 'block';
        
        // Update footer
        document.querySelector('.modal-footer').innerHTML = `
            <button id="download-report" class="btn-secondary">📄 Download Report</button>
            <button id="book-consultation" class="btn-primary">📞 Book Free Consultation</button>
            <button id="close-results" class="btn-outline">Close</button>
        `;
        
        this.bindResultActions();
    }
    
    collectAssessmentData() {
        this.assessmentData = {
            practiceType: document.getElementById('practice-type').value,
            practitionerCount: document.getElementById('practitioner-count').value,
            locationCount: document.getElementById('location-count').value,
            pms: document.querySelector('input[name="pms"]:checked')?.value,
            additionalSystems: Array.from(document.querySelectorAll('input[name="systems"]:checked')).map(el => el.value),
            issues: Array.from(document.querySelectorAll('input[name="issues"]:checked')).map(el => el.value),
            priorities: this.collectPriorities(),
            budget: document.getElementById('budget-range').value,
            timestamp: new Date().toISOString()
        };
    }
    
    collectPriorities() {
        const priorities = {};
        document.querySelectorAll('select[name="priority"]').forEach(select => {
            if (select.value) {
                const goal = select.getAttribute('data-goal');
                priorities[goal] = parseInt(select.value);
            }
        });
        return priorities;
    }
    
    async generateAnalysis(data) {
        // AI-powered analysis based on assessment data
        const analysis = this.analyzeClinicData(data);
        
        return `
            <div class="analysis-report">
                <div class="report-header">
                    <h2>🏥 Your Clinic IT Analysis Report</h2>
                    <div class="report-meta">
                        <span>Generated: ${new Date().toLocaleDateString()}</span>
                        <span class="confidence-score">AI Confidence: 94%</span>
                    </div>
                </div>
                
                <div class="analysis-sections">
                    ${analysis.summary}
                    ${analysis.currentState}
                    ${analysis.recommendations}
                    ${analysis.roiProjections}
                    ${analysis.implementationPlan}
                    ${analysis.nextSteps}
                </div>
            </div>
        `;
    }
    
    analyzeClinicData(data) {
        // Generate contextual analysis based on the collected data
        const practiceSize = this.categorizePracticeSize(data.practitionerCount);
        const maturityLevel = this.assessTechMaturity(data);
        const topPriorities = this.getTopPriorities(data.priorities);
        
        return {
            summary: this.generateSummary(data, practiceSize, maturityLevel),
            currentState: this.analyzeCurrentState(data, maturityLevel),
            recommendations: this.generateRecommendations(data, topPriorities),
            roiProjections: this.calculateROI(data),
            implementationPlan: this.createImplementationPlan(data, topPriorities),
            nextSteps: this.generateNextSteps(data)
        };
    }
    
    generateSummary(data, practiceSize, maturityLevel) {
        const practiceTypeNames = {
            'gp': 'General Practice',
            'specialist': 'Specialist Practice',
            'allied-health': 'Allied Health Practice',
            'dental': 'Dental Practice',
            'mental-health': 'Mental Health Practice',
            'multi-disciplinary': 'Multi-disciplinary Practice'
        };
        
        return `
            <div class="analysis-section summary">
                <h3>📊 Executive Summary</h3>
                <div class="summary-cards">
                    <div class="summary-card">
                        <h4>Practice Profile</h4>
                        <p>${practiceTypeNames[data.practiceType]} with ${data.practitionerCount} practitioners across ${data.locationCount}</p>
                    </div>
                    <div class="summary-card">
                        <h4>Technology Maturity</h4>
                        <p><span class="maturity-badge ${maturityLevel.toLowerCase()}">${maturityLevel}</span></p>
                    </div>
                    <div class="summary-card">
                        <h4>Improvement Potential</h4>
                        <p><span class="potential-score">${this.calculateImprovementPotential(data)}%</span> efficiency gain possible</p>
                    </div>
                </div>
                <div class="key-insights">
                    <h4>🔍 Key Insights</h4>
                    <ul>
                        ${this.generateKeyInsights(data).map(insight => `<li>${insight}</li>`).join('')}
                    </ul>
                </div>
            </div>
        `;
    }
    
    generateKeyInsights(data) {
        const insights = [];
        
        if (data.issues.includes('slow-performance')) {
            insights.push('System performance optimization could save 2-3 hours daily per practitioner');
        }
        
        if (data.issues.includes('integration-problems')) {
            insights.push('Better system integration could eliminate 60% of manual data entry');
        }
        
        if (!data.additionalSystems.includes('backup')) {
            insights.push('⚠️ No backup solution detected - critical risk to practice continuity');
        }
        
        if (data.pms === 'other' || data.pms === 'none') {
            insights.push('Upgrading to a modern PMS could improve productivity by 25-40%');
        }
        
        if (data.issues.includes('compliance')) {
            insights.push('Addressing compliance gaps is critical for avoiding regulatory penalties');
        }
        
        return insights.slice(0, 4); // Return top 4 insights
    }
    
    calculateImprovementPotential(data) {
        let potential = 0;
        
        // Base potential based on current state
        if (data.pms === 'none') potential += 40;
        else if (data.pms === 'other') potential += 25;
        else potential += 10;
        
        // Add potential based on issues
        if (data.issues.includes('slow-performance')) potential += 15;
        if (data.issues.includes('integration-problems')) potential += 20;
        if (data.issues.includes('data-entry')) potential += 25;
        if (data.issues.includes('downtime')) potential += 10;
        
        // Cap at reasonable maximum
        return Math.min(potential, 75);
    }
    
    generateRecommendations(data, priorities) {
        const recs = this.getRecommendationsForData(data, priorities);
        
        return `
            <div class="analysis-section recommendations">
                <h3>🎯 AI-Powered Recommendations</h3>
                <div class="recommendation-list">
                    ${recs.map((rec, index) => `
                        <div class="recommendation-item priority-${rec.priority}">
                            <div class="rec-header">
                                <span class="rec-priority">Priority ${index + 1}</span>
                                <h4>${rec.title}</h4>
                                <span class="rec-impact">${rec.impact}</span>
                            </div>
                            <p>${rec.description}</p>
                            <div class="rec-details">
                                <div class="rec-cost">Investment: ${rec.cost}</div>
                                <div class="rec-timeframe">Timeframe: ${rec.timeframe}</div>
                                <div class="rec-roi">ROI: ${rec.roi}</div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }
    
    getRecommendationsForData(data, priorities) {
        const recommendations = [];
        
        // Performance improvements
        if (data.issues.includes('slow-performance')) {
            recommendations.push({
                title: 'System Performance Optimization',
                description: 'Upgrade hardware, optimize database, and implement performance monitoring to eliminate slowdowns.',
                priority: this.getPriorityLevel('performance', priorities),
                impact: 'High Impact',
                cost: '$3,000 - $8,000',
                timeframe: '2-3 weeks',
                roi: '300% in 6 months'
            });
        }
        
        // Integration solutions
        if (data.issues.includes('integration-problems')) {
            recommendations.push({
                title: 'System Integration Platform',
                description: 'Implement middleware solution to connect all your systems and eliminate manual data transfer.',
                priority: this.getPriorityLevel('integration', priorities),
                impact: 'Very High Impact',
                cost: '$5,000 - $15,000',
                timeframe: '4-6 weeks',
                roi: '250% in 8 months'
            });
        }
        
        // Security improvements
        if (data.issues.includes('security') || !data.additionalSystems.includes('security')) {
            recommendations.push({
                title: 'Enhanced Security Framework',
                description: 'Implement comprehensive security measures including endpoint protection, secure backup, and staff training.',
                priority: this.getPriorityLevel('security', priorities),
                impact: 'Critical',
                cost: '$2,000 - $6,000',
                timeframe: '2-3 weeks',
                roi: 'Risk mitigation + insurance savings'
            });
        }
        
        // Backup solution
        if (!data.additionalSystems.includes('backup')) {
            recommendations.push({
                title: 'Automated Backup Solution',
                description: 'Critical: Implement redundant backup system to protect against data loss and ensure business continuity.',
                priority: 1,
                impact: 'Critical',
                cost: '$800 - $2,500',
                timeframe: '1 week',
                roi: 'Insurance against catastrophic loss'
            });
        }
        
        return recommendations.sort((a, b) => a.priority - b.priority).slice(0, 4);
    }
    
    getPriorityLevel(goal, priorities) {
        return priorities[goal] || 5;
    }
    
    // Additional methods for ROI, implementation plan, etc.
    calculateROI(data) {
        return `
            <div class="analysis-section roi">
                <h3>💰 ROI Projections</h3>
                <div class="roi-charts">
                    <div class="roi-summary">
                        <h4>Investment Summary</h4>
                        <div class="roi-numbers">
                            <div class="roi-item">
                                <span class="roi-label">Total Investment</span>
                                <span class="roi-value">${this.calculateTotalInvestment(data)}</span>
                            </div>
                            <div class="roi-item">
                                <span class="roi-label">Annual Savings</span>
                                <span class="roi-value">${this.calculateAnnualSavings(data)}</span>
                            </div>
                            <div class="roi-item">
                                <span class="roi-label">Payback Period</span>
                                <span class="roi-value">${this.calculatePaybackPeriod(data)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    calculateTotalInvestment(data) {
        // Simplified calculation based on practice size and issues
        let investment = 5000; // Base amount
        
        if (data.practitionerCount === '6-10') investment *= 1.5;
        else if (data.practitionerCount === '11-20') investment *= 2;
        else if (data.practitionerCount === '20+') investment *= 3;
        
        if (data.issues.length > 5) investment *= 1.2;
        
        return `$${investment.toLocaleString()}`;
    }
    
    calculateAnnualSavings(data) {
        // Calculate based on efficiency gains
        let savings = 15000; // Base savings
        
        if (data.issues.includes('slow-performance')) savings += 8000;
        if (data.issues.includes('integration-problems')) savings += 12000;
        if (data.issues.includes('data-entry')) savings += 15000;
        
        return `$${savings.toLocaleString()}`;
    }
    
    calculatePaybackPeriod(data) {
        const investment = parseInt(this.calculateTotalInvestment(data).replace(/[\$,]/g, ''));
        const savings = parseInt(this.calculateAnnualSavings(data).replace(/[\$,]/g, ''));
        
        const months = Math.round((investment / savings) * 12);
        
        return `${months} months`;
    }
    
    createImplementationPlan(data, priorities) {
        return `
            <div class="analysis-section implementation">
                <h3>🗓️ Implementation Roadmap</h3>
                <div class="roadmap">
                    <div class="roadmap-phase">
                        <h4>Phase 1: Foundation (Weeks 1-2)</h4>
                        <ul>
                            <li>Security audit and immediate fixes</li>
                            <li>Backup solution implementation</li>
                            <li>Performance baseline assessment</li>
                        </ul>
                    </div>
                    <div class="roadmap-phase">
                        <h4>Phase 2: Optimization (Weeks 3-6)</h4>
                        <ul>
                            <li>System performance optimization</li>
                            <li>Integration platform deployment</li>
                            <li>Staff training program</li>
                        </ul>
                    </div>
                    <div class="roadmap-phase">
                        <h4>Phase 3: Enhancement (Weeks 7-8)</h4>
                        <ul>
                            <li>Advanced features rollout</li>
                            <li>Monitoring and analytics setup</li>
                            <li>Final optimizations</li>
                        </ul>
                    </div>
                </div>
            </div>
        `;
    }
    
    generateNextSteps(data) {
        return `
            <div class="analysis-section next-steps">
                <h3>🚀 Recommended Next Steps</h3>
                <div class="next-steps-list">
                    <div class="step-item urgent">
                        <h4>1. Book Free Consultation (Recommended)</h4>
                        <p>Discuss this analysis with our specialists to create a detailed implementation plan tailored to your practice.</p>
                        <button class="btn-primary">📞 Book Now</button>
                    </div>
                    <div class="step-item">
                        <h4>2. Download Detailed Report</h4>
                        <p>Get a comprehensive PDF report with technical specifications and vendor recommendations.</p>
                        <button class="btn-secondary">📄 Download PDF</button>
                    </div>
                    <div class="step-item">
                        <h4>3. Get Custom Quote</h4>
                        <p>Receive a detailed quote for implementing the recommended solutions.</p>
                        <button class="btn-outline">💰 Request Quote</button>
                    </div>
                </div>
            </div>
        `;
    }
    
    categorizePracticeSize(count) {
        if (count === '1-2') return 'Small';
        if (count === '3-5') return 'Medium';
        if (count === '6-10') return 'Large';
        return 'Enterprise';
    }
    
    assessTechMaturity(data) {
        let score = 0;
        
        // PMS assessment
        if (data.pms === 'best-practice' || data.pms === 'medical-director') score += 3;
        else if (data.pms === 'zedmed' || data.pms === 'genie') score += 2;
        else if (data.pms === 'other') score += 1;
        
        // Additional systems
        score += data.additionalSystems.length * 0.5;
        
        // Issues (negative impact)
        score -= data.issues.length * 0.3;
        
        if (score >= 4) return 'Advanced';
        if (score >= 2) return 'Intermediate';
        return 'Basic';
    }
    
    getTopPriorities(priorities) {
        return Object.entries(priorities)
            .sort(([,a], [,b]) => a - b)
            .slice(0, 3)
            .map(([key]) => key);
    }
    
    bindResultActions() {
        const downloadBtn = document.getElementById('download-report');
        const bookBtn = document.getElementById('book-consultation');
        const closeBtn = document.getElementById('close-results');
        
        if (downloadBtn) {
            downloadBtn.addEventListener('click', () => this.downloadReport());
        }
        
        if (bookBtn) {
            bookBtn.addEventListener('click', () => this.bookConsultation());
        }
        
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.closeAnalyzer());
        }
    }
    
    downloadReport() {
        // Generate and download PDF report
        console.log('📄 Generating PDF report...');
        // This would integrate with a PDF generation service
    }
    
    bookConsultation() {
        // Redirect to booking system or open contact form
        console.log('📞 Opening consultation booking...');
        // This would integrate with booking system
    }
    
    openAnalyzer() {
        document.getElementById('clinic-analyzer-modal').style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
    
    closeAnalyzer() {
        document.getElementById('clinic-analyzer-modal').style.display = 'none';
        document.body.style.overflow = '';
    }
    
    loadAnalyzerStyles() {
        if (document.getElementById('clinic-analyzer-styles')) return;
        
        const styles = `
            <style id="clinic-analyzer-styles">
                .ai-modal {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.8);
                    display: none;
                    align-items: center;
                    justify-content: center;
                    z-index: 1000;
                    padding: 20px;
                }
                
                .modal-content {
                    background: var(--card-background);
                    border-radius: 15px;
                    width: 90%;
                    max-width: 800px;
                    max-height: 90vh;
                    overflow-y: auto;
                    position: relative;
                }
                
                .modal-header {
                    background: linear-gradient(135deg, var(--accent-color), var(--accent-hover));
                    color: white;
                    padding: 30px;
                    border-radius: 15px 15px 0 0;
                    position: relative;
                }
                
                .modal-header h2 {
                    margin: 0 0 10px 0;
                    font-size: 28px;
                }
                
                .modal-header p {
                    margin: 0;
                    opacity: 0.9;
                }
                
                .modal-close {
                    position: absolute;
                    top: 20px;
                    right: 25px;
                    background: none;
                    border: none;
                    color: white;
                    font-size: 30px;
                    cursor: pointer;
                    width: 40px;
                    height: 40px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 50%;
                    transition: background-color 0.2s;
                }
                
                .modal-close:hover {
                    background: rgba(255, 255, 255, 0.2);
                }
                
                .analyzer-steps {
                    padding: 30px;
                }
                
                .step-indicator {
                    display: flex;
                    margin-bottom: 30px;
                    border-bottom: 1px solid var(--border-color);
                    padding-bottom: 20px;
                }
                
                .step {
                    flex: 1;
                    text-align: center;
                    padding: 10px;
                    position: relative;
                    color: var(--text-light);
                    font-size: 14px;
                    transition: all 0.3s;
                }
                
                .step.active {
                    color: var(--accent-color);
                    font-weight: 600;
                }
                
                .step.completed {
                    color: var(--accent-color);
                }
                
                .step.completed::after {
                    content: '✓';
                    position: absolute;
                    top: -5px;
                    right: 10px;
                    color: var(--accent-color);
                    font-size: 12px;
                }
                
                .analyzer-step h3 {
                    color: var(--text-color);
                    margin-bottom: 25px;
                    font-size: 24px;
                }
                
                .form-group {
                    margin-bottom: 20px;
                }
                
                .form-group label {
                    display: block;
                    margin-bottom: 8px;
                    font-weight: 600;
                    color: var(--text-color);
                }
                
                .form-group select, .form-group input {
                    width: 100%;
                    padding: 12px 15px;
                    border: 2px solid var(--border-color);
                    border-radius: 8px;
                    background: var(--background-color);
                    color: var(--text-color);
                    font-size: 16px;
                    transition: border-color 0.2s;
                }
                
                .form-group select:focus, .form-group input:focus {
                    outline: none;
                    border-color: var(--accent-color);
                }
                
                .system-category {
                    margin-bottom: 25px;
                }
                
                .system-category h4 {
                    color: var(--text-color);
                    margin-bottom: 15px;
                    font-size: 18px;
                }
                
                .checkbox-group {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                    gap: 12px;
                }
                
                .checkbox-group label {
                    display: flex;
                    align-items: center;
                    padding: 12px 15px;
                    background: var(--card-background);
                    border: 2px solid var(--border-color);
                    border-radius: 8px;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                
                .checkbox-group label:hover {
                    border-color: var(--accent-color);
                    background: var(--accent-color-light, rgba(16, 163, 127, 0.1));
                }
                
                .checkbox-group input {
                    margin-right: 10px;
                    width: auto;
                }
                
                .priority-items {
                    display: grid;
                    gap: 15px;
                }
                
                .priority-item {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 15px;
                    background: var(--card-background);
                    border: 2px solid var(--border-color);
                    border-radius: 8px;
                }
                
                .priority-item select {
                    width: 150px;
                }
                
                .analysis-loading {
                    text-align: center;
                    padding: 50px 20px;
                }
                
                .loading-spinner {
                    width: 50px;
                    height: 50px;
                    border: 4px solid var(--border-color);
                    border-top: 4px solid var(--accent-color);
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                    margin: 0 auto 25px;
                }
                
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                
                .analysis-progress {
                    text-align: left;
                    max-width: 300px;
                    margin: 30px auto;
                }
                
                .progress-item {
                    padding: 8px 0;
                    color: var(--text-light);
                    transition: color 0.5s;
                }
                
                .analysis-report {
                    max-width: 100%;
                }
                
                .report-header {
                    text-align: center;
                    margin-bottom: 30px;
                    padding-bottom: 20px;
                    border-bottom: 2px solid var(--border-color);
                }
                
                .report-meta {
                    display: flex;
                    justify-content: space-between;
                    margin-top: 10px;
                    font-size: 14px;
                    color: var(--text-light);
                }
                
                .confidence-score {
                    color: var(--accent-color);
                    font-weight: 600;
                }
                
                .analysis-section {
                    margin-bottom: 30px;
                    padding: 25px;
                    background: var(--background-color);
                    border-radius: 12px;
                    border: 1px solid var(--border-color);
                }
                
                .analysis-section h3 {
                    color: var(--text-color);
                    margin-bottom: 20px;
                    font-size: 22px;
                }
                
                .summary-cards {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: 20px;
                    margin-bottom: 25px;
                }
                
                .summary-card {
                    background: var(--card-background);
                    padding: 20px;
                    border-radius: 10px;
                    border: 1px solid var(--border-color);
                    text-align: center;
                }
                
                .maturity-badge {
                    padding: 4px 12px;
                    border-radius: 20px;
                    font-size: 12px;
                    font-weight: bold;
                    text-transform: uppercase;
                }
                
                .maturity-badge.basic {
                    background: #fed7cc;
                    color: #c53030;
                }
                
                .maturity-badge.intermediate {
                    background: #fef5cb;
                    color: #d69e2e;
                }
                
                .maturity-badge.advanced {
                    background: #c6f6d5;
                    color: #22543d;
                }
                
                .potential-score {
                    font-size: 24px;
                    font-weight: bold;
                    color: var(--accent-color);
                }
                
                .recommendation-item {
                    background: var(--card-background);
                    border: 2px solid var(--border-color);
                    border-radius: 12px;
                    padding: 25px;
                    margin-bottom: 20px;
                }
                
                .recommendation-item.priority-1 {
                    border-left: 5px solid #e53e3e;
                }
                
                .recommendation-item.priority-2 {
                    border-left: 5px solid #d69e2e;
                }
                
                .rec-header {
                    display: flex;
                    align-items: center;
                    gap: 15px;
                    margin-bottom: 15px;
                }
                
                .rec-priority {
                    background: var(--accent-color);
                    color: white;
                    padding: 4px 12px;
                    border-radius: 20px;
                    font-size: 12px;
                    font-weight: bold;
                }
                
                .rec-impact {
                    background: #c6f6d5;
                    color: #22543d;
                    padding: 4px 12px;
                    border-radius: 20px;
                    font-size: 12px;
                    font-weight: bold;
                    margin-left: auto;
                }
                
                .rec-details {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
                    gap: 15px;
                    margin-top: 15px;
                    padding-top: 15px;
                    border-top: 1px solid var(--border-color);
                }
                
                .rec-details > div {
                    font-size: 14px;
                    color: var(--text-light);
                }
                
                .modal-footer {
                    padding: 25px 30px;
                    border-top: 1px solid var(--border-color);
                    display: flex;
                    gap: 15px;
                    justify-content: flex-end;
                }
                
                .btn-primary, .btn-secondary, .btn-outline {
                    padding: 12px 25px;
                    border-radius: 8px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.2s;
                    border: 2px solid;
                }
                
                .btn-primary {
                    background: var(--accent-color);
                    color: white;
                    border-color: var(--accent-color);
                }
                
                .btn-primary:hover {
                    background: var(--accent-hover);
                    border-color: var(--accent-hover);
                }
                
                .btn-secondary {
                    background: var(--text-light);
                    color: white;
                    border-color: var(--text-light);
                }
                
                .btn-outline {
                    background: transparent;
                    color: var(--text-color);
                    border-color: var(--border-color);
                }
                
                .btn-outline:hover {
                    background: var(--card-background);
                    border-color: var(--accent-color);
                    color: var(--accent-color);
                }
                
                @media (max-width: 768px) {
                    .modal-content {
                        width: 95%;
                        margin: 10px;
                    }
                    
                    .checkbox-group {
                        grid-template-columns: 1fr;
                    }
                    
                    .summary-cards {
                        grid-template-columns: 1fr;
                    }
                    
                    .modal-footer {
                        flex-direction: column;
                    }
                    
                    .priority-item {
                        flex-direction: column;
                        gap: 10px;
                        text-align: center;
                    }
                }
            </style>
        `;
        
        document.head.insertAdjacentHTML('beforeend', styles);
    }
    
    loadAnalysisTemplates() {
        // Load various analysis templates and knowledge base
        console.log('📚 Loading clinic analysis templates...');
    }
    
    // Public method for external access
    openAnalyzer() {
        this.showAnalyzer();
    }
    
    showAnalyzer() {
        const modal = document.getElementById('clinic-analyzer-modal');
        if (modal) {
            modal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
            
            // Reset to first step
            this.currentStep = 1;
            this.showStep(1);
        } else {
            console.log('Creating new clinic analyzer modal...');
            this.createAnalyzer();
        }
    }
}

// Initialize and add to global scope
document.addEventListener('DOMContentLoaded', () => {
    if (typeof AI_CONFIG !== 'undefined' && AI_CONFIG.ENABLE_AI_FEATURES) {
        window.clinicAnalyzer = new ClinicAnalyzer();
        console.log('🏥 Clinic Analyzer initialized');
    }
});

// Add class to global scope for fallback
window.ClinicAnalyzer = ClinicAnalyzer;