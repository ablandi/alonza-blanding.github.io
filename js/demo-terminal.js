class DemoTerminal {
    constructor(elementId, project) {
        this.terminal = document.getElementById(elementId);
        this.project = project;
        this.isRunning = false;
        this.currentDemo = null;
        this.outputBuffer = [];
        this.demos = {
            'digital-evidence': {
                name: 'Digital Evidence Suite',
                commands: [
                    'scan_device',
                    'collect_evidence',
                    'analyze_data',
                    'generate_report'
                ],
                description: 'Digital forensics tool for evidence collection and analysis'
            },
            'parental-monitor': {
                name: 'Parental Monitor',
                commands: [
                    'start_monitor',
                    'check_activity',
                    'generate_report',
                    'set_filters'
                ],
                description: 'Secure monitoring solution with privacy features'
            },
            'netrunner-analyzer': {
                name: 'NetRunner Social Analyzer',
                commands: [
                    'scan_profile',
                    'analyze_network',
                    'generate_graph',
                    'export_data'
                ],
                description: 'OSINT tool for social media analysis'
            }
        };

        this.initializeTerminal();
    }

    initializeTerminal() {
        this.terminal.innerHTML = `
            <div class="demo-terminal-header">
                <div class="demo-title">${this.demos[this.project].name}</div>
                <div class="demo-controls">
                    <button class="demo-btn start-btn">START DEMO</button>
                    <button class="demo-btn stop-btn" disabled>STOP</button>
                </div>
            </div>
            <div class="demo-terminal-body">
                <div class="demo-output"></div>
                <div class="demo-input-line">
                    <span class="demo-prompt">$</span>
                    <input type="text" class="demo-input" placeholder="Enter command..." disabled>
                </div>
            </div>
            <div class="demo-status-bar">
                <span class="status">READY</span>
                <span class="memory">MEM: 0%</span>
                <span class="cpu">CPU: 0%</span>
            </div>
        `;

        this.outputElement = this.terminal.querySelector('.demo-output');
        this.inputElement = this.terminal.querySelector('.demo-input');
        this.statusElement = this.terminal.querySelector('.status');
        this.memoryElement = this.terminal.querySelector('.memory');
        this.cpuElement = this.terminal.querySelector('.cpu');
        this.startButton = this.terminal.querySelector('.start-btn');
        this.stopButton = this.terminal.querySelector('.stop-btn');

        this.setupEventListeners();
        this.showAvailableCommands();
    }

    setupEventListeners() {
        this.startButton.addEventListener('click', () => this.startDemo());
        this.stopButton.addEventListener('click', () => this.stopDemo());
        this.inputElement.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && this.isRunning) {
                const command = this.inputElement.value.trim();
                if (command) {
                    this.executeCommand(command);
                    this.inputElement.value = '';
                }
            }
        });
    }

    showAvailableCommands() {
        this.print(`Available commands for ${this.demos[this.project].name}:`, 'info');
        this.demos[this.project].commands.forEach(cmd => {
            this.print(`  ${cmd}`, 'command');
        });
        this.print('\nType "help" for command descriptions', 'info');
    }

    print(text, className = '') {
        const line = document.createElement('div');
        line.className = `demo-line ${className}`;
        line.textContent = text;
        this.outputElement.appendChild(line);
        this.outputElement.scrollTop = this.outputElement.scrollHeight;
    }

    async startDemo() {
        this.isRunning = true;
        this.startButton.disabled = true;
        this.stopButton.disabled = false;
        this.inputElement.disabled = false;
        this.inputElement.focus();

        this.print('\nInitializing demo environment...', 'system');
        await this.simulateStartup();
        
        this.statusElement.textContent = 'RUNNING';
        this.statusElement.className = 'status running';
        
        this.startResourceMonitoring();
    }

    async simulateStartup() {
        const steps = [
            'Loading system components...',
            'Initializing security protocols...',
            'Establishing secure connection...',
            'Preparing demo environment...',
            'System ready.'
        ];

        for (const step of steps) {
            await new Promise(resolve => setTimeout(resolve, 500));
            this.print(step, 'system');
        }
    }

    stopDemo() {
        this.isRunning = false;
        this.startButton.disabled = false;
        this.stopButton.disabled = true;
        this.inputElement.disabled = true;
        
        this.statusElement.textContent = 'STOPPED';
        this.statusElement.className = 'status stopped';
        
        clearInterval(this.resourceMonitorInterval);
        this.memoryElement.textContent = 'MEM: 0%';
        this.cpuElement.textContent = 'CPU: 0%';
        
        this.print('\nDemo stopped.', 'error');
    }

    startResourceMonitoring() {
        this.resourceMonitorInterval = setInterval(() => {
            const memory = Math.floor(Math.random() * 30) + 20;
            const cpu = Math.floor(Math.random() * 40) + 10;
            
            this.memoryElement.textContent = `MEM: ${memory}%`;
            this.cpuElement.textContent = `CPU: ${cpu}%`;
        }, 2000);
    }

    async executeCommand(command) {
        if (!this.isRunning) return;

        this.print(`$ ${command}`, 'input');

        if (command === 'help') {
            this.showAvailableCommands();
            return;
        }

        if (!this.demos[this.project].commands.includes(command)) {
            this.print('Command not recognized. Type "help" for available commands.', 'error');
            return;
        }

        // Simulate command execution with project-specific responses
        await this.simulateCommandExecution(command);
    }

    async simulateCommandExecution(command) {
        const responses = {
            'digital-evidence': {
                'scan_device': [
                    'Initializing device scan...',
                    'Detecting connected devices...',
                    'Found 3 devices',
                    'Scanning device 1/3...',
                    'Scanning device 2/3...',
                    'Scanning device 3/3...',
                    'Scan complete. Ready for evidence collection.'
                ],
                'collect_evidence': [
                    'Starting evidence collection...',
                    'Creating forensic copy...',
                    'Verifying data integrity...',
                    'Evidence collected successfully.'
                ],
                'analyze_data': [
                    'Initiating data analysis...',
                    'Processing files...',
                    'Detecting patterns...',
                    'Analysis complete.'
                ],
                'generate_report': [
                    'Generating forensic report...',
                    'Compiling findings...',
                    'Report generated successfully.'
                ]
            },
            'parental-monitor': {
                'start_monitor': [
                    'Initializing monitoring system...',
                    'Setting up privacy filters...',
                    'Starting activity tracking...',
                    'Monitor active.'
                ],
                'check_activity': [
                    'Retrieving activity logs...',
                    'Analyzing patterns...',
                    'Generating activity summary...',
                    'Activity check complete.'
                ],
                'generate_report': [
                    'Compiling monitoring data...',
                    'Generating insights...',
                    'Report ready for review.'
                ],
                'set_filters': [
                    'Loading current filters...',
                    'Updating filter rules...',
                    'Filters updated successfully.'
                ]
            },
            'netrunner-analyzer': {
                'scan_profile': [
                    'Initializing profile scan...',
                    'Gathering social data...',
                    'Analyzing digital footprint...',
                    'Profile scan complete.'
                ],
                'analyze_network': [
                    'Mapping social connections...',
                    'Analyzing relationship patterns...',
                    'Generating network insights...',
                    'Network analysis complete.'
                ],
                'generate_graph': [
                    'Preparing network data...',
                    'Generating visualization...',
                    'Graph ready for viewing.'
                ],
                'export_data': [
                    'Preparing data export...',
                    'Encrypting sensitive information...',
                    'Data exported successfully.'
                ]
            }
        };

        const projectResponses = responses[this.project][command];
        for (const response of projectResponses) {
            await new Promise(resolve => setTimeout(resolve, 800));
            this.print(response, 'output');
        }
    }
}

// Initialize demo terminals when the page loads
document.addEventListener('DOMContentLoaded', () => {
    const demoContainers = document.querySelectorAll('.demo-terminal');
    demoContainers.forEach(container => {
        const project = container.getAttribute('data-project');
        new DemoTerminal(container.id, project);
    });
});
