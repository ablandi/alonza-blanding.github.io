// Initialize Parental Monitor Demo
const monitorDemo = new DemoTerminal('monitor-demo', {
    prompt: 'monitor$',
    welcomeMessage: 'Parental Monitoring System Demo Environment\nType "help" for available commands.',
    commandHelp: {
        'monitor': 'Start activity monitoring',
        'filter': 'Set content filter type (web, app, or all)',
        'alerts': 'View recent alerts',
        'stats': 'View monitoring statistics',
        'help': 'Show available commands'
    },
    commands: {
        monitor: (_, terminal) => {
            terminal.writeOutput('Starting activity monitoring...', 'info');
            
            let activities = [
                'Opening web browser...',
                'Accessing educational website...',
                'Starting game application...',
                'Attempting to access restricted content...',
                'Social media activity detected...'
            ];

            let resourceUpdates = {
                cpu: 0,
                memory: 0,
                alerts: 0
            };

            const updateInterval = setInterval(() => {
                if (resourceUpdates.cpu < 35) resourceUpdates.cpu += 5;
                if (resourceUpdates.memory < 25) resourceUpdates.memory += 3;
                terminal.updateResourceMonitor({
                    cpu: resourceUpdates.cpu,
                    memory: resourceUpdates.memory,
                    alerts: resourceUpdates.alerts
                });
            }, 500);

            activities.forEach((activity, index) => {
                setTimeout(() => {
                    terminal.writeOutput(activity, 'info');
                    if (activity.includes('restricted')) {
                        setTimeout(() => {
                            terminal.writeOutput('⚠️ ALERT: Attempted access to restricted content blocked', 'error');
                            resourceUpdates.alerts++;
                            terminal.updateResourceMonitor({
                                alerts: resourceUpdates.alerts
                            });
                        }, 300);
                    }
                }, index * 1000);
            });

            setTimeout(() => {
                clearInterval(updateInterval);
                terminal.writeOutput('Monitoring session completed.', 'success');
            }, activities.length * 1000 + 1000);
        },

        filter: (args, terminal) => {
            const validTypes = ['web', 'app', 'all'];
            if (!args.length || !validTypes.includes(args[0])) {
                terminal.writeOutput('Usage: filter [type] (web, app, or all)', 'error');
                return;
            }

            terminal.writeOutput(`Setting content filter to: ${args[0]}`, 'info');
            setTimeout(() => {
                terminal.writeOutput('Content filter updated successfully', 'success');
                terminal.writeOutput(`
Current Filter Settings:
- Web Filtering: ${args[0] === 'web' || args[0] === 'all' ? 'Enabled' : 'Disabled'}
- App Filtering: ${args[0] === 'app' || args[0] === 'all' ? 'Enabled' : 'Disabled'}
- Keywords Monitoring: Active
- Safe Search: Enforced`, 'info');
            }, 800);
        },

        alerts: (_, terminal) => {
            terminal.writeOutput('Recent Alerts:', 'info');
            setTimeout(() => {
                terminal.writeOutput(`
1. [${new Date(Date.now() - 300000).toLocaleTimeString()}] Restricted website access attempted
2. [${new Date(Date.now() - 600000).toLocaleTimeString()}] Excessive gaming time detected
3. [${new Date(Date.now() - 900000).toLocaleTimeString()}] Unknown application launched
4. [${new Date(Date.now() - 1200000).toLocaleTimeString()}] Inappropriate content filtered`, 'info');
            }, 500);
        },

        stats: (_, terminal) => {
            terminal.writeOutput('Monitoring Statistics:', 'info');
            terminal.writeOutput(`
Session Duration: 2h 15m
Websites Monitored: 47
Applications Tracked: 12
Alerts Generated: 4
Content Filtered: 7 items
Last Update: ${new Date().toLocaleString()}`, 'info');
        }
    }
});

// Initialize with some default resource values
monitorDemo.updateResourceMonitor({
    cpu: 5,
    memory: 8,
    alerts: 0
});
