const fetch = require('node-fetch');

class PerformanceTestSuite {
    constructor() {
        this.baseUrl = 'http://localhost:3000';
        this.results = [];
        this.startTime = Date.now();
    }

    async testQuery(query, category) {
        const start = performance.now();
        
        try {
            const response = await fetch(`${this.baseUrl}/api/chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: query })
            });
            
            const end = performance.now();
            const data = await response.json();
            
            const result = {
                category,
                query,
                responseTime: Math.round(end - start),
                status: response.status,
                detectionMethod: this.extractDetectionMethod(data),
                confidence: this.extractConfidence(data),
                contentLength: data.response?.length || 0,
                timestamp: new Date().toISOString()
            };
            
            this.results.push(result);
            console.log(`✓ ${category}: "${query}" - ${result.responseTime}ms (${result.detectionMethod})`);
            
            return result;
            
        } catch (error) {
            const result = {
                category,
                query,
                responseTime: -1,
                status: 'ERROR',
                error: error.message,
                timestamp: new Date().toISOString()
            };
            
            this.results.push(result);
            console.log(`✗ ${category}: "${query}" - ERROR: ${error.message}`);
            
            return result;
        }
    }

    extractDetectionMethod(data) {
        if (data.debug?.detectionMethod) return data.debug.detectionMethod;
        if (data.response?.includes('Pattern')) return 'pattern';
        if (data.response?.includes('AI')) return 'ai';
        return 'unknown';
    }

    extractConfidence(data) {
        if (data.debug?.confidence) return data.debug.confidence;
        return 'unknown';
    }

    async runReiseversicherungTests() {
        console.log('\n🧳 REISEVERSICHERUNG TESTS:');
        await this.testQuery('Ich möchte eine Reiseversicherung', 'Reiseversicherung');
        await this.testQuery('Was kostet eine Reiseversicherung?', 'Reiseversicherung');
        await this.testQuery('Reiseversicherung für Italien', 'Reiseversicherung');
        await this.testQuery('Reiseversicherung Ausschlüsse', 'Reiseversicherung');
        await this.testQuery('Reiseversicherung Anbieter', 'Reiseversicherung');
    }

    async runRechtschutzTests() {
        console.log('\n⚖️ RECHTSCHUTZVERSICHERUNG TESTS:');
        await this.testQuery('Brauche ich eine Rechtschutzversicherung?', 'Rechtschutz');
        await this.testQuery('Rechtschutz Kosten', 'Rechtschutz');
        await this.testQuery('Anwalt Versicherung', 'Rechtschutz');
        await this.testQuery('Gerichtskosten Versicherung', 'Rechtschutz');
        await this.testQuery('Rechtschutz Bereiche', 'Rechtschutz');
    }

    async runKantonalTests() {
        console.log('\n🏔️ KANTONAL TESTS:');
        await this.testQuery('Versicherung Zürich', 'Kantonal');
        await this.testQuery('Gebäudeversicherung Bern', 'Kantonal');
        await this.testQuery('Prämienverbilligung Genf', 'Kantonal');
        await this.testQuery('Kanton Basel Versicherung', 'Kantonal');
        await this.testQuery('Säule 3a Steuerabzug Waadt', 'Kantonal');
    }

    async runSaeulenTests() {
        console.log('\n🏛️ 3-SÄULEN TESTS:');
        await this.testQuery('Säule 3a Einkauf', '3-Säulen');
        await this.testQuery('Frühpensionierung', '3-Säulen');
        await this.testQuery('Pensionskasse Koordination', '3-Säulen');
        await this.testQuery('Invalidität Vorsorge', '3-Säulen');
        await this.testQuery('Was ist Säule 3b?', '3-Säulen');
    }

    async runKrankenversicherungTests() {
        console.log('\n🏥 KRANKENVERSICHERUNG TESTS:');
        await this.testQuery('Grundversicherung Schweiz', 'Krankenversicherung');
        await this.testQuery('Franchise erhöhen', 'Krankenversicherung');
        await this.testQuery('Krankenkasse wechseln', 'Krankenversicherung');
    }

    generateReport() {
        const totalTime = Date.now() - this.startTime;
        const successful = this.results.filter(r => r.status \!== 'ERROR');
        const errors = this.results.filter(r => r.status === 'ERROR');
        
        const avgResponseTime = successful.length > 0 
            ? Math.round(successful.reduce((sum, r) => sum + r.responseTime, 0) / successful.length)
            : 0;

        const patternDetections = successful.filter(r => r.detectionMethod === 'pattern').length;
        const aiDetections = successful.filter(r => r.detectionMethod === 'ai').length;
        const hybridDetections = successful.filter(r => r.detectionMethod === 'hybrid').length;

        const report = {
            summary: {
                totalQueries: this.results.length,
                successful: successful.length,
                errors: errors.length,
                avgResponseTime: avgResponseTime,
                totalTestTime: totalTime,
                timestamp: new Date().toISOString()
            },
            performance: {
                patternDetections,
                aiDetections,
                hybridDetections,
                under50ms: successful.filter(r => r.responseTime < 50).length,
                under100ms: successful.filter(r => r.responseTime < 100).length,
                over1000ms: successful.filter(r => r.responseTime > 1000).length
            },
            categoryBreakdown: this.getCategoryBreakdown(),
            detailedResults: this.results
        };

        console.log('\n📊 PERFORMANCE REPORT:');
        console.log(`Total Queries: ${report.summary.totalQueries}`);
        console.log(`Successful: ${report.summary.successful}`);
        console.log(`Errors: ${report.summary.errors}`);
        console.log(`Avg Response Time: ${report.summary.avgResponseTime}ms`);
        console.log(`Pattern Detections: ${report.performance.patternDetections}`);
        console.log(`AI Detections: ${report.performance.aiDetections}`);
        console.log(`Hybrid Detections: ${report.performance.hybridDetections}`);
        console.log(`Under 50ms: ${report.performance.under50ms}`);
        console.log(`Under 100ms: ${report.performance.under100ms}`);
        console.log(`Over 1000ms: ${report.performance.over1000ms}`);

        return report;
    }

    getCategoryBreakdown() {
        const categories = {};
        this.results.forEach(result => {
            if (\!categories[result.category]) {
                categories[result.category] = {
                    count: 0,
                    avgResponseTime: 0,
                    errors: 0
                };
            }
            categories[result.category].count++;
            if (result.status \!== 'ERROR') {
                categories[result.category].avgResponseTime += result.responseTime;
            } else {
                categories[result.category].errors++;
            }
        });

        Object.keys(categories).forEach(cat => {
            const successful = categories[cat].count - categories[cat].errors;
            if (successful > 0) {
                categories[cat].avgResponseTime = Math.round(categories[cat].avgResponseTime / successful);
            }
        });

        return categories;
    }

    async runAll() {
        console.log('🚀 STARTING UMFASSENDE PERFORMANCE TESTS');
        console.log(`Target URL: ${this.baseUrl}/demo`);
        
        await this.runReiseversicherungTests();
        await this.runRechtschutzTests();
        await this.runKantonalTests();
        await this.runSaeulenTests();
        await this.runKrankenversicherungTests();
        
        const report = this.generateReport();
        
        // Save detailed report
        const fs = require('fs');
        fs.writeFileSync('performance-test-report.json', JSON.stringify(report, null, 2));
        console.log('\n📄 Detailed report saved to: performance-test-report.json');
        
        return report;
    }
}

// Run tests if called directly
if (require.main === module) {
    const suite = new PerformanceTestSuite();
    suite.runAll().catch(console.error);
}

module.exports = PerformanceTestSuite;
EOF < /dev/null