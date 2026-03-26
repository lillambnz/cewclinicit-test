/**
 * Software Matchmaker - AI-Powered Medical Software Recommendation System
 * Intelligent matching of clinical software to specific practice needs
 */

class SoftwareMatchmaker {
    constructor() {
        this.isEnabled = AI_CONFIG.features['software-matchmaker'];
        this.softwareDatabase = [];
        this.matchResults = [];
        
        if (this.isEnabled) {
            this.init();
        }
    }
    
    init() {
        this.loadSoftwareDatabase();
        this.createMatchmakerInterface();
    }
    
    loadSoftwareDatabase() {
        // Comprehensive Australian clinical software database
        this.softwareDatabase = [
            // Practice Management Systems
            {
                name: 'Best Practice',
                category: 'Practice Management',
                vendor: 'Best Practice Software',
                type: 'Desktop/Cloud',
                pricing: {
                    model: 'License + Annual',
                    range: '$2,000-$5,000 setup + $200-400/month',
                    priceScore: 7
                },
                features: {
                    scheduling: 10,
                    billing: 10,
                    clinical: 9,
                    reporting: 8,
                    integration: 9,
                    mobile: 6,
                    telehealth: 7,
                    compliance: 10
                },
                suitability: {
                    practiceTypes: ['gp', 'specialist', 'multi-disciplinary'],
                    practiceSize: ['small', 'medium', 'large', 'enterprise'],
                    techLevel: ['intermediate', 'advanced']
                },
                pros: [
                    'Market leader in Australia',
                    'Excellent Medicare compliance',
                    'Strong pathology integration',
                    'Comprehensive clinical features',
                    'Active development and support'
                ],
                cons: [
                    'Higher cost than alternatives',
                    'Steep learning curve',
                    'Resource intensive',
                    'Limited customization'
                ],
                australianFeatures: {
                    medicare: true,
                    pbs: true,
                    racgp: true,
                    healthlink: true,
                    myHealthRecord: true
                }
            },
            {
                name: 'Medical Director',
                category: 'Practice Management',
                vendor: 'Telstra Health',
                type: 'Desktop/Cloud',
                pricing: {
                    model: 'Subscription',
                    range: '$150-350/practitioner/month',
                    priceScore: 6
                },
                features: {
                    scheduling: 9,
                    billing: 9,
                    clinical: 8,
                    reporting: 9,
                    integration: 8,
                    mobile: 8,
                    telehealth: 8,
                    compliance: 9
                },
                suitability: {
                    practiceTypes: ['gp', 'specialist'],
                    practiceSize: ['medium', 'large', 'enterprise'],
                    techLevel: ['basic', 'intermediate', 'advanced']
                },
                pros: [
                    'Cloud-first approach',
                    'Strong mobile capabilities',
                    'Good integration ecosystem',
                    'Telstra backing and support',
                    'Regular feature updates'
                ],
                cons: [
                    'Subscription can be expensive',
                    'Internet dependency',
                    'Some advanced features require add-ons',
                    'Migration complexity'
                ]
            },
            {
                name: 'Zedmed',
                category: 'Practice Management',
                vendor: 'Zedmed',
                type: 'Desktop',
                pricing: {
                    model: 'License',
                    range: '$1,500-3,000 + $150-250/month support',
                    priceScore: 8
                },
                features: {
                    scheduling: 8,
                    billing: 8,
                    clinical: 7,
                    reporting: 7,
                    integration: 7,
                    mobile: 5,
                    telehealth: 6,
                    compliance: 8
                },
                suitability: {
                    practiceTypes: ['gp', 'allied-health'],
                    practiceSize: ['small', 'medium'],
                    techLevel: ['basic', 'intermediate']
                },
                pros: [
                    'Cost-effective option',
                    'Simple user interface',
                    'Good for smaller practices',
                    'Local Australian support',
                    'Solid core functionality'
                ],
                cons: [
                    'Limited advanced features',
                    'Desktop-only',
                    'Fewer integrations',
                    'Basic reporting capabilities'
                ]
            },
            // Telehealth Solutions
            {
                name: 'Coviu',
                category: 'Telehealth',
                vendor: 'Coviu',
                type: 'Cloud',
                pricing: {
                    model: 'Per consultation',
                    range: '$0.50-2.00 per consultation',
                    priceScore: 9
                },
                features: {
                    videoQuality: 9,
                    scheduling: 8,
                    integration: 8,
                    recording: 7,
                    mobile: 9,
                    security: 9,
                    whiteboard: 8,
                    fileSharing: 8
                },
                suitability: {
                    practiceTypes: ['gp', 'specialist', 'mental-health', 'allied-health'],
                    practiceSize: ['small', 'medium', 'large'],
                    techLevel: ['basic', 'intermediate']
                },
                pros: [
                    'Australian-made solution',
                    'Excellent video quality',
                    'Strong security features',
                    'Easy to use',
                    'Good PMS integrations'
                ],
                cons: [
                    'Per-consultation pricing can add up',
                    'Limited advanced features',
                    'Requires good internet connection'
                ]
            },
            // Specialized Systems
            {
                name: 'Dental4Windows',
                category: 'Dental Practice Management',
                vendor: 'Dental4Windows',
                type: 'Desktop/Cloud',
                pricing: {
                    model: 'License + Support',
                    range: '$3,000-6,000 + $200-400/month',
                    priceScore: 6
                },
                features: {
                    scheduling: 9,
                    billing: 9,
                    clinical: 10,
                    imaging: 10,
                    treatment: 10,
                    inventory: 8,
                    reporting: 8,
                    compliance: 9
                },
                suitability: {
                    practiceTypes: ['dental'],
                    practiceSize: ['small', 'medium', 'large'],
                    techLevel: ['intermediate', 'advanced']
                },
                pros: [
                    'Dental-specific features',
                    'Excellent imaging integration',
                    'Comprehensive treatment planning',
                    'Strong Australian market presence'
                ],
                cons: [
                    'Dental-only (not versatile)',
                    'Higher learning curve',
                    'Expensive for small practices'
                ]
            }
        ];
    }
    
    createMatchmakerInterface() {
        const matchmakerHTML = `
            <div id="software-matchmaker-modal" class="ai-modal">
                <div class="modal-content matchmaker-modal">
                    <div class="modal-header">
                        <h2>🔍 Software Matchmaker</h2>
                        <p>AI-powered software recommendations tailored to your practice</p>
                        <button id="close-matchmaker" class="modal-close">×</button>
                    </div>
                    
                    <div class="matchmaker-content">
                        <!-- Quick Match Section -->
                        <div class="quick-match-section">
                            <h3>Quick Match</h3>
                            <p>Answer a few questions to get instant AI recommendations</p>
                            
                            <div class="quick-match-form">
                                <div class="form-row">
                                    <div class="form-group">
                                        <label>Practice Type</label>
                                        <select id="mm-practice-type">
                                            <option value="">Select type</option>
                                            <option value="gp">General Practice</option>
                                            <option value="specialist">Specialist</option>
                                            <option value="dental">Dental</option>
                                            <option value="mental-health">Mental Health</option>
                                            <option value="allied-health">Allied Health</option>
                                            <option value="multi-disciplinary">Multi-disciplinary</option>
                                        </select>
                                    </div>
                                    
                                    <div class="form-group">
                                        <label>Practice Size</label>
                                        <select id="mm-practice-size">
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
                                        <label>Budget Range (Monthly)</label>
                                        <select id="mm-budget">
                                            <option value="">Select budget</option>
                                            <option value="low">Under $500/month</option>
                                            <option value="medium">$500-2,000/month</option>
                                            <option value="high">$2,000-5,000/month</option>
                                            <option value="enterprise">$5,000+/month</option>
                                        </select>
                                    </div>
                                    
                                    <div class="form-group">
                                        <label>Priority Feature</label>
                                        <select id="mm-priority">
                                            <option value="">Select priority</option>
                                            <option value="ease-of-use">Ease of use</option>
                                            <option value="cost">Cost effectiveness</option>
                                            <option value="features">Advanced features</option>
                                            <option value="integration">Integration capabilities</option>
                                            <option value="mobile">Mobile access</option>
                                            <option value="telehealth">Telehealth support</option>
                                        </select>
                                    </div>
                                </div>
                                
                                <div class="must-have-features">
                                    <label>Must-have features (check all that apply):</label>
                                    <div class="feature-checkboxes">
                                        <label><input type="checkbox" value="medicare"> Medicare integration</label>
                                        <label><input type="checkbox" value="pathology"> Pathology integration</label>
                                        <label><input type="checkbox" value="telehealth"> Telehealth</label>
                                        <label><input type="checkbox" value="mobile"> Mobile app</label>
                                        <label><input type="checkbox" value="cloud"> Cloud-based</label>
                                        <label><input type="checkbox" value="reporting"> Advanced reporting</label>
                                        <label><input type="checkbox" value="billing"> Integrated billing</label>
                                        <label><input type="checkbox" value="inventory"> Inventory management</label>
                                    </div>
                                </div>
                                
                                <button id="find-matches" class="btn-primary btn-large">
                                    🔍 Find Perfect Matches
                                </button>
                            </div>
                        </div>
                        
                        <!-- Results Section -->
                        <div id="match-results" class="match-results-section" style="display: none;">
                            <div class="results-header">
                                <h3>🎯 Your Perfect Matches</h3>
                                <p>AI-ranked software recommendations based on your criteria</p>
                            </div>
                            
                            <div id="results-container">
                                <!-- Results will be populated here -->
                            </div>
                            
                            <div class="results-actions">
                                <button id="get-detailed-comparison" class="btn-secondary">
                                    📊 Get Detailed Comparison Report
                                </button>
                                <button id="book-demo" class="btn-primary">
                                    🎥 Book Software Demo
                                </button>
                            </div>
                        </div>
                        
                        <!-- Browse All Section -->
                        <div class="browse-section">
                            <h3>Browse by Category</h3>
                            <div class="category-grid">
                                <div class="category-card" data-category="practice-management">
                                    <div class="category-icon">🏥</div>
                                    <h4>Practice Management</h4>
                                    <p>Complete practice solutions</p>
                                </div>
                                <div class="category-card" data-category="telehealth">
                                    <div class="category-icon">💻</div>
                                    <h4>Telehealth</h4>
                                    <p>Video consultation platforms</p>
                                </div>
                                <div class="category-card" data-category="billing">
                                    <div class="category-icon">💰</div>
                                    <h4>Billing & Claims</h4>
                                    <p>Revenue cycle management</p>
                                </div>
                                <div class="category-card" data-category="clinical">
                                    <div class="category-icon">📋</div>
                                    <h4>Clinical Tools</h4>
                                    <p>Decision support & notes</p>
                                </div>
                                <div class="category-card" data-category="integration">
                                    <div class="category-icon">🔗</div>
                                    <h4>Integration</h4>
                                    <p>Connect your systems</p>
                                </div>
                                <div class="category-card" data-category="analytics">
                                    <div class="category-icon">📈</div>
                                    <h4>Analytics</h4>
                                    <p>Practice intelligence</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', matchmakerHTML);
        this.bindMatchmakerEvents();
        this.loadMatchmakerStyles();
    }
    
    bindMatchmakerEvents() {
        const closeBtn = document.getElementById('close-matchmaker');
        const findBtn = document.getElementById('find-matches');
        
        closeBtn.addEventListener('click', () => this.closeMatchmaker());
        findBtn.addEventListener('click', () => this.findMatches());
        
        // Category browsing
        document.querySelectorAll('.category-card').forEach(card => {
            card.addEventListener('click', () => {
                const category = card.getAttribute('data-category');
                this.browseCategory(category);
            });
        });
    }
    
    async findMatches() {
        const criteria = this.collectMatchCriteria();
        
        if (!this.validateCriteria(criteria)) {
            return;
        }
        
        // Show loading state
        this.showMatchingProgress();
        
        // Simulate AI analysis
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Calculate matches
        const matches = this.calculateMatches(criteria);
        
        // Display results
        this.displayMatches(matches, criteria);
    }
    
    collectMatchCriteria() {
        const mustHaveFeatures = Array.from(document.querySelectorAll('.feature-checkboxes input:checked'))
            .map(cb => cb.value);
            
        return {
            practiceType: document.getElementById('mm-practice-type').value,
            practiceSize: document.getElementById('mm-practice-size').value,
            budget: document.getElementById('mm-budget').value,
            priority: document.getElementById('mm-priority').value,
            mustHave: mustHaveFeatures
        };
    }
    
    validateCriteria(criteria) {
        if (!criteria.practiceType || !criteria.practiceSize || !criteria.budget) {
            this.showError('Please complete all required fields');
            return false;
        }
        return true;
    }
    
    showError(message) {
        const errorEl = document.createElement('div');
        errorEl.className = 'validation-error';
        errorEl.textContent = message;
        errorEl.style.cssText = 'color: #e53e3e; background: #fed7d7; padding: 15px; border-radius: 8px; margin: 15px 0;';
        
        const form = document.querySelector('.quick-match-form');
        form.appendChild(errorEl);
        
        setTimeout(() => errorEl.remove(), 5000);
    }
    
    showMatchingProgress() {
        const progressHTML = `
            <div class="matching-progress">
                <div class="progress-animation">
                    <div class="loading-spinner"></div>
                    <h4>🤖 AI is finding your perfect matches...</h4>
                    <div class="progress-steps">
                        <div class="progress-step active">Analyzing your requirements</div>
                        <div class="progress-step">Scanning software database</div>
                        <div class="progress-step">Calculating compatibility scores</div>
                        <div class="progress-step">Ranking recommendations</div>
                    </div>
                </div>
            </div>
        `;
        
        const resultsSection = document.getElementById('match-results');
        resultsSection.innerHTML = progressHTML;
        resultsSection.style.display = 'block';
        
        // Animate progress steps
        setTimeout(() => {
            const steps = document.querySelectorAll('.progress-step');
            steps.forEach((step, index) => {
                setTimeout(() => {
                    step.classList.add('active');
                }, (index + 1) * 500);
            });
        }, 100);
    }
    
    calculateMatches(criteria) {
        const scored = this.softwareDatabase.map(software => {
            let score = 0;
            let reasons = [];
            let concerns = [];
            
            // Practice type compatibility
            if (software.suitability.practiceTypes.includes(criteria.practiceType)) {
                score += 25;
                reasons.push(`Perfect fit for ${criteria.practiceType} practices`);
            } else {
                score -= 10;
                concerns.push('May not be optimized for your practice type');
            }
            
            // Practice size compatibility
            const sizeMap = { small: 'small', medium: 'medium', large: 'large', enterprise: 'enterprise' };
            if (software.suitability.practiceSize.includes(sizeMap[criteria.practiceSize])) {
                score += 20;
                reasons.push(`Scales well for ${criteria.practiceSize} practices`);
            } else {
                score -= 5;
                concerns.push('May not scale appropriately for your practice size');
            }
            
            // Budget compatibility
            const budgetScore = this.calculateBudgetScore(software.pricing.priceScore, criteria.budget);
            score += budgetScore.score;
            if (budgetScore.reason) reasons.push(budgetScore.reason);
            if (budgetScore.concern) concerns.push(budgetScore.concern);
            
            // Priority feature scoring
            if (criteria.priority) {
                const priorityScore = this.calculatePriorityScore(software, criteria.priority);
                score += priorityScore.score;
                if (priorityScore.reason) reasons.push(priorityScore.reason);
            }
            
            // Must-have features
            criteria.mustHave.forEach(feature => {
                const hasFeature = this.softwareHasFeature(software, feature);
                if (hasFeature) {
                    score += 10;
                    reasons.push(`✓ Has required ${feature} feature`);
                } else {
                    score -= 15;
                    concerns.push(`✗ Missing required ${feature} feature`);
                }
            });
            
            // Australian compliance bonus
            if (software.australianFeatures) {
                score += 5;
                reasons.push('Excellent Australian compliance features');
            }
            
            return {
                ...software,
                matchScore: Math.max(0, Math.min(100, score)),
                matchReasons: reasons,
                matchConcerns: concerns
            };
        });
        
        return scored
            .sort((a, b) => b.matchScore - a.matchScore)
            .slice(0, 5); // Top 5 matches
    }
    
    calculateBudgetScore(priceScore, budget) {
        const budgetMap = {
            'low': { min: 8, max: 10 },
            'medium': { min: 6, max: 9 },
            'high': { min: 4, max: 8 },
            'enterprise': { min: 1, max: 10 }
        };
        
        const range = budgetMap[budget];
        if (!range) return { score: 0 };
        
        if (priceScore >= range.min && priceScore <= range.max) {
            return {
                score: 15,
                reason: 'Price point fits your budget perfectly'
            };
        } else if (priceScore < range.min) {
            return {
                score: 5,
                concern: 'May be more expensive than your budget allows'
            };
        } else {
            return {
                score: 10,
                reason: 'Cost-effective option for your budget'
            };
        }
    }
    
    calculatePriorityScore(software, priority) {
        const priorityMap = {
            'ease-of-use': () => software.suitability.techLevel.includes('basic') ? 15 : 5,
            'cost': () => software.pricing.priceScore >= 7 ? 15 : 5,
            'features': () => Object.values(software.features).reduce((a, b) => a + b, 0) > 60 ? 15 : 5,
            'integration': () => software.features.integration >= 8 ? 15 : 5,
            'mobile': () => software.features.mobile >= 7 ? 15 : 5,
            'telehealth': () => software.features.telehealth >= 7 ? 15 : 5
        };
        
        const scoreFunc = priorityMap[priority];
        if (!scoreFunc) return { score: 0 };
        
        const score = scoreFunc();
        return {
            score,
            reason: score >= 15 ? `Excellent ${priority.replace('-', ' ')} capabilities` : null
        };
    }
    
    softwareHasFeature(software, feature) {
        const featureMap = {
            'medicare': () => software.australianFeatures?.medicare,
            'pathology': () => software.features.integration >= 7,
            'telehealth': () => software.features.telehealth >= 6,
            'mobile': () => software.features.mobile >= 6,
            'cloud': () => software.type.includes('Cloud'),
            'reporting': () => software.features.reporting >= 7,
            'billing': () => software.features.billing >= 7,
            'inventory': () => software.features.inventory >= 6
        };
        
        const checkFunc = featureMap[feature];
        return checkFunc ? checkFunc() : false;
    }
    
    displayMatches(matches, criteria) {
        const resultsHTML = `
            <div class="results-header">
                <h3>🎯 Your Perfect Matches</h3>
                <p>Found ${matches.length} software solutions ranked by AI compatibility</p>
            </div>
            
            <div class="match-cards">
                ${matches.map((match, index) => this.generateMatchCard(match, index + 1)).join('')}
            </div>
            
            <div class="results-summary">
                <h4>💡 AI Recommendations Summary</h4>
                <div class="summary-insights">
                    ${this.generateSummaryInsights(matches, criteria)}
                </div>
            </div>
            
            <div class="results-actions">
                <button id="get-detailed-comparison" class="btn-secondary">
                    📊 Get Detailed Comparison Report
                </button>
                <button id="book-consultation" class="btn-primary">
                    📞 Book Free Consultation
                </button>
                <button id="start-new-search" class="btn-outline">
                    🔍 Start New Search
                </button>
            </div>
        `;
        
        document.getElementById('match-results').innerHTML = resultsHTML;
        this.bindResultsActions();
    }
    
    generateMatchCard(match, rank) {
        const matchClass = match.matchScore >= 80 ? 'excellent-match' : 
                          match.matchScore >= 60 ? 'good-match' : 'fair-match';
        
        return `
            <div class="match-card ${matchClass}">
                <div class="match-header">
                    <div class="match-rank">#${rank}</div>
                    <div class="match-info">
                        <h4>${match.name}</h4>
                        <p>${match.vendor} • ${match.type}</p>
                    </div>
                    <div class="match-score">
                        <div class="score-circle">
                            <span class="score-number">${match.matchScore}</span>
                            <span class="score-percent">%</span>
                        </div>
                        <div class="score-label">Match Score</div>
                    </div>
                </div>
                
                <div class="match-pricing">
                    <span class="price-range">${match.pricing.range}</span>
                    <span class="price-model">${match.pricing.model}</span>
                </div>
                
                <div class="match-features">
                    <h5>Key Strengths:</h5>
                    <div class="feature-bars">
                        ${this.generateFeatureBars(match.features)}
                    </div>
                </div>
                
                <div class="match-reasons">
                    <div class="reasons-section">
                        <h5>✅ Why it's a great fit:</h5>
                        <ul class="reasons-list">
                            ${match.matchReasons.slice(0, 3).map(reason => `<li>${reason}</li>`).join('')}
                        </ul>
                    </div>
                    
                    ${match.matchConcerns.length > 0 ? `
                        <div class="concerns-section">
                            <h5>⚠️ Consider:</h5>
                            <ul class="concerns-list">
                                ${match.matchConcerns.slice(0, 2).map(concern => `<li>${concern}</li>`).join('')}
                            </ul>
                        </div>
                    ` : ''}
                </div>
                
                <div class="match-actions">
                    <button class="btn-outline btn-small" onclick="window.softwareMatchmaker.viewDetails('${match.name}')">
                        View Details
                    </button>
                    <button class="btn-primary btn-small" onclick="window.softwareMatchmaker.requestDemo('${match.name}')">
                        Request Demo
                    </button>
                </div>
            </div>
        `;
    }
    
    generateFeatureBars(features) {
        const topFeatures = Object.entries(features)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 4);
            
        return topFeatures.map(([feature, score]) => `
            <div class="feature-bar">
                <div class="feature-name">${feature.charAt(0).toUpperCase() + feature.slice(1)}</div>
                <div class="feature-score-bar">
                    <div class="score-fill" style="width: ${score * 10}%"></div>
                    <span class="score-text">${score}/10</span>
                </div>
            </div>
        `).join('');
    }
    
    generateSummaryInsights(matches, criteria) {
        const insights = [];
        
        if (matches[0].matchScore >= 80) {
            insights.push(`🎯 Found ${matches.filter(m => m.matchScore >= 80).length} excellent match(es) for your requirements`);
        }
        
        const avgScore = matches.reduce((sum, m) => sum + m.matchScore, 0) / matches.length;
        if (avgScore >= 70) {
            insights.push(`✨ High compatibility across recommendations (average ${avgScore.toFixed(0)}% match)`);
        }
        
        // Budget insights
        const budgetFriendly = matches.filter(m => m.pricing.priceScore >= 7);
        if (budgetFriendly.length >= 2) {
            insights.push(`💰 Multiple cost-effective options available within your budget`);
        }
        
        // Australian compliance
        const compliant = matches.filter(m => m.australianFeatures?.medicare);
        if (compliant.length >= 3) {
            insights.push(`🇦🇺 All top recommendations include excellent Australian compliance features`);
        }
        
        return insights.map(insight => `<p>${insight}</p>`).join('');
    }
    
    bindResultsActions() {
        const detailedBtn = document.getElementById('get-detailed-comparison');
        const consultBtn = document.getElementById('book-consultation');
        const newSearchBtn = document.getElementById('start-new-search');
        
        if (detailedBtn) {
            detailedBtn.addEventListener('click', () => this.generateDetailedReport());
        }
        
        if (consultBtn) {
            consultBtn.addEventListener('click', () => this.bookConsultation());
        }
        
        if (newSearchBtn) {
            newSearchBtn.addEventListener('click', () => this.resetMatchmaker());
        }
    }
    
    viewDetails(softwareName) {
        const software = this.softwareDatabase.find(s => s.name === softwareName);
        if (software) {
            this.showSoftwareDetails(software);
        }
    }
    
    requestDemo(softwareName) {
        console.log(`🎥 Requesting demo for ${softwareName}`);
        // This would integrate with booking system
    }
    
    generateDetailedReport() {
        console.log('📊 Generating detailed comparison report...');
        // This would generate a comprehensive PDF comparison
    }
    
    bookConsultation() {
        console.log('📞 Opening consultation booking...');
        // This would open booking system
    }
    
    resetMatchmaker() {
        // Reset form
        document.getElementById('mm-practice-type').value = '';
        document.getElementById('mm-practice-size').value = '';
        document.getElementById('mm-budget').value = '';
        document.getElementById('mm-priority').value = '';
        document.querySelectorAll('.feature-checkboxes input').forEach(cb => cb.checked = false);
        
        // Hide results
        document.getElementById('match-results').style.display = 'none';
    }
    
    browseCategory(category) {
        const categoryData = this.softwareDatabase.filter(s => 
            s.category.toLowerCase().includes(category.replace('-', ' '))
        );
        
        this.displayCategoryBrowse(category, categoryData);
    }
    
    displayCategoryBrowse(category, software) {
        // Implementation for category browsing
        console.log(`Browsing ${category} category with ${software.length} options`);
    }
    
    openMatchmaker() {
        document.getElementById('software-matchmaker-modal').style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
    
    closeMatchmaker() {
        document.getElementById('software-matchmaker-modal').style.display = 'none';
        document.body.style.overflow = '';
    }
    
    loadMatchmakerStyles() {
        if (document.getElementById('matchmaker-styles')) return;
        
        const styles = `
            <style id="matchmaker-styles">
                .matchmaker-modal {
                    max-width: 1200px;
                    width: 95%;
                    max-height: 95vh;
                }
                
                .matchmaker-content {
                    padding: 30px;
                    max-height: calc(95vh - 200px);
                    overflow-y: auto;
                }
                
                .quick-match-section {
                    background: var(--card-background);
                    border: 2px solid var(--border-color);
                    border-radius: 15px;
                    padding: 30px;
                    margin-bottom: 40px;
                }
                
                .quick-match-section h3 {
                    color: var(--text-color);
                    margin-bottom: 10px;
                    font-size: 24px;
                }
                
                .quick-match-form {
                    margin-top: 25px;
                }
                
                .form-row {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 20px;
                    margin-bottom: 20px;
                }
                
                .must-have-features {
                    margin: 25px 0;
                }
                
                .must-have-features label {
                    font-weight: 600;
                    color: var(--text-color);
                    margin-bottom: 15px;
                    display: block;
                }
                
                .feature-checkboxes {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: 10px;
                }
                
                .feature-checkboxes label {
                    font-weight: normal;
                    display: flex;
                    align-items: center;
                    padding: 10px;
                    background: var(--background-color);
                    border: 1px solid var(--border-color);
                    border-radius: 8px;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                
                .feature-checkboxes label:hover {
                    border-color: var(--accent-color);
                    background: var(--accent-color-light, rgba(16, 163, 127, 0.1));
                }
                
                .feature-checkboxes input {
                    margin-right: 8px;
                }
                
                .btn-large {
                    padding: 15px 30px;
                    font-size: 16px;
                    font-weight: 600;
                    width: 100%;
                    margin-top: 20px;
                }
                
                .matching-progress {
                    text-align: center;
                    padding: 50px 20px;
                }
                
                .progress-steps {
                    margin-top: 30px;
                    text-align: left;
                    max-width: 300px;
                    margin-left: auto;
                    margin-right: auto;
                }
                
                .progress-step {
                    padding: 8px 0;
                    color: var(--text-light);
                    transition: color 0.5s;
                    position: relative;
                    padding-left: 25px;
                }
                
                .progress-step::before {
                    content: '⏳';
                    position: absolute;
                    left: 0;
                    transition: all 0.5s;
                }
                
                .progress-step.active {
                    color: var(--accent-color);
                    font-weight: 600;
                }
                
                .progress-step.active::before {
                    content: '✓';
                    color: var(--accent-color);
                }
                
                .match-cards {
                    display: flex;
                    flex-direction: column;
                    gap: 25px;
                    margin: 30px 0;
                }
                
                .match-card {
                    background: var(--card-background);
                    border: 2px solid var(--border-color);
                    border-radius: 15px;
                    padding: 25px;
                    transition: all 0.3s ease;
                }
                
                .match-card.excellent-match {
                    border-color: #22c55e;
                    background: linear-gradient(135deg, var(--card-background) 0%, rgba(34, 197, 94, 0.05) 100%);
                }
                
                .match-card.good-match {
                    border-color: #3b82f6;
                    background: linear-gradient(135deg, var(--card-background) 0%, rgba(59, 130, 246, 0.05) 100%);
                }
                
                .match-card:hover {
                    transform: translateY(-3px);
                    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
                }
                
                .match-header {
                    display: flex;
                    align-items: center;
                    margin-bottom: 20px;
                }
                
                .match-rank {
                    background: var(--accent-color);
                    color: white;
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: bold;
                    font-size: 18px;
                    margin-right: 15px;
                }
                
                .match-info {
                    flex: 1;
                }
                
                .match-info h4 {
                    margin: 0 0 5px 0;
                    color: var(--text-color);
                    font-size: 20px;
                }
                
                .match-info p {
                    margin: 0;
                    color: var(--text-light);
                }
                
                .match-score {
                    text-align: center;
                }
                
                .score-circle {
                    width: 60px;
                    height: 60px;
                    border-radius: 50%;
                    background: conic-gradient(var(--accent-color) var(--score-angle, 0deg), var(--border-color) 0deg);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    position: relative;
                    margin-bottom: 5px;
                }
                
                .score-circle::after {
                    content: '';
                    position: absolute;
                    width: 45px;
                    height: 45px;
                    background: var(--card-background);
                    border-radius: 50%;
                }
                
                .score-number {
                    position: relative;
                    z-index: 1;
                    font-weight: bold;
                    font-size: 16px;
                    color: var(--text-color);
                }
                
                .score-percent {
                    position: relative;
                    z-index: 1;
                    font-size: 10px;
                    color: var(--text-light);
                }
                
                .score-label {
                    font-size: 12px;
                    color: var(--text-light);
                }
                
                .match-pricing {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 15px;
                    background: var(--background-color);
                    border-radius: 8px;
                    margin-bottom: 20px;
                }
                
                .price-range {
                    font-weight: 600;
                    color: var(--accent-color);
                }
                
                .price-model {
                    font-size: 14px;
                    color: var(--text-light);
                }
                
                .feature-bars {
                    display: grid;
                    gap: 10px;
                    margin-top: 10px;
                }
                
                .feature-bar {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }
                
                .feature-name {
                    width: 80px;
                    font-size: 12px;
                    color: var(--text-light);
                }
                
                .feature-score-bar {
                    flex: 1;
                    height: 6px;
                    background: var(--border-color);
                    border-radius: 3px;
                    position: relative;
                    overflow: hidden;
                }
                
                .score-fill {
                    height: 100%;
                    background: linear-gradient(90deg, var(--accent-color), var(--accent-hover));
                    transition: width 0.5s ease;
                }
                
                .score-text {
                    font-size: 11px;
                    color: var(--text-light);
                    min-width: 30px;
                }
                
                .match-reasons {
                    margin: 20px 0;
                }
                
                .reasons-section, .concerns-section {
                    margin-bottom: 15px;
                }
                
                .reasons-section h5, .concerns-section h5 {
                    margin: 0 0 8px 0;
                    font-size: 14px;
                    color: var(--text-color);
                }
                
                .reasons-list, .concerns-list {
                    margin: 0;
                    padding-left: 20px;
                    font-size: 13px;
                    color: var(--text-light);
                }
                
                .reasons-list li {
                    color: #22c55e;
                    margin-bottom: 3px;
                }
                
                .concerns-list li {
                    color: #f59e0b;
                    margin-bottom: 3px;
                }
                
                .match-actions {
                    display: flex;
                    gap: 10px;
                    justify-content: flex-end;
                    margin-top: 20px;
                    padding-top: 20px;
                    border-top: 1px solid var(--border-color);
                }
                
                .btn-small {
                    padding: 8px 16px;
                    font-size: 14px;
                }
                
                .results-summary {
                    background: var(--background-color);
                    border: 1px solid var(--border-color);
                    border-radius: 12px;
                    padding: 25px;
                    margin: 30px 0;
                }
                
                .summary-insights p {
                    margin: 10px 0;
                    color: var(--text-color);
                }
                
                .results-actions {
                    display: flex;
                    gap: 15px;
                    justify-content: center;
                    margin-top: 30px;
                }
                
                .browse-section {
                    margin-top: 50px;
                }
                
                .browse-section h3 {
                    color: var(--text-color);
                    margin-bottom: 25px;
                    text-align: center;
                }
                
                .category-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
                    gap: 20px;
                }
                
                .category-card {
                    background: var(--card-background);
                    border: 2px solid var(--border-color);
                    border-radius: 12px;
                    padding: 25px;
                    text-align: center;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }
                
                .category-card:hover {
                    border-color: var(--accent-color);
                    transform: translateY(-3px);
                    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
                }
                
                .category-icon {
                    font-size: 32px;
                    margin-bottom: 15px;
                }
                
                .category-card h4 {
                    color: var(--text-color);
                    margin: 0 0 8px 0;
                    font-size: 16px;
                }
                
                .category-card p {
                    color: var(--text-light);
                    margin: 0;
                    font-size: 13px;
                }
                
                @media (max-width: 768px) {
                    .form-row {
                        grid-template-columns: 1fr;
                    }
                    
                    .match-header {
                        flex-direction: column;
                        text-align: center;
                        gap: 15px;
                    }
                    
                    .match-actions {
                        justify-content: center;
                    }
                    
                    .results-actions {
                        flex-direction: column;
                    }
                    
                    .feature-checkboxes {
                        grid-template-columns: 1fr;
                    }
                }
            </style>
        `;
        
        document.head.insertAdjacentHTML('beforeend', styles);
    }
    
    // Public method for external access
    openMatchmaker() {
        this.showMatchmaker();
    }
    
    showMatchmaker() {
        const modal = document.getElementById('software-matchmaker-modal');
        if (modal) {
            modal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
            
            // Reset to initial state
            this.currentStep = 1;
            this.showStep(1);
        } else {
            console.log('Creating new software matchmaker modal...');
            this.createMatchmaker();
        }
    }
}

// Initialize and make available globally
document.addEventListener('DOMContentLoaded', () => {
    if (typeof AI_CONFIG !== 'undefined' && AI_CONFIG.ENABLE_AI_FEATURES) {
        window.softwareMatchmaker = new SoftwareMatchmaker();
        console.log('🔍 Software Matchmaker initialized');
    }
});

window.SoftwareMatchmaker = SoftwareMatchmaker;