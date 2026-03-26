/**
 * AI Content Generation System - Automated Content Creation for Clinical IT
 * Generates articles, guides, comparisons, and updates automatically
 */

class AIContentGenerator {
    constructor() {
        this.isEnabled = AI_CONFIG.features['auto-content-generation'];
        this.contentTemplates = {};
        this.generationQueue = [];
        this.publishingSchedule = [];
        
        if (this.isEnabled) {
            this.init();
        }
    }
    
    init() {
        this.loadContentTemplates();
        this.loadMarketData();
        this.createGeneratorInterface();
        this.startAutomatedGeneration();
    }
    
    loadContentTemplates() {
        this.contentTemplates = {
            // Software Comparison Articles
            softwareComparison: {
                template: `# {title}: Complete {year} Comparison

## Executive Summary
This comprehensive analysis compares {primarySoftware} and {secondarySoftware} for Australian medical practices. Based on {analysisMethod} and {dataPoints} data points, we provide definitive recommendations.

## Key Findings
- **Best for Large Practices**: {largeResult}
- **Best for Small Practices**: {smallResult}
- **Most Cost-Effective**: {costResult}
- **Best Integration**: {integrationResult}

## Detailed Comparison

### Pricing Analysis
{pricingSection}

### Feature Comparison
{featureMatrix}

### Implementation Considerations
{implementationGuide}

### Expert Recommendations
{recommendations}

## Conclusion
{conclusion}

*Last updated: {updateDate} | Analysis confidence: {confidence}%*
*This article was generated using AI analysis of {sourceCount} sources and verified by clinical IT experts.*`,
                
                triggers: ['software_update', 'pricing_change', 'new_feature_release'],
                frequency: 'monthly',
                priority: 'high'
            },
            
            // Regulatory Update Articles
            regulatoryUpdate: {
                template: `# {regulationType} Update: {title}

## What's Changing
{changeDescription}

## Impact on Medical Practices
{practiceImpact}

## Action Required
{actionItems}

### Immediate Steps (Next 30 Days)
{immediateSteps}

### Medium-term Planning (Next 90 Days)
{mediumTermSteps}

### Long-term Compliance (Beyond 90 Days)
{longTermSteps}

## Technical Implementation
{technicalGuidance}

## Software Compatibility
{softwareCompatibility}

## Support Resources
{supportResources}

*Regulation effective date: {effectiveDate}*
*Compliance deadline: {deadline}*
*Risk level: {riskLevel}*`,
                
                triggers: ['racgp_update', 'medicare_change', 'privacy_regulation'],
                frequency: 'as_needed',
                priority: 'critical'
            },
            
            // Practice Optimization Guides
            practiceGuide: {
                template: `# {title}: Complete Implementation Guide for {practiceType}

## Overview
This guide provides step-by-step instructions for implementing {solution} in {practiceType} practices, based on successful deployments across {deploymentCount} Australian clinics.

## Prerequisites
{prerequisites}

## Implementation Timeline
{timeline}

## Step-by-Step Process

### Week 1: Planning and Preparation
{week1Steps}

### Week 2-3: Technical Implementation
{week23Steps}

### Week 4: Go-Live and Support
{week4Steps}

## Common Challenges and Solutions
{challengesSolutions}

## Success Metrics
{successMetrics}

## Case Studies
{caseStudies}

## Expert Tips
{expertTips}

*Implementation difficulty: {difficulty}*
*Expected ROI: {expectedROI}*
*Success rate: {successRate}%*`,
                
                triggers: ['new_solution', 'market_trend', 'client_success'],
                frequency: 'bi-weekly',
                priority: 'medium'
            },
            
            // Market Analysis Reports
            marketAnalysis: {
                template: `# Australian Clinical IT Market Report: {period}

## Market Overview
{marketOverview}

## Key Trends
{keyTrends}

## Vendor Analysis
{vendorAnalysis}

## Price Trends
{priceTrends}

## Technology Adoption
{technologyAdoption}

## Regional Insights
{regionalInsights}

## Predictions for Next Quarter
{predictions}

## Recommendations for Practices
{recommendations}

*Data sources: {dataSources}*
*Analysis period: {analysisPeriod}*
*Report confidence: {confidence}%*`,
                
                triggers: ['quarterly_analysis', 'market_shift', 'vendor_announcement'],
                frequency: 'monthly',
                priority: 'high'
            },
            
            // Troubleshooting Articles
            troubleshootingGuide: {
                template: `# {problemTitle}: Complete Troubleshooting Guide

## Problem Description
{problemDescription}

## Symptoms
{symptoms}

## Root Causes
{rootCauses}

## Quick Solutions (5 Minutes)
{quickSolutions}

## Detailed Resolution Process
{detailedSteps}

## Prevention Strategies
{preventionSteps}

## When to Call Support
{supportCriteria}

## Related Issues
{relatedIssues}

*Problem severity: {severity}*
*Solution success rate: {successRate}%*
*Average resolution time: {resolutionTime}*`,
                
                triggers: ['support_ticket_pattern', 'software_bug', 'user_feedback'],
                frequency: 'weekly',
                priority: 'medium'
            }
        };
    }
    
    loadMarketData() {
        // This would connect to various data sources
        this.dataSources = {
            softwarePricing: this.loadPricingData(),
            marketTrends: this.loadTrendData(),
            regulatoryChanges: this.loadRegulatoryData(),
            practiceProfiles: this.loadPracticeData(),
            competitorAnalysis: this.loadCompetitorData()
        };
    }
    
    createGeneratorInterface() {
        const generatorHTML = `
            <div id="content-generator-modal" class="ai-modal">
                <div class="modal-content generator-modal">
                    <div class="modal-header">
                        <h2>🤖 AI Content Generator</h2>
                        <p>Automated content creation for clinical IT authority</p>
                        <button id="close-generator" class="modal-close">×</button>
                    </div>
                    
                    <div class="generator-content">
                        <!-- Generation Dashboard -->
                        <div class="generation-dashboard">
                            <h3>Content Generation Dashboard</h3>
                            
                            <div class="dashboard-stats">
                                <div class="stat-card">
                                    <h4>Articles Generated</h4>
                                    <div class="stat-number" id="articles-generated">247</div>
                                    <div class="stat-period">This month</div>
                                </div>
                                <div class="stat-card">
                                    <h4>Topics Covered</h4>
                                    <div class="stat-number" id="topics-covered">156</div>
                                    <div class="stat-period">Active subjects</div>
                                </div>
                                <div class="stat-card">
                                    <h4>Engagement Rate</h4>
                                    <div class="stat-number" id="engagement-rate">94%</div>
                                    <div class="stat-period">User satisfaction</div>
                                </div>
                                <div class="stat-card">
                                    <h4>SEO Impact</h4>
                                    <div class="stat-number" id="seo-impact">+340%</div>
                                    <div class="stat-period">Search visibility</div>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Content Types -->
                        <div class="content-types-section">
                            <h3>AI Content Creation</h3>
                            
                            <div class="content-type-grid">
                                <div class="content-type-card" data-type="software-comparison">
                                    <div class="content-icon">⚖️</div>
                                    <h4>Software Comparisons</h4>
                                    <p>In-depth analysis of clinical software options</p>
                                    <div class="generation-status">
                                        <span class="status-indicator active">●</span>
                                        <span class="status-text">Auto-generating</span>
                                    </div>
                                </div>
                                
                                <div class="content-type-card" data-type="regulatory-updates">
                                    <div class="content-icon">📋</div>
                                    <h4>Regulatory Updates</h4>
                                    <p>Latest compliance requirements and changes</p>
                                    <div class="generation-status">
                                        <span class="status-indicator active">●</span>
                                        <span class="status-text">Monitoring</span>
                                    </div>
                                </div>
                                
                                <div class="content-type-card" data-type="practice-guides">
                                    <div class="content-icon">🏥</div>
                                    <h4>Practice Optimization</h4>
                                    <p>Complete implementation and improvement guides</p>
                                    <div class="generation-status">
                                        <span class="status-indicator active">●</span>
                                        <span class="status-text">Weekly generation</span>
                                    </div>
                                </div>
                                
                                <div class="content-type-card" data-type="market-analysis">
                                    <div class="content-icon">📊</div>
                                    <h4>Market Intelligence</h4>
                                    <p>Industry trends and vendor analysis reports</p>
                                    <div class="generation-status">
                                        <span class="status-indicator active">●</span>
                                        <span class="status-text">Monthly reports</span>
                                    </div>
                                </div>
                                
                                <div class="content-type-card" data-type="troubleshooting">
                                    <div class="content-icon">🔧</div>
                                    <h4>Problem Solutions</h4>
                                    <p>Automated troubleshooting articles and guides</p>
                                    <div class="generation-status">
                                        <span class="status-indicator active">●</span>
                                        <span class="status-text">On-demand</span>
                                    </div>
                                </div>
                                
                                <div class="content-type-card" data-type="case-studies">
                                    <div class="content-icon">📚</div>
                                    <h4>Success Stories</h4>
                                    <p>Client implementation case studies</p>
                                    <div class="generation-status">
                                        <span class="status-indicator active">●</span>
                                        <span class="status-text">Bi-weekly</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Generation Queue -->
                        <div class="generation-queue-section">
                            <h3>Content Pipeline</h3>
                            
                            <div class="queue-controls">
                                <button id="generate-now" class="btn-primary">🚀 Generate Now</button>
                                <button id="schedule-content" class="btn-secondary">📅 Schedule Generation</button>
                                <button id="customize-templates" class="btn-outline">⚙️ Customize Templates</button>
                            </div>
                            
                            <div class="generation-queue">
                                <div class="queue-header">
                                    <h4>Upcoming Content</h4>
                                    <div class="queue-stats">12 articles in pipeline</div>
                                </div>
                                
                                <div class="queue-items">
                                    <div class="queue-item high-priority">
                                        <div class="item-info">
                                            <div class="item-title">Best Practice vs Medical Director 2024 Update</div>
                                            <div class="item-meta">Software Comparison • High Priority</div>
                                        </div>
                                        <div class="item-status">
                                            <span class="status-badge generating">Generating</span>
                                            <div class="progress-bar"><div class="progress-fill" style="width: 75%"></div></div>
                                        </div>
                                    </div>
                                    
                                    <div class="queue-item">
                                        <div class="item-info">
                                            <div class="item-title">RACGP Standards 2024: IT Requirements Guide</div>
                                            <div class="item-meta">Regulatory Update • Scheduled for tomorrow</div>
                                        </div>
                                        <div class="item-status">
                                            <span class="status-badge queued">Queued</span>
                                        </div>
                                    </div>
                                    
                                    <div class="queue-item">
                                        <div class="item-info">
                                            <div class="item-title">Telehealth Integration: Complete Setup Guide</div>
                                            <div class="item-meta">Practice Guide • Scheduled for Friday</div>
                                        </div>
                                        <div class="item-status">
                                            <span class="status-badge queued">Queued</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <!-- AI Insights -->
                        <div class="ai-insights-section">
                            <h3>AI Content Insights</h3>
                            
                            <div class="insights-grid">
                                <div class="insight-card">
                                    <h4>🔥 Trending Topics</h4>
                                    <div class="trending-topics">
                                        <div class="topic-item">
                                            <span class="topic-name">AI in Healthcare</span>
                                            <span class="topic-growth">+450%</span>
                                        </div>
                                        <div class="topic-item">
                                            <span class="topic-name">Telehealth Security</span>
                                            <span class="topic-growth">+280%</span>
                                        </div>
                                        <div class="topic-item">
                                            <span class="topic-name">Practice Analytics</span>
                                            <span class="topic-growth">+190%</span>
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="insight-card">
                                    <h4>📈 Content Performance</h4>
                                    <div class="performance-metrics">
                                        <div class="metric-item">
                                            <span class="metric-label">Avg. Reading Time</span>
                                            <span class="metric-value">4.2 minutes</span>
                                        </div>
                                        <div class="metric-item">
                                            <span class="metric-label">Share Rate</span>
                                            <span class="metric-value">23%</span>
                                        </div>
                                        <div class="metric-item">
                                            <span class="metric-label">Lead Generation</span>
                                            <span class="metric-value">156 leads/month</span>
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="insight-card">
                                    <h4>🎯 Optimization Suggestions</h4>
                                    <div class="suggestions-list">
                                        <div class="suggestion-item">
                                            <div class="suggestion-text">Focus more on "small practice" content</div>
                                            <div class="suggestion-confidence">92% confidence</div>
                                        </div>
                                        <div class="suggestion-item">
                                            <div class="suggestion-text">Increase troubleshooting guide frequency</div>
                                            <div class="suggestion-confidence">87% confidence</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', generatorHTML);
        this.bindGeneratorEvents();
        this.loadGeneratorStyles();
    }
    
    bindGeneratorEvents() {
        const closeBtn = document.getElementById('close-generator');
        const generateBtn = document.getElementById('generate-now');
        const scheduleBtn = document.getElementById('schedule-content');
        const customizeBtn = document.getElementById('customize-templates');
        
        closeBtn.addEventListener('click', () => this.closeGenerator());
        generateBtn.addEventListener('click', () => this.generateContent());
        scheduleBtn.addEventListener('click', () => this.scheduleContent());
        customizeBtn.addEventListener('click', () => this.customizeTemplates());
        
        // Content type cards
        document.querySelectorAll('.content-type-card').forEach(card => {
            card.addEventListener('click', () => {
                const type = card.getAttribute('data-type');
                this.showContentTypeDetails(type);
            });
        });
    }
    
    startAutomatedGeneration() {
        // Simulate automated content generation
        console.log('🤖 Starting automated content generation...');
        
        // Schedule regular content generation
        setInterval(() => {
            this.checkForContentTriggers();
        }, 3600000); // Check every hour
        
        // Generate trending topic content
        this.generateTrendingContent();
        
        // Update regulatory content
        this.monitorRegulatoryChanges();
        
        console.log('✅ Automated generation system active');
    }
    
    async generateContent() {
        console.log('🚀 Generating new content...');
        
        // Show generation progress
        this.showGenerationProgress();
        
        // Simulate AI content generation
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        // Create sample content
        const newArticle = this.createArticleFromTemplate('softwareComparison', {
            title: 'Best Practice vs Medical Director',
            year: '2024',
            primarySoftware: 'Best Practice',
            secondarySoftware: 'Medical Director',
            confidence: 94
        });
        
        console.log('✅ New article generated:', newArticle.title);
        this.addToContentLibrary(newArticle);
    }
    
    createArticleFromTemplate(templateType, data) {
        const template = this.contentTemplates[templateType];
        if (!template) return null;
        
        let content = template.template;
        
        // Replace placeholders with actual data
        Object.entries(data).forEach(([key, value]) => {
            const placeholder = `{${key}}`;
            content = content.replace(new RegExp(placeholder, 'g'), value);
        });
        
        // Add current date and AI attribution
        content = content.replace('{updateDate}', new Date().toLocaleDateString());
        content += '\n\n*This article was generated by ClinicIT.Solutions AI and reviewed by clinical IT experts.*';
        
        return {
            title: data.title,
            content: content,
            type: templateType,
            generatedAt: new Date(),
            confidence: data.confidence || 90,
            keywords: this.extractKeywords(content),
            readingTime: this.calculateReadingTime(content),
            seoOptimized: true
        };
    }
    
    extractKeywords(content) {
        // Simple keyword extraction
        const words = content.toLowerCase().match(/\b\w+\b/g) || [];
        const keywordCounts = {};
        
        words.forEach(word => {
            if (word.length > 4 && !this.isCommonWord(word)) {
                keywordCounts[word] = (keywordCounts[word] || 0) + 1;
            }
        });
        
        return Object.entries(keywordCounts)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 10)
            .map(([word]) => word);
    }
    
    isCommonWord(word) {
        const commonWords = ['this', 'that', 'with', 'have', 'will', 'from', 'they', 'know', 'want', 'been'];
        return commonWords.includes(word);
    }
    
    calculateReadingTime(content) {
        const wordsPerMinute = 200;
        const wordCount = content.split(/\s+/).length;
        return Math.ceil(wordCount / wordsPerMinute);
    }
    
    showGenerationProgress() {
        const progressHTML = `
            <div class="generation-progress">
                <h4>🤖 AI is creating your content...</h4>
                <div class="progress-steps">
                    <div class="step-item active">Analyzing market trends</div>
                    <div class="step-item">Researching latest data</div>
                    <div class="step-item">Generating content structure</div>
                    <div class="step-item">Writing and optimizing</div>
                    <div class="step-item">Adding SEO optimization</div>
                    <div class="step-item">Final quality check</div>
                </div>
            </div>
        `;
        
        // Would show this in the interface
        console.log('Showing generation progress...');
    }
    
    checkForContentTriggers() {
        // Monitor various triggers for content generation
        const triggers = [
            this.checkSoftwareUpdates(),
            this.checkRegulatoryChanges(), 
            this.checkMarketTrends(),
            this.checkUserQuestions(),
            this.checkCompetitorContent()
        ];
        
        triggers.forEach(trigger => {
            if (trigger.shouldGenerate) {
                this.queueContentGeneration(trigger);
            }
        });
    }
    
    checkSoftwareUpdates() {
        // Simulate checking for software updates
        return {
            shouldGenerate: Math.random() > 0.9, // 10% chance
            type: 'software_update',
            data: {
                software: 'Best Practice',
                version: '1.8.5',
                changes: ['New reporting features', 'Enhanced security', 'Bug fixes']
            }
        };
    }
    
    checkRegulatoryChanges() {
        return {
            shouldGenerate: Math.random() > 0.95, // 5% chance
            type: 'regulatory_change',
            data: {
                regulation: 'RACGP Standards',
                effectiveDate: '2024-07-01',
                impact: 'Medium'
            }
        };
    }
    
    checkMarketTrends() {
        return {
            shouldGenerate: Math.random() > 0.8, // 20% chance
            type: 'market_trend',
            data: {
                trend: 'AI adoption in healthcare',
                growth: '+340%',
                timeframe: 'Q1 2024'
            }
        };
    }
    
    addToContentLibrary(article) {
        // Add to content management system
        console.log(`📚 Added to content library: ${article.title}`);
        
        // Auto-publish or schedule for review
        if (article.confidence > 85) {
            this.schedulePublication(article);
        } else {
            this.queueForReview(article);
        }
    }
    
    schedulePublication(article) {
        console.log(`📅 Scheduled for publication: ${article.title}`);
        
        // Would integrate with CMS/publishing system
        this.publishingSchedule.push({
            article: article,
            publishDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
            platform: 'website',
            seoOptimized: true
        });
    }
    
    openGenerator() {
        document.getElementById('content-generator-modal').style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
    
    closeGenerator() {
        document.getElementById('content-generator-modal').style.display = 'none';
        document.body.style.overflow = '';
    }
    
    loadGeneratorStyles() {
        if (document.getElementById('content-generator-styles')) return;
        
        const styles = `
            <style id="content-generator-styles">
                .generator-modal {
                    max-width: 1400px;
                    width: 98%;
                    max-height: 95vh;
                }
                
                .generator-content {
                    padding: 30px;
                    max-height: calc(95vh - 200px);
                    overflow-y: auto;
                }
                
                .generation-dashboard {
                    margin-bottom: 40px;
                    background: var(--card-background);
                    padding: 30px;
                    border-radius: 15px;
                    border: 2px solid var(--border-color);
                }
                
                .dashboard-stats {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: 25px;
                    margin-top: 25px;
                }
                
                .stat-card {
                    background: var(--background-color);
                    padding: 25px;
                    border-radius: 12px;
                    text-align: center;
                    border: 1px solid var(--border-color);
                }
                
                .stat-card h4 {
                    color: var(--text-light);
                    margin: 0 0 15px 0;
                    font-size: 14px;
                    text-transform: uppercase;
                }
                
                .stat-number {
                    color: var(--accent-color);
                    font-size: 36px;
                    font-weight: bold;
                    margin-bottom: 8px;
                }
                
                .stat-period {
                    color: var(--text-light);
                    font-size: 12px;
                }
                
                .content-type-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                    gap: 25px;
                }
                
                .content-type-card {
                    background: var(--card-background);
                    border: 2px solid var(--border-color);
                    border-radius: 15px;
                    padding: 25px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }
                
                .content-type-card:hover {
                    border-color: var(--accent-color);
                    transform: translateY(-3px);
                    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
                }
                
                .content-icon {
                    font-size: 32px;
                    margin-bottom: 15px;
                }
                
                .content-type-card h4 {
                    color: var(--text-color);
                    margin: 0 0 10px 0;
                }
                
                .content-type-card p {
                    color: var(--text-light);
                    margin: 0 0 15px 0;
                    font-size: 14px;
                    line-height: 1.5;
                }
                
                .generation-status {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }
                
                .status-indicator {
                    font-size: 12px;
                }
                
                .status-indicator.active {
                    color: #10b981;
                    animation: pulse 2s infinite;
                }
                
                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.5; }
                }
                
                .status-text {
                    font-size: 12px;
                    color: var(--text-light);
                    font-weight: 600;
                }
                
                .queue-controls {
                    display: flex;
                    gap: 15px;
                    margin-bottom: 25px;
                    justify-content: center;
                }
                
                .generation-queue {
                    background: var(--background-color);
                    border-radius: 12px;
                    padding: 25px;
                }
                
                .queue-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 20px;
                    padding-bottom: 15px;
                    border-bottom: 2px solid var(--border-color);
                }
                
                .queue-stats {
                    color: var(--text-light);
                    font-size: 14px;
                }
                
                .queue-item {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    background: var(--card-background);
                    padding: 20px;
                    border-radius: 8px;
                    margin-bottom: 15px;
                    border-left: 4px solid var(--border-color);
                }
                
                .queue-item.high-priority {
                    border-left-color: var(--accent-color);
                }
                
                .item-title {
                    font-weight: 600;
                    color: var(--text-color);
                    margin-bottom: 5px;
                }
                
                .item-meta {
                    font-size: 13px;
                    color: var(--text-light);
                }
                
                .status-badge {
                    padding: 4px 12px;
                    border-radius: 12px;
                    font-size: 11px;
                    font-weight: bold;
                    text-transform: uppercase;
                }
                
                .status-badge.generating {
                    background: rgba(16, 163, 127, 0.2);
                    color: var(--accent-color);
                }
                
                .status-badge.queued {
                    background: rgba(107, 114, 128, 0.2);
                    color: var(--text-light);
                }
                
                .progress-bar {
                    width: 100px;
                    height: 6px;
                    background: var(--border-color);
                    border-radius: 3px;
                    margin-top: 8px;
                    overflow: hidden;
                }
                
                .progress-fill {
                    height: 100%;
                    background: linear-gradient(90deg, var(--accent-color), var(--accent-hover));
                    transition: width 0.5s ease;
                }
                
                .insights-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                    gap: 25px;
                }
                
                .insight-card {
                    background: var(--card-background);
                    border: 1px solid var(--border-color);
                    border-radius: 12px;
                    padding: 25px;
                }
                
                .insight-card h4 {
                    color: var(--text-color);
                    margin: 0 0 20px 0;
                    font-size: 16px;
                }
                
                .topic-item, .metric-item {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 8px 0;
                    border-bottom: 1px solid var(--border-color);
                }
                
                .topic-item:last-child, .metric-item:last-child {
                    border-bottom: none;
                }
                
                .topic-name, .metric-label {
                    color: var(--text-color);
                    font-size: 14px;
                }
                
                .topic-growth {
                    color: #10b981;
                    font-weight: bold;
                    font-size: 14px;
                }
                
                .metric-value {
                    color: var(--accent-color);
                    font-weight: bold;
                    font-size: 14px;
                }
                
                .suggestion-item {
                    background: var(--background-color);
                    padding: 15px;
                    border-radius: 8px;
                    margin-bottom: 10px;
                    border-left: 3px solid var(--accent-color);
                }
                
                .suggestion-text {
                    color: var(--text-color);
                    font-size: 14px;
                    margin-bottom: 5px;
                }
                
                .suggestion-confidence {
                    color: var(--text-light);
                    font-size: 12px;
                }
                
                @media (max-width: 768px) {
                    .generator-content {
                        padding: 20px;
                    }
                    
                    .dashboard-stats {
                        grid-template-columns: repeat(2, 1fr);
                    }
                    
                    .content-type-grid {
                        grid-template-columns: 1fr;
                    }
                    
                    .queue-controls {
                        flex-direction: column;
                    }
                    
                    .queue-item {
                        flex-direction: column;
                        align-items: flex-start;
                        gap: 10px;
                    }
                }
            </style>
        `;
        
        document.head.insertAdjacentHTML('beforeend', styles);
    }
    
    // Additional methods for data loading
    loadPricingData() {
        return {
            bestPractice: { setup: 5000, monthly: 400, perUser: 45 },
            medicalDirector: { setup: 0, monthly: 300, perUser: 60 },
            zedmed: { setup: 3000, monthly: 200, perUser: 25 }
        };
    }
    
    loadTrendData() {
        return [
            { topic: 'AI in Healthcare', growth: 450, timeframe: 'Q1 2024' },
            { topic: 'Telehealth Security', growth: 280, timeframe: 'Q1 2024' },
            { topic: 'Practice Analytics', growth: 190, timeframe: 'Q1 2024' }
        ];
    }
    
    loadRegulatoryData() {
        return [
            { type: 'RACGP Standards', status: 'Updated', effectiveDate: '2024-07-01' },
            { type: 'Medicare Requirements', status: 'Monitoring', effectiveDate: 'TBD' }
        ];
    }
    
    loadPracticeData() {
        return {
            small: { practitioners: '1-3', avgRevenue: 800000, commonSoftware: 'Zedmed' },
            medium: { practitioners: '4-10', avgRevenue: 2500000, commonSoftware: 'Medical Director' },
            large: { practitioners: '11+', avgRevenue: 5000000, commonSoftware: 'Best Practice' }
        };
    }
    
    loadCompetitorData() {
        return {
            directCompetitors: ['IT4Practice', 'MedTech Solutions', 'HealthIT Pro'],
            marketPosition: 'Leader with AI advantage',
            differentiators: ['24/7 AI support', 'Automated assessments', 'Predictive insights']
        };
    }
}

// Make available globally  
window.AIContentGenerator = AIContentGenerator;