class DemoTerminal {
    constructor(elementId, config) {
        this.terminal = document.getElementById(elementId);
        this.output = this.terminal.querySelector('.demo-output');
        this.input = this.terminal.querySelector('.demo-input');
        this.config = {
            prompt: config.prompt || 'demo$',
            commands: config.commands || {},
            welcomeMessage: config.welcomeMessage || 'Type "help" for available commands.'
        };

        this.commandHistory = [];
        this.historyIndex = -1;

        this.initializeTerminal();
    }

    initializeTerminal() {
        this.input.addEventListener('keydown', (e) => this.handleInput(e));
        this.writeOutput(this.config.welcomeMessage, 'info');
    }

    handleInput(e) {
        if (e.key === 'Enter') {
            const command = this.input.value.trim();
            if (command) {
                this.executeCommand(command);
                this.commandHistory.push(command);
                this.historyIndex = this.commandHistory.length;
            }
            this.input.value = '';
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            this.navigateHistory(-1);
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            this.navigateHistory(1);
        }
    }

    navigateHistory(direction) {
        this.historyIndex += direction;
        if (this.historyIndex < 0) this.historyIndex = 0;
        if (this.historyIndex > this.commandHistory.length) {
            this.historyIndex = this.commandHistory.length;
            this.input.value = '';
            return;
        }
        this.input.value = this.commandHistory[this.historyIndex] || '';
    }

    writeOutput(text, type = 'default') {
        const timestamp = new Date().toLocaleTimeString();
        const response = document.createElement('div');
        response.className = `response-block ${type}`;
        response.innerHTML = `<span class="timestamp">[${timestamp}]</span> ${text}`;
        this.output.appendChild(response);
        this.output.scrollTop = this.output.scrollHeight;
    }

    executeCommand(commandStr) {
        const [cmd, ...args] = commandStr.split(' ');
        this.writeOutput(`${this.config.prompt} ${commandStr}`, 'command');

        if (this.config.commands[cmd]) {
            this.config.commands[cmd](args, this);
        } else if (cmd === 'help') {
            this.showHelp();
        } else {
            this.writeOutput(`Command not found: ${cmd}. Type "help" for available commands.`, 'error');
        }
    }

    showHelp() {
        let helpText = 'Available Commands:\n';
        for (const [cmd, info] of Object.entries(this.config.commandHelp || {})) {
            helpText += `\n${cmd.padEnd(15)} - ${info}`;
        }
        this.writeOutput(helpText, 'info');
    }

    updateResourceMonitor(resources) {
        const monitor = this.terminal.querySelector('.resource-monitor');
        if (!monitor) return;

        for (const [key, value] of Object.entries(resources)) {
            const item = monitor.querySelector(`[data-resource="${key}"]`);
            if (item) {
                const valueElement = item.querySelector('.resource-value');
                const progressBar = item.querySelector('.progress-fill');
                if (valueElement) valueElement.textContent = value;
                if (progressBar) progressBar.style.width = `${value}%`;
            }
        }
    }
}

// Initialize Evidence Suite Demo
const evidenceDemo = new DemoTerminal('evidence-demo', {
    prompt: 'evidence-suite$',
    welcomeMessage: 'Digital Evidence Suite Demo Environment\nType "help" for available commands.',
    commandHelp: {
        'collect': 'Collect evidence from specified URL',
        'verify': 'Verify evidence integrity',
        'chain': 'View chain of custody',
        'status': 'View system status',
        'help': 'Show available commands'
    },
    commands: {
        collect: (args, terminal) => {
            if (!args.length) {
                terminal.writeOutput('Usage: collect [url]', 'error');
                return;
            }
            
            terminal.writeOutput('Initiating evidence collection...', 'info');
            setTimeout(() => {
                terminal.writeOutput('Connecting to target URL...', 'info');
                setTimeout(() => {
                    terminal.writeOutput('Capturing content...', 'info');
                    setTimeout(() => {
                        terminal.writeOutput('Generating hash...', 'info');
                        setTimeout(() => {
                            terminal.writeOutput('Evidence collected successfully!', 'success');
                            terminal.writeOutput('Hash: 7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069', 'info');
                        }, 800);
                    }, 600);
                }, 400);
            }, 200);
        },

        verify: (args, terminal) => {
            if (!args.length) {
                terminal.writeOutput('Usage: verify [hash]', 'error');
                return;
            }
            
            terminal.writeOutput('Verifying evidence integrity...', 'info');
            setTimeout(() => {
                terminal.writeOutput('Hash verification successful!', 'success');
                terminal.writeOutput('Original hash matches current hash.', 'info');
            }, 1000);
        },

        chain: (_, terminal) => {
            terminal.writeOutput('Chain of Custody Log:', 'info');
            setTimeout(() => {
                terminal.writeOutput(`
1. Evidence Collection
   Timestamp: ${new Date().toISOString()}
   Action: Initial collection
   Officer: Demo User
   Hash: 7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069

2. Evidence Verification
   Timestamp: ${new Date().toISOString()}
   Action: Hash verification
   Officer: Demo User
   Status: Verified`, 'info');
            }, 500);
        },

        status: (_, terminal) => {
            terminal.writeOutput('System Status:', 'info');
            terminal.writeOutput(`
Storage: 42% used
CPU Usage: 12%
Memory: 1.2GB/4GB
Active Collections: 1
Last Backup: ${new Date().toLocaleString()}`, 'info');
        }
    }
});
