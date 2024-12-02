// Initialize Social Analyzer Demo
const analyzerDemo = new DemoTerminal('analyzer-demo', {
    prompt: 'analyzer$',
    welcomeMessage: 'Social Media Analyzer Demo Environment\nType "help" for available commands.',
    commandHelp: {
        'analyze': 'Analyze sample text for sentiment and context',
        'scan': 'Scan social platform (twitter, facebook, or linkedin)',
        'report': 'Generate comprehensive analysis report',
        'trends': 'View current trending topics',
        'help': 'Show available commands'
    },
    commands: {
        analyze: (args, terminal) => {
            if (!args.length) {
                terminal.writeOutput('Usage: analyze [text]', 'error');
                return;
            }

            const text = args.join(' ');
            terminal.writeOutput('Initiating sentiment analysis...', 'info');
            
            let progress = 0;
            const progressInterval = setInterval(() => {
                progress += 10;
                terminal.updateResourceMonitor({
                    processing: progress
                });
                if (progress >= 100) clearInterval(progressInterval);
            }, 200);

            setTimeout(() => {
                // Generate a pseudo-random sentiment score between -1 and 1
                const sentiment = (Math.random() * 2 - 1).toFixed(2);
                const sentimentText = sentiment > 0.3 ? 'Positive' : 
                                    sentiment < -0.3 ? 'Negative' : 'Neutral';
                
                terminal.writeOutput(`
Analysis Complete:
Text: "${text}"
Sentiment Score: ${sentiment}
Overall Sentiment: ${sentimentText}
Key Entities: ${generateEntities()}
Emotion Detection: ${generateEmotions()}
Confidence: ${(Math.random() * 20 + 80).toFixed(1)}%`, 'success');

                terminal.updateResourceMonitor({
                    processing: 100,
                    analyzed: parseInt(terminal.terminal.querySelector('[data-resource="analyzed"] .resource-value').textContent) + 1,
                    sentiment: sentiment
                });
            }, 2000);
        },

        scan: (args, terminal) => {
            const platforms = ['twitter', 'facebook', 'linkedin'];
            if (!args.length || !platforms.includes(args[0].toLowerCase())) {
                terminal.writeOutput('Usage: scan [platform] (twitter, facebook, or linkedin)', 'error');
                return;
            }

            const platform = args[0].toLowerCase();
            terminal.writeOutput(`Initiating ${platform} scan...`, 'info');

            let progress = 0;
            let postsAnalyzed = 0;
            const progressInterval = setInterval(() => {
                progress += 5;
                postsAnalyzed += Math.floor(Math.random() * 3);
                terminal.updateResourceMonitor({
                    processing: progress,
                    analyzed: postsAnalyzed
                });
                if (progress >= 100) clearInterval(progressInterval);
            }, 300);

            const updates = [
                'Connecting to API...',
                'Fetching recent posts...',
                'Processing content...',
                'Analyzing sentiment...',
                'Identifying trends...',
                'Generating report...'
            ];

            updates.forEach((update, index) => {
                setTimeout(() => {
                    terminal.writeOutput(update, 'info');
                }, index * 1000);
            });

            setTimeout(() => {
                terminal.writeOutput(`
Scan Complete for ${platform}:
Posts Analyzed: ${postsAnalyzed}
Average Sentiment: ${(Math.random() * 0.6 + 0.2).toFixed(2)}
Trending Topics: ${generateTrendingTopics()}
Engagement Rate: ${(Math.random() * 5 + 2).toFixed(1)}%
Risk Score: ${Math.floor(Math.random() * 100)}`, 'success');
            }, updates.length * 1000 + 500);
        },

        report: (_, terminal) => {
            terminal.writeOutput('Generating comprehensive analysis report...', 'info');
            
            setTimeout(() => {
                terminal.writeOutput(`
Social Media Analysis Report
${new Date().toLocaleDateString()}

1. Overview
   - Total Posts Analyzed: ${Math.floor(Math.random() * 1000 + 500)}
   - Time Period: Last 7 days
   - Platforms: Twitter, Facebook, LinkedIn

2. Sentiment Analysis
   - Overall Sentiment: ${(Math.random() * 0.6 + 0.2).toFixed(2)}
   - Positive Posts: ${Math.floor(Math.random() * 30 + 40)}%
   - Negative Posts: ${Math.floor(Math.random() * 20 + 10)}%
   - Neutral Posts: ${Math.floor(Math.random() * 20 + 30)}%

3. Content Analysis
   - Most Used Keywords: ${generateKeywords()}
   - Popular Hashtags: ${generateHashtags()}
   - Peak Activity: ${Math.floor(Math.random() * 12 + 1)}:00 ${Math.random() > 0.5 ? 'AM' : 'PM'}

4. Engagement Metrics
   - Average Likes: ${Math.floor(Math.random() * 100 + 50)}
   - Average Shares: ${Math.floor(Math.random() * 50 + 20)}
   - Comment Rate: ${(Math.random() * 5 + 2).toFixed(1)}%

5. Security Analysis
   - Potential Risks Identified: ${Math.floor(Math.random() * 5)}
   - Content Warnings: ${Math.floor(Math.random() * 3)}
   - Compliance Score: ${Math.floor(Math.random() * 20 + 80)}%`, 'info');
            }, 2000);
        },

        trends: (_, terminal) => {
            terminal.writeOutput('Analyzing current trends...', 'info');
            
            setTimeout(() => {
                terminal.writeOutput(`
Trending Topics Analysis:

1. Most Discussed Topics
${generateTrendingTopics(5)}

2. Sentiment by Topic
${generateTopicSentiments()}

3. Engagement Metrics
${generateEngagementMetrics()}

4. Geographic Distribution
${generateGeographicData()}

Last Updated: ${new Date().toLocaleTimeString()}`, 'info');
            }, 1500);
        }
    }
});

// Helper functions for generating demo data
function generateEntities() {
    const entities = ['Technology', 'Security', 'AI', 'Blockchain', 'Privacy', 'Data'];
    return entities.sort(() => Math.random() - 0.5).slice(0, 3).join(', ');
}

function generateEmotions() {
    const emotions = ['Confidence', 'Optimism', 'Concern', 'Interest', 'Enthusiasm'];
    return emotions.sort(() => Math.random() - 0.5).slice(0, 2).join(', ');
}

function generateTrendingTopics(count = 3) {
    const topics = [
        '#CyberSecurity', '#AI', '#Tech', '#Innovation', 
        '#DigitalTransformation', '#Privacy', '#Cloud', 
        '#DataScience', '#Blockchain', '#IoT'
    ];
    return topics.sort(() => Math.random() - 0.5).slice(0, count).join(', ');
}

function generateKeywords() {
    const keywords = ['security', 'innovation', 'technology', 'digital', 'future', 'data'];
    return keywords.sort(() => Math.random() - 0.5).slice(0, 4).join(', ');
}

function generateHashtags() {
    const hashtags = ['#TechTrends', '#Innovation', '#DigitalFuture', '#Security', '#AI'];
    return hashtags.sort(() => Math.random() - 0.5).slice(0, 3).join(', ');
}

function generateTopicSentiments() {
    const topics = ['Technology', 'Security', 'Innovation', 'Digital'];
    return topics.map(topic => 
        `   ${topic}: ${(Math.random() * 0.6 + 0.2).toFixed(2)} (${Math.floor(Math.random() * 1000)} mentions)`
    ).join('\n');
}

function generateEngagementMetrics() {
    return [
        `   Avg. Engagement Rate: ${(Math.random() * 5 + 2).toFixed(1)}%`,
        `   Peak Hours: ${Math.floor(Math.random() * 12 + 1)}:00 - ${Math.floor(Math.random() * 12 + 1)}:00`,
        `   Most Active Platform: ${['Twitter', 'LinkedIn', 'Facebook'][Math.floor(Math.random() * 3)]}`
    ].join('\n');
}

function generateGeographicData() {
    const regions = ['North America', 'Europe', 'Asia', 'Other'];
    return regions.map(region => 
        `   ${region}: ${Math.floor(Math.random() * 40 + 10)}%`
    ).join('\n');
}

// Initialize with default values
analyzerDemo.updateResourceMonitor({
    processing: 0,
    analyzed: 0,
    sentiment: 'N/A'
});
