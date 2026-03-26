/**
 * ROI Calculator - AI-Powered Return on Investment Analysis
 * Calculates potential savings and ROI for IT improvements
 */

class ROICalculator {
    constructor() {
        this.isEnabled = AI_CONFIG.features['roi-calculator'];
        this.calculationData = {};
        this.scenarios = [];
        
        if (this.isEnabled) {
            this.init();
        }
    }
    
    init() {
        this.loadROIModels();
        this.createCalculatorInterface();
    }
    
    loadROIModels() {
        // AI-powered ROI calculation models based on Australian healthcare data
        this.roiModels = {
            practiceManagementUpgrade: {
                name: 'Practice Management System Upgrade',
                categories: {
                    timeSavings: {
                        weight: 0.4,
                        factors: {
                            automatedBilling: { impact: 2.5, unit: 'hours/day' },
                            schedulingEfficiency: { impact: 1.5, unit: 'hours/day' },
                            reportGeneration: { impact: 1.0, unit: 'hours/day' },
                            patientCheckIn: { impact: 0.5, unit: 'hours/day' }
                        }
                    },
                    errorReduction: {
                        weight: 0.25,
                        factors: {
                            billingErrors: { impact: 0.15, unit: 'error_rate_reduction' },
                            dataEntry: { impact: 0.20, unit: 'error_rate_reduction' },
                            appointmentMissing: { impact: 0.10, unit: 'error_rate_reduction' }
                        }
                    },
                    complianceImprovement: {
                        weight: 0.2,
                        factors: {
                            auditReadiness: { impact: 5000, unit: 'annual_savings' },
                            regulatoryCompliance: { impact: 3000, unit: 'annual_savings' }
                        }
                    },
                    patientExperience: {
                        weight: 0.15,
                        factors: {
                            reducedWaitTime: { impact: 0.05, unit: 'patient_retention' },
                            onlineBooking: { impact: 0.10, unit: 'patient_retention' }
                        }
                    }
                }
            },
            
            systemIntegration: {
                name: 'System Integration Implementation',
                categories: {
                    dataEfficiency: {
                        weight: 0.5,
                        factors: {
                            eliminateDataEntry: { impact: 3.0, unit: 'hours/day' },
                            automatedReporting: { impact: 2.0, unit: 'hours/day' },
                            realTimeSync: { impact: 1.5, unit: 'hours/day' }
                        }
                    },
                    errorElimination: {
                        weight: 0.3,
                        factors: {
                            transcriptionErrors: { impact: 0.30, unit: 'error_rate_reduction' },
                            versionControl: { impact: 0.25, unit: 'error_rate_reduction' }
                        }
                    },
                    staffProductivity: {
                        weight: 0.2,
                        factors: {
                            reducedTraining: { impact: 2000, unit: 'annual_savings' },
                            systemMastery: { impact: 1500, unit: 'annual_savings' }
                        }
                    }
                }
            },
            
            cloudMigration: {
                name: 'Cloud Migration',
                categories: {
                    infrastructureSavings: {
                        weight: 0.4,
                        factors: {
                            serverMaintenance: { impact: 8000, unit: 'annual_savings' },
                            itSupport: { impact: 12000, unit: 'annual_savings' },
                            powerCosts: { impact: 2400, unit: 'annual_savings' }
                        }
                    },
                    businessContinuity: {
                        weight: 0.3,
                        factors: {
                            downtimeReduction: { impact: 0.95, unit: 'uptime_improvement' },
                            disasterRecovery: { impact: 15000, unit: 'risk_mitigation' }
                        }
                    },
                    scalability: {
                        weight: 0.2,
                        factors: {
                            flexibleResources: { impact: 0.20, unit: 'cost_optimization' },
                            automaticBackup: { impact: 3000, unit: 'annual_savings' }
                        }
                    },
                    accessibility: {
                        weight: 0.1,
                        factors: {
                            remoteAccess: { impact: 1.0, unit: 'hours/day' },
                            mobileProductivity: { impact: 0.5, unit: 'hours/day' }
                        }
                    }
                }
            },
            
            securityUpgrade: {
                name: 'Security Enhancement',
                categories: {
                    riskMitigation: {
                        weight: 0.6,
                        factors: {
                            breachPrevention: { impact: 50000, unit: 'risk_mitigation' },
                            ransomwareProtection: { impact: 25000, unit: 'risk_mitigation' },
                            complianceFines: { impact: 15000, unit: 'risk_mitigation' }
                        }
                    },
                    operationalEfficiency: {
                        weight: 0.25,
                        factors: {
                            automatedSecurity: { impact: 1.0, unit: 'hours/day' },
                            reducedIncidents: { impact: 2000, unit: 'annual_savings' }
                        }
                    },
                    insuranceSavings: {
                        weight: 0.15,
                        factors: {
                            cyberInsurance: { impact: 2500, unit: 'annual_savings' },
                            liabilityReduction: { impact: 1500, unit: 'annual_savings' }
                        }
                    }
                }
            }
        };
    }
    
    createCalculatorInterface() {
        const calculatorHTML = `
            <div id="roi-calculator-modal" class="ai-modal">
                <div class="modal-content calculator-modal">
                    <div class="modal-header">
                        <h2>💰 ROI Calculator</h2>
                        <p>Calculate your potential return on investment for IT improvements</p>
                        <button id="close-calculator" class="modal-close">×</button>
                    </div>
                    
                    <div class="calculator-content">
                        <!-- Calculation Mode Selection -->
                        <div class="calculation-modes">
                            <h3>Choose Your Calculation Method</h3>
                            <div class="mode-cards">
                                <div class="mode-card active" data-mode="quick">
                                    <div class="mode-icon">⚡</div>
                                    <h4>Quick Estimate</h4>
                                    <p>Get instant ROI projections in 2 minutes</p>
                                </div>
                                <div class="mode-card" data-mode="detailed">
                                    <div class="mode-icon">🔬</div>
                                    <h4>Detailed Analysis</h4>
                                    <p>Comprehensive ROI breakdown with scenarios</p>
                                </div>
                                <div class="mode-card" data-mode="comparative">
                                    <div class="mode-icon">📊</div>
                                    <h4>Compare Options</h4>
                                    <p>Compare multiple investment scenarios</p>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Quick Estimate Mode -->
                        <div id="quick-mode" class="calculation-section">
                            <h3>Quick ROI Estimate</h3>
                            
                            <div class="calculator-form">
                                <div class="form-row">
                                    <div class="form-group">
                                        <label>What are you considering?</label>
                                        <select id="investment-type">
                                            <option value="">Select investment type</option>
                                            <option value="practiceManagementUpgrade">Practice Management Upgrade</option>
                                            <option value="systemIntegration">System Integration</option>
                                            <option value="cloudMigration">Cloud Migration</option>
                                            <option value="securityUpgrade">Security Enhancement</option>
                                        </select>
                                    </div>
                                    
                                    <div class="form-group">
                                        <label>Practice Size</label>
                                        <select id="practice-size">
                                            <option value="">Select size</option>
                                            <option value="small">1-3 practitioners</option>
                                            <option value="medium">4-10 practitioners</option>
                                            <option value="large">11-20 practitioners</option>
                                            <option value="enterprise">20+ practitioners</option>
                                        </select>
                                    </div>
                                </div>
                                
                                <div class="form-row">
                                    <div class="form-group">
                                        <label>Expected Investment ($)</label>
                                        <input type="number" id="investment-amount" placeholder="e.g., 15000" min="0" step="1000">
                                    </div>
                                    
                                    <div class="form-group">
                                        <label>Current Annual Revenue ($)</label>
                                        <input type="number" id="annual-revenue" placeholder="e.g., 800000" min="0" step="10000">
                                    </div>
                                </div>
                                
                                <div class="pain-points-section">
                                    <label>Current Pain Points (select all that apply):</label>
                                    <div class="pain-points-grid">
                                        <label><input type="checkbox" value="slow-systems"> Slow systems</label>
                                        <label><input type="checkbox" value="manual-processes"> Manual processes</label>
                                        <label><input type="checkbox" value="data-silos"> Data silos</label>
                                        <label><input type="checkbox" value="compliance-issues"> Compliance issues</label>
                                        <label><input type="checkbox" value="security-concerns"> Security concerns</label>
                                        <label><input type="checkbox" value="staff-inefficiency"> Staff inefficiency</label>
                                        <label><input type="checkbox" value="patient-complaints"> Patient complaints</label>
                                        <label><input type="checkbox" value="high-it-costs"> High IT costs</label>
                                    </div>
                                </div>
                                
                                <button id="calculate-roi" class="btn-primary btn-large">
                                    🧮 Calculate My ROI
                                </button>
                            </div>
                        </div>
                        
                        <!-- Detailed Analysis Mode -->
                        <div id="detailed-mode" class="calculation-section" style="display: none;">
                            <h3>Detailed ROI Analysis</h3>
                            <div class="detailed-form">
                                <!-- This would contain more comprehensive inputs -->
                                <p>Comprehensive analysis coming in Phase 3...</p>
                            </div>
                        </div>
                        
                        <!-- Results Section -->
                        <div id="roi-results" class="results-section" style="display: none;">
                            <div class="results-header">
                                <h3>📈 Your ROI Analysis</h3>
                                <div class="analysis-confidence">
                                    <span>AI Confidence: <strong id="confidence-level">92%</strong></span>
                                </div>
                            </div>
                            
                            <div class="roi-summary">
                                <div class="roi-cards">
                                    <div class="roi-card primary">
                                        <h4>Total ROI</h4>
                                        <div class="roi-value" id="total-roi">245%</div>
                                        <div class="roi-period">Over 3 years</div>
                                    </div>
                                    <div class="roi-card">
                                        <h4>Annual Savings</h4>
                                        <div class="roi-value" id="annual-savings">$42,000</div>
                                        <div class="roi-period">Recurring</div>
                                    </div>
                                    <div class="roi-card">
                                        <h4>Payback Period</h4>
                                        <div class="roi-value" id="payback-period">8 months</div>
                                        <div class="roi-period">Break-even</div>
                                    </div>
                                    <div class="roi-card">
                                        <h4>3-Year Value</h4>
                                        <div class="roi-value" id="three-year-value">$126,000</div>
                                        <div class="roi-period">Net benefit</div>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="savings-breakdown">
                                <h4>💡 Where Your Savings Come From</h4>
                                <div id="savings-categories"></div>
                            </div>
                            
                            <div class="roi-chart-container">
                                <h4>📊 ROI Projection</h4>
                                <div id="roi-chart" class="roi-chart"></div>
                            </div>
                            
                            <div class="implementation-timeline">
                                <h4>🚀 Expected Benefits Timeline</h4>
                                <div id="benefits-timeline"></div>
                            </div>
                            
                            <div class="roi-actions">
                                <button id="download-roi-report" class="btn-secondary">📄 Download Report</button>
                                <button id="schedule-roi-consultation" class="btn-primary">📞 Discuss Results</button>
                                <button id="compare-scenarios" class="btn-outline">⚖️ Compare Scenarios</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', calculatorHTML);
        this.bindCalculatorEvents();
        this.loadCalculatorStyles();
    }
    
    bindCalculatorEvents() {
        const closeBtn = document.getElementById('close-calculator');
        const calculateBtn = document.getElementById('calculate-roi');
        const modeCards = document.querySelectorAll('.mode-card');
        
        closeBtn.addEventListener('click', () => this.closeCalculator());
        calculateBtn.addEventListener('click', () => this.performROICalculation());
        
        modeCards.forEach(card => {
            card.addEventListener('click', () => this.switchMode(card.getAttribute('data-mode')));
        });
        
        // Investment type change handler
        document.getElementById('investment-type').addEventListener('change', (e) => {
            this.updateFormBasedOnType(e.target.value);
        });
    }
    
    switchMode(mode) {
        // Update active mode card
        document.querySelectorAll('.mode-card').forEach(card => {
            card.classList.toggle('active', card.getAttribute('data-mode') === mode);
        });
        
        // Show/hide appropriate sections
        document.querySelectorAll('.calculation-section').forEach(section => {
            section.style.display = 'none';
        });
        
        document.getElementById(`${mode}-mode`).style.display = 'block';
    }
    
    updateFormBasedOnType(type) {
        // Customize form based on investment type
        if (type && this.roiModels[type]) {
            const model = this.roiModels[type];
            console.log(`Selected ${model.name} for ROI calculation`);
            
            // Could dynamically update pain points based on investment type
            this.customizePainPointsForType(type);
        }
    }
    
    customizePainPointsForType(type) {
        const painPointsMap = {
            practiceManagementUpgrade: ['slow-systems', 'manual-processes', 'compliance-issues'],
            systemIntegration: ['data-silos', 'manual-processes', 'staff-inefficiency'],
            cloudMigration: ['high-it-costs', 'security-concerns', 'slow-systems'],
            securityUpgrade: ['security-concerns', 'compliance-issues', 'data-silos']
        };
        
        const relevantPoints = painPointsMap[type] || [];
        
        // Highlight relevant pain points
        document.querySelectorAll('.pain-points-grid label').forEach(label => {
            const checkbox = label.querySelector('input');
            const isRelevant = relevantPoints.includes(checkbox.value);
            label.style.backgroundColor = isRelevant ? 'var(--accent-color-light, rgba(16, 163, 127, 0.1))' : '';
        });
    }
    
    async performROICalculation() {
        const data = this.collectCalculationData();
        
        if (!this.validateCalculationData(data)) {
            return;
        }
        
        // Show calculation progress
        this.showCalculationProgress();
        
        // Simulate AI calculation
        await new Promise(resolve => setTimeout(resolve, 2500));
        
        // Perform calculation
        const results = this.calculateROI(data);
        
        // Display results
        this.displayROIResults(results, data);
    }
    
    collectCalculationData() {
        const painPoints = Array.from(document.querySelectorAll('.pain-points-grid input:checked'))
            .map(cb => cb.value);
            
        return {
            investmentType: document.getElementById('investment-type').value,
            practiceSize: document.getElementById('practice-size').value,
            investmentAmount: parseFloat(document.getElementById('investment-amount').value) || 0,
            annualRevenue: parseFloat(document.getElementById('annual-revenue').value) || 0,
            painPoints: painPoints,
            timestamp: new Date().toISOString()
        };
    }
    
    validateCalculationData(data) {
        const errors = [];
        
        if (!data.investmentType) errors.push('Please select an investment type');
        if (!data.practiceSize) errors.push('Please select your practice size');
        if (!data.investmentAmount || data.investmentAmount <= 0) errors.push('Please enter a valid investment amount');
        if (!data.annualRevenue || data.annualRevenue <= 0) errors.push('Please enter your annual revenue');
        if (data.painPoints.length === 0) errors.push('Please select at least one pain point');
        
        if (errors.length > 0) {
            this.showValidationErrors(errors);
            return false;
        }
        
        return true;
    }
    
    showValidationErrors(errors) {
        const errorHTML = `
            <div class="validation-errors">
                <h5>Please correct the following:</h5>
                <ul>${errors.map(error => `<li>${error}</li>`).join('')}</ul>
            </div>
        `;
        
        const existingError = document.querySelector('.validation-errors');
        if (existingError) existingError.remove();
        
        const form = document.querySelector('.calculator-form');
        form.insertAdjacentHTML('afterbegin', errorHTML);
        
        setTimeout(() => {
            const errorEl = document.querySelector('.validation-errors');
            if (errorEl) errorEl.remove();
        }, 8000);
    }
    
    showCalculationProgress() {
        const progressHTML = `
            <div class="calculation-progress">
                <div class="progress-spinner"></div>
                <h4>🤖 AI is calculating your ROI...</h4>
                <div class="calculation-steps">
                    <div class="calc-step active">Analyzing your practice profile</div>
                    <div class="calc-step">Calculating time savings</div>
                    <div class="calc-step">Projecting cost reductions</div>
                    <div class="calc-step">Assessing risk mitigation</div>
                    <div class="calc-step">Generating ROI projections</div>
                </div>
            </div>
        `;
        
        const resultsSection = document.getElementById('roi-results');
        resultsSection.innerHTML = progressHTML;
        resultsSection.style.display = 'block';
        
        // Animate calculation steps
        setTimeout(() => {
            const steps = document.querySelectorAll('.calc-step');
            steps.forEach((step, index) => {
                setTimeout(() => {
                    step.classList.add('active');
                }, (index + 1) * 500);
            });
        }, 100);
    }
    
    calculateROI(data) {
        const model = this.roiModels[data.investmentType];
        if (!model) return null;
        
        let totalAnnualSavings = 0;
        const savingsBreakdown = {};
        
        // Practice size multipliers
        const sizeMultipliers = {
            small: 1.0,
            medium: 1.5,
            large: 2.2,
            enterprise: 3.5
        };
        
        const sizeMultiplier = sizeMultipliers[data.practiceSize] || 1.0;
        
        // Calculate savings by category
        Object.entries(model.categories).forEach(([categoryName, category]) => {
            let categorySavings = 0;
            
            Object.entries(category.factors).forEach(([factorName, factor]) => {
                let factorSavings = 0;
                
                // Check if this factor applies to the selected pain points
                const isRelevant = this.isFactorRelevant(factorName, data.painPoints);
                if (!isRelevant) return;
                
                switch (factor.unit) {
                    case 'hours/day':
                        // Convert time savings to dollar value
                        const hourlyRate = this.calculateHourlyRate(data.annualRevenue, data.practiceSize);
                        factorSavings = factor.impact * hourlyRate * 250; // 250 working days
                        break;
                        
                    case 'annual_savings':
                        factorSavings = factor.impact;
                        break;
                        
                    case 'error_rate_reduction':
                        // Calculate savings from error reduction
                        const errorCost = this.calculateErrorCosts(data.annualRevenue, data.practiceSize);
                        factorSavings = errorCost * factor.impact;
                        break;
                        
                    case 'patient_retention':
                        // Calculate value of improved patient retention
                        const patientValue = this.calculatePatientValue(data.annualRevenue, data.practiceSize);
                        factorSavings = patientValue * factor.impact;
                        break;
                        
                    case 'uptime_improvement':
                        // Calculate value of reduced downtime
                        const downtimeCost = data.annualRevenue * 0.02; // 2% of revenue
                        factorSavings = downtimeCost * factor.impact;
                        break;
                        
                    case 'risk_mitigation':
                        // Risk mitigation has probabilistic value
                        factorSavings = factor.impact * 0.1; // 10% probability weighting
                        break;
                        
                    case 'cost_optimization':
                        // Percentage of current costs saved
                        const currentITCosts = data.annualRevenue * 0.03; // 3% of revenue
                        factorSavings = currentITCosts * factor.impact;
                        break;
                }
                
                factorSavings *= sizeMultiplier;
                categorySavings += factorSavings;
            });
            
            categorySavings *= category.weight;
            savingsBreakdown[categoryName] = categorySavings;
            totalAnnualSavings += categorySavings;
        });
        
        // Calculate ROI metrics
        const threeYearSavings = totalAnnualSavings * 3;
        const netBenefit = threeYearSavings - data.investmentAmount;
        const roiPercentage = (netBenefit / data.investmentAmount) * 100;
        const paybackMonths = (data.investmentAmount / totalAnnualSavings) * 12;
        
        return {
            totalAnnualSavings: Math.round(totalAnnualSavings),
            threeYearSavings: Math.round(threeYearSavings),
            netBenefit: Math.round(netBenefit),
            roiPercentage: Math.round(roiPercentage),
            paybackMonths: Math.round(paybackMonths * 10) / 10,
            savingsBreakdown: savingsBreakdown,
            investmentAmount: data.investmentAmount,
            confidence: this.calculateConfidence(data)
        };
    }
    
    isFactorRelevant(factorName, painPoints) {
        const factorPainPointMap = {
            automatedBilling: ['manual-processes', 'staff-inefficiency'],
            schedulingEfficiency: ['manual-processes', 'patient-complaints'],
            reportGeneration: ['manual-processes', 'data-silos'],
            billingErrors: ['manual-processes', 'compliance-issues'],
            dataEntry: ['manual-processes', 'staff-inefficiency'],
            eliminateDataEntry: ['manual-processes', 'data-silos'],
            transcriptionErrors: ['manual-processes', 'data-silos'],
            serverMaintenance: ['high-it-costs', 'slow-systems'],
            itSupport: ['high-it-costs', 'staff-inefficiency'],
            breachPrevention: ['security-concerns', 'compliance-issues'],
            automatedSecurity: ['security-concerns', 'staff-inefficiency']
        };
        
        const relevantPainPoints = factorPainPointMap[factorName] || [];
        return relevantPainPoints.some(pain => painPoints.includes(pain));
    }
    
    calculateHourlyRate(annualRevenue, practiceSize) {
        // Estimate average hourly value based on revenue and practice size
        const staffMultipliers = { small: 3, medium: 8, large: 15, enterprise: 30 };
        const totalStaffHours = (staffMultipliers[practiceSize] || 3) * 8 * 250; // staff * hours/day * working days
        return (annualRevenue * 0.6) / totalStaffHours; // 60% of revenue is staff-related
    }
    
    calculateErrorCosts(annualRevenue, practiceSize) {
        // Estimate annual cost of errors (typically 2-5% of revenue)
        return annualRevenue * 0.03;
    }
    
    calculatePatientValue(annualRevenue, practiceSize) {
        const patientCounts = { small: 1000, medium: 3000, large: 6000, enterprise: 12000 };
        const patientCount = patientCounts[practiceSize] || 1000;
        return annualRevenue / patientCount; // Average patient value
    }
    
    calculateConfidence(data) {
        let confidence = 75; // Base confidence
        
        // Increase confidence based on data completeness
        if (data.painPoints.length >= 3) confidence += 10;
        if (data.annualRevenue >= 500000) confidence += 5;
        if (data.investmentAmount >= 10000) confidence += 5;
        if (data.investmentAmount <= 100000) confidence += 5;
        
        return Math.min(confidence, 95);
    }
    
    displayROIResults(results, data) {
        if (!results) {
            this.showCalculationError();
            return;
        }
        
        const resultsHTML = `
            <div class="results-header">
                <h3>📈 Your ROI Analysis</h3>
                <div class="analysis-confidence">
                    <span>AI Confidence: <strong>${results.confidence}%</strong></span>
                </div>
            </div>
            
            <div class="roi-summary">
                <div class="roi-cards">
                    <div class="roi-card primary">
                        <h4>Total ROI</h4>
                        <div class="roi-value">${results.roiPercentage}%</div>
                        <div class="roi-period">Over 3 years</div>
                    </div>
                    <div class="roi-card">
                        <h4>Annual Savings</h4>
                        <div class="roi-value">$${results.totalAnnualSavings.toLocaleString()}</div>
                        <div class="roi-period">Recurring</div>
                    </div>
                    <div class="roi-card">
                        <h4>Payback Period</h4>
                        <div class="roi-value">${results.paybackMonths} months</div>
                        <div class="roi-period">Break-even</div>
                    </div>
                    <div class="roi-card">
                        <h4>3-Year Value</h4>
                        <div class="roi-value">$${results.netBenefit.toLocaleString()}</div>
                        <div class="roi-period">Net benefit</div>
                    </div>
                </div>
            </div>
            
            <div class="savings-breakdown">
                <h4>💡 Where Your Savings Come From</h4>
                ${this.generateSavingsBreakdown(results.savingsBreakdown)}
            </div>
            
            <div class="roi-chart-container">
                <h4>📊 3-Year ROI Projection</h4>
                ${this.generateROIChart(results)}
            </div>
            
            <div class="implementation-timeline">
                <h4>🚀 Expected Benefits Timeline</h4>
                ${this.generateBenefitsTimeline(results, data)}
            </div>
            
            <div class="roi-recommendations">
                <h4>🎯 AI Recommendations</h4>
                ${this.generateROIRecommendations(results, data)}
            </div>
            
            <div class="roi-actions">
                <button id="download-roi-report" class="btn-secondary">📄 Download Report</button>
                <button id="schedule-roi-consultation" class="btn-primary">📞 Discuss Results</button>
                <button id="refine-calculation" class="btn-outline">⚙️ Refine Calculation</button>
            </div>
        `;
        
        document.getElementById('roi-results').innerHTML = resultsHTML;
        this.bindResultsActions();
    }
    
    generateSavingsBreakdown(breakdown) {
        return Object.entries(breakdown)
            .sort(([,a], [,b]) => b - a)
            .map(([category, savings]) => {
                const percentage = (savings / Object.values(breakdown).reduce((a, b) => a + b, 0)) * 100;
                return `
                    <div class="savings-category">
                        <div class="category-header">
                            <span class="category-name">${this.formatCategoryName(category)}</span>
                            <span class="category-value">$${Math.round(savings).toLocaleString()}</span>
                        </div>
                        <div class="category-bar">
                            <div class="bar-fill" style="width: ${percentage}%"></div>
                        </div>
                    </div>
                `;
            }).join('');
    }
    
    formatCategoryName(category) {
        const nameMap = {
            timeSavings: 'Time Savings',
            errorReduction: 'Error Reduction',
            complianceImprovement: 'Compliance',
            patientExperience: 'Patient Experience',
            dataEfficiency: 'Data Efficiency',
            errorElimination: 'Error Elimination',
            staffProductivity: 'Staff Productivity',
            infrastructureSavings: 'Infrastructure',
            businessContinuity: 'Business Continuity',
            scalability: 'Scalability',
            accessibility: 'Accessibility',
            riskMitigation: 'Risk Mitigation',
            operationalEfficiency: 'Operational Efficiency',
            insuranceSavings: 'Insurance Savings'
        };
        
        return nameMap[category] || category;
    }
    
    generateROIChart(results) {
        const years = [0, 1, 2, 3];
        const cumulativeBenefits = years.map(year => 
            (results.totalAnnualSavings * year) - results.investmentAmount
        );
        
        return `
            <div class="roi-chart">
                <div class="chart-bars">
                    ${years.map((year, index) => {
                        const value = cumulativeBenefits[index];
                        const isPositive = value >= 0;
                        const height = Math.abs(value) / Math.max(...cumulativeBenefits.map(Math.abs)) * 100;
                        
                        return `
                            <div class="chart-bar">
                                <div class="bar ${isPositive ? 'positive' : 'negative'}" 
                                     style="height: ${height}%"
                                     data-value="$${value.toLocaleString()}">
                                </div>
                                <div class="bar-label">Year ${year}</div>
                            </div>
                        `;
                    }).join('')}
                </div>
                <div class="chart-axis">
                    <span>Investment Period</span>
                </div>
            </div>
        `;
    }
    
    generateBenefitsTimeline(results, data) {
        const model = this.roiModels[data.investmentType];
        const timeline = [
            { period: 'Month 1-2', benefits: 'Implementation and setup', percentage: 0 },
            { period: 'Month 3-6', benefits: 'Initial benefits realized', percentage: 25 },
            { period: 'Month 7-12', benefits: 'Full operational benefits', percentage: 75 },
            { period: 'Year 2-3', benefits: 'Optimized performance', percentage: 100 }
        ];
        
        return `
            <div class="benefits-timeline">
                ${timeline.map(item => `
                    <div class="timeline-item">
                        <div class="timeline-period">${item.period}</div>
                        <div class="timeline-bar">
                            <div class="timeline-fill" style="width: ${item.percentage}%"></div>
                        </div>
                        <div class="timeline-benefits">${item.benefits}</div>
                        <div class="timeline-value">
                            $${Math.round(results.totalAnnualSavings * item.percentage / 100).toLocaleString()}
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }
    
    generateROIRecommendations(results, data) {
        const recommendations = [];
        
        if (results.roiPercentage >= 200) {
            recommendations.push({
                icon: '🚀',
                title: 'Excellent Investment Opportunity',
                description: 'This investment shows exceptional ROI potential. Consider prioritizing implementation.'
            });
        } else if (results.roiPercentage >= 100) {
            recommendations.push({
                icon: '✅',
                title: 'Strong Business Case',
                description: 'Solid ROI justifies this investment. Plan for implementation within 6 months.'
            });
        }
        
        if (results.paybackMonths <= 12) {
            recommendations.push({
                icon: '⚡',
                title: 'Quick Payback',
                description: 'Fast payback period makes this a low-risk investment with quick returns.'
            });
        }
        
        if (data.painPoints.includes('security-concerns')) {
            recommendations.push({
                icon: '🛡️',
                title: 'Security Priority',
                description: 'Address security concerns immediately to mitigate risk and ensure compliance.'
            });
        }
        
        return `
            <div class="recommendation-list">
                ${recommendations.map(rec => `
                    <div class="recommendation-item">
                        <div class="rec-icon">${rec.icon}</div>
                        <div class="rec-content">
                            <h5>${rec.title}</h5>
                            <p>${rec.description}</p>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }
    
    bindResultsActions() {
        const downloadBtn = document.getElementById('download-roi-report');
        const consultBtn = document.getElementById('schedule-roi-consultation');
        const refineBtn = document.getElementById('refine-calculation');
        
        if (downloadBtn) {
            downloadBtn.addEventListener('click', () => this.downloadROIReport());
        }
        
        if (consultBtn) {
            consultBtn.addEventListener('click', () => this.scheduleConsultation());
        }
        
        if (refineBtn) {
            refineBtn.addEventListener('click', () => this.refineCalculation());
        }
    }
    
    downloadROIReport() {
        console.log('📄 Generating ROI report...');
        // This would generate a detailed PDF report
    }
    
    scheduleConsultation() {
        console.log('📞 Opening consultation scheduler...');
        // This would open booking system
    }
    
    refineCalculation() {
        // Hide results and return to form
        document.getElementById('roi-results').style.display = 'none';
    }
    
    showCalculationError() {
        const errorHTML = `
            <div class="calculation-error">
                <h4>⚠️ Calculation Error</h4>
                <p>We couldn't complete the ROI calculation. Please check your inputs and try again.</p>
                <button onclick="document.getElementById('roi-results').style.display = 'none'" class="btn-outline">
                    Try Again
                </button>
            </div>
        `;
        
        document.getElementById('roi-results').innerHTML = errorHTML;
    }
    
    openCalculator() {
        document.getElementById('roi-calculator-modal').style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
    
    closeCalculator() {
        document.getElementById('roi-calculator-modal').style.display = 'none';
        document.body.style.overflow = '';
    }
    
    loadCalculatorStyles() {
        if (document.getElementById('roi-calculator-styles')) return;
        
        const styles = `
            <style id="roi-calculator-styles">
                .calculator-modal {
                    max-width: 1000px;
                    width: 95%;
                    max-height: 95vh;
                }
                
                .calculator-content {
                    padding: 30px;
                    max-height: calc(95vh - 200px);
                    overflow-y: auto;
                }
                
                .calculation-modes {
                    margin-bottom: 40px;
                }
                
                .calculation-modes h3 {
                    color: var(--text-color);
                    text-align: center;
                    margin-bottom: 25px;
                }
                
                .mode-cards {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: 20px;
                }
                
                .mode-card {
                    background: var(--card-background);
                    border: 2px solid var(--border-color);
                    border-radius: 12px;
                    padding: 25px;
                    text-align: center;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }
                
                .mode-card.active {
                    border-color: var(--accent-color);
                    background: var(--accent-color-light, rgba(16, 163, 127, 0.1));
                }
                
                .mode-card:hover {
                    transform: translateY(-3px);
                    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
                }
                
                .mode-icon {
                    font-size: 32px;
                    margin-bottom: 15px;
                }
                
                .mode-card h4 {
                    color: var(--text-color);
                    margin: 0 0 10px 0;
                }
                
                .mode-card p {
                    color: var(--text-light);
                    margin: 0;
                    font-size: 14px;
                }
                
                .calculation-section {
                    background: var(--card-background);
                    border: 1px solid var(--border-color);
                    border-radius: 15px;
                    padding: 30px;
                    margin-bottom: 30px;
                }
                
                .calculation-section h3 {
                    color: var(--text-color);
                    margin-bottom: 25px;
                }
                
                .pain-points-section {
                    margin: 25px 0;
                }
                
                .pain-points-section label {
                    font-weight: 600;
                    color: var(--text-color);
                    margin-bottom: 15px;
                    display: block;
                }
                
                .pain-points-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: 10px;
                }
                
                .pain-points-grid label {
                    font-weight: normal;
                    display: flex;
                    align-items: center;
                    padding: 12px;
                    background: var(--background-color);
                    border: 1px solid var(--border-color);
                    border-radius: 8px;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                
                .pain-points-grid label:hover {
                    border-color: var(--accent-color);
                }
                
                .pain-points-grid input {
                    margin-right: 8px;
                }
                
                .calculation-progress {
                    text-align: center;
                    padding: 50px 20px;
                }
                
                .progress-spinner {
                    width: 60px;
                    height: 60px;
                    border: 4px solid var(--border-color);
                    border-top: 4px solid var(--accent-color);
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                    margin: 0 auto 30px;
                }
                
                .calculation-steps {
                    max-width: 300px;
                    margin: 30px auto;
                    text-align: left;
                }
                
                .calc-step {
                    padding: 10px 0;
                    color: var(--text-light);
                    position: relative;
                    padding-left: 30px;
                    transition: color 0.5s;
                }
                
                .calc-step::before {
                    content: '⏳';
                    position: absolute;
                    left: 0;
                    transition: all 0.5s;
                }
                
                .calc-step.active {
                    color: var(--accent-color);
                    font-weight: 600;
                }
                
                .calc-step.active::before {
                    content: '✓';
                    color: var(--accent-color);
                }
                
                .roi-summary {
                    margin: 30px 0;
                }
                
                .roi-cards {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: 20px;
                }
                
                .roi-card {
                    background: var(--card-background);
                    border: 2px solid var(--border-color);
                    border-radius: 12px;
                    padding: 25px;
                    text-align: center;
                    transition: all 0.3s ease;
                }
                
                .roi-card.primary {
                    border-color: var(--accent-color);
                    background: var(--accent-color-light, rgba(16, 163, 127, 0.1));
                }
                
                .roi-card h4 {
                    color: var(--text-light);
                    margin: 0 0 15px 0;
                    font-size: 14px;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }
                
                .roi-value {
                    font-size: 28px;
                    font-weight: bold;
                    color: var(--accent-color);
                    margin-bottom: 8px;
                }
                
                .roi-period {
                    color: var(--text-light);
                    font-size: 12px;
                }
                
                .savings-breakdown {
                    margin: 30px 0;
                    background: var(--background-color);
                    border-radius: 12px;
                    padding: 25px;
                }
                
                .savings-breakdown h4 {
                    color: var(--text-color);
                    margin-bottom: 20px;
                }
                
                .savings-category {
                    margin-bottom: 20px;
                }
                
                .category-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 8px;
                }
                
                .category-name {
                    font-weight: 600;
                    color: var(--text-color);
                }
                
                .category-value {
                    font-weight: bold;
                    color: var(--accent-color);
                }
                
                .category-bar {
                    height: 8px;
                    background: var(--border-color);
                    border-radius: 4px;
                    overflow: hidden;
                }
                
                .bar-fill {
                    height: 100%;
                    background: linear-gradient(90deg, var(--accent-color), var(--accent-hover));
                    transition: width 0.8s ease;
                }
                
                .roi-chart-container {
                    margin: 30px 0;
                    background: var(--card-background);
                    border-radius: 12px;
                    padding: 25px;
                }
                
                .roi-chart {
                    height: 200px;
                    display: flex;
                    align-items: end;
                    justify-content: center;
                    gap: 20px;
                    margin: 20px 0;
                }
                
                .chart-bar {
                    flex: 1;
                    max-width: 60px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                }
                
                .bar {
                    width: 40px;
                    min-height: 20px;
                    margin-bottom: 10px;
                    border-radius: 4px 4px 0 0;
                    position: relative;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }
                
                .bar.positive {
                    background: linear-gradient(180deg, var(--accent-color), var(--accent-hover));
                }
                
                .bar.negative {
                    background: linear-gradient(180deg, #e53e3e, #c53030);
                    transform: scaleY(-1);
                    border-radius: 0 0 4px 4px;
                }
                
                .bar:hover::after {
                    content: attr(data-value);
                    position: absolute;
                    bottom: 100%;
                    left: 50%;
                    transform: translateX(-50%);
                    background: var(--text-color);
                    color: white;
                    padding: 5px 8px;
                    border-radius: 4px;
                    font-size: 12px;
                    white-space: nowrap;
                }
                
                .bar-label {
                    font-size: 12px;
                    color: var(--text-light);
                    text-align: center;
                }
                
                .benefits-timeline {
                    margin: 30px 0;
                    background: var(--background-color);
                    border-radius: 12px;
                    padding: 25px;
                }
                
                .timeline-item {
                    display: grid;
                    grid-template-columns: 100px 1fr 200px 100px;
                    align-items: center;
                    gap: 15px;
                    margin-bottom: 15px;
                }
                
                .timeline-period {
                    font-weight: 600;
                    color: var(--text-color);
                    font-size: 14px;
                }
                
                .timeline-bar {
                    height: 8px;
                    background: var(--border-color);
                    border-radius: 4px;
                    overflow: hidden;
                }
                
                .timeline-fill {
                    height: 100%;
                    background: linear-gradient(90deg, var(--accent-color), var(--accent-hover));
                    transition: width 0.8s ease;
                }
                
                .timeline-benefits {
                    color: var(--text-light);
                    font-size: 13px;
                }
                
                .timeline-value {
                    font-weight: bold;
                    color: var(--accent-color);
                    text-align: right;
                    font-size: 14px;
                }
                
                .roi-recommendations {
                    margin: 30px 0;
                    background: var(--card-background);
                    border-radius: 12px;
                    padding: 25px;
                }
                
                .recommendation-list {
                    display: flex;
                    flex-direction: column;
                    gap: 15px;
                }
                
                .recommendation-item {
                    display: flex;
                    align-items: center;
                    gap: 15px;
                    padding: 15px;
                    background: var(--background-color);
                    border-radius: 8px;
                }
                
                .rec-icon {
                    font-size: 24px;
                    min-width: 40px;
                }
                
                .rec-content h5 {
                    color: var(--text-color);
                    margin: 0 0 5px 0;
                }
                
                .rec-content p {
                    color: var(--text-light);
                    margin: 0;
                    font-size: 14px;
                }
                
                .roi-actions {
                    display: flex;
                    gap: 15px;
                    justify-content: center;
                    margin-top: 30px;
                    padding-top: 25px;
                    border-top: 1px solid var(--border-color);
                }
                
                .validation-errors {
                    background: #fed7d7;
                    color: #c53030;
                    border: 1px solid #feb2b2;
                    border-radius: 8px;
                    padding: 15px;
                    margin-bottom: 20px;
                }
                
                .validation-errors h5 {
                    margin: 0 0 10px 0;
                }
                
                .validation-errors ul {
                    margin: 0;
                    padding-left: 20px;
                }
                
                @media (max-width: 768px) {
                    .roi-cards {
                        grid-template-columns: repeat(2, 1fr);
                    }
                    
                    .timeline-item {
                        grid-template-columns: 1fr;
                        text-align: center;
                        gap: 10px;
                    }
                    
                    .roi-actions {
                        flex-direction: column;
                    }
                    
                    .pain-points-grid {
                        grid-template-columns: 1fr;
                    }
                }
            </style>
        `;
        
        document.head.insertAdjacentHTML('beforeend', styles);
    }
    
    // Public method for external access
    openCalculator() {
        this.showCalculator();
    }
    
    showCalculator() {
        const modal = document.getElementById('roi-calculator-modal');
        if (modal) {
            modal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
            
            // Reset calculator
            this.resetCalculator();
        } else {
            console.log('Creating new ROI calculator modal...');
            this.createCalculator();
        }
    }
    
    resetCalculator() {
        // Reset form and results
        const form = document.getElementById('roi-calculator-form');
        if (form) form.reset();
        
        const results = document.getElementById('roi-results');
        if (results) results.innerHTML = '';
    }
}

// Initialize and make available globally
document.addEventListener('DOMContentLoaded', () => {
    if (typeof AI_CONFIG !== 'undefined' && AI_CONFIG.ENABLE_AI_FEATURES) {
        window.roiCalculator = new ROICalculator();
        console.log('💰 ROI Calculator initialized');
    }
});

window.ROICalculator = ROICalculator;