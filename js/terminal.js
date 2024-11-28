class HackerTerminal {
    constructor(elementId) {
        this.terminal = document.getElementById(elementId);
        this.commandHistory = [];
        this.historyIndex = 0;
        this.commands = {
            'help': () => this.showHelp(),
            'clear': () => this.clear(),
            'projects': () => this.showProjects(),
            'skills': () => this.showSkills(),
            'contact': () => this.showContact(),
            'scan': () => this.simulateNetworkScan(),
            'matrix': () => this.startMatrixRain(),
            'about': () => this.showAbout()
        };
        
        this.initializeTerminal();
    }

    initializeTerminal() {
        this.terminal.innerHTML = `
            <div class="terminal-header">
                <span class="terminal-title">SECURITY_CONSOLE_v2.0</span>
                <div class="terminal-controls">
                    <span class="control minimize">_</span>
                    <span class="control maximize">□</span>
                    <span class="control close">×</span>
                </div>
            </div>
            <div class="terminal-body">
                <div class="output"></div>
                <div class="input-line">
                    <span class="prompt">></span>
                    <input type="text" class="command-input" autofocus spellcheck="false">
                </div>
            </div>
        `;

        this.output = this.terminal.querySelector('.output');
        this.input = this.terminal.querySelector('.command-input');
        this.setupEventListeners();
        this.welcomeMessage();
    }

    setupEventListeners() {
        this.input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const command = this.input.value.trim().toLowerCase();
                if (command) {
                    this.executeCommand(command);
                    this.commandHistory.push(command);
                    this.historyIndex = this.commandHistory.length;
                }
                this.input.value = '';
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                if (this.historyIndex > 0) {
                    this.historyIndex--;
                    this.input.value = this.commandHistory[this.historyIndex];
                }
            } else if (e.key === 'ArrowDown') {
                e.preventDefault();
                if (this.historyIndex < this.commandHistory.length - 1) {
                    this.historyIndex++;
                    this.input.value = this.commandHistory[this.historyIndex];
                } else {
                    this.historyIndex = this.commandHistory.length;
                    this.input.value = '';
                }
            }
        });
    }

    print(text, className = '') {
        const line = document.createElement('div');
        line.className = `terminal-line ${className}`;
        line.innerHTML = text;
        this.output.appendChild(line);
        this.output.scrollTop = this.output.scrollHeight;
    }

    executeCommand(command) {
        this.print(`> ${command}`, 'command');
        const cmd = this.commands[command];
        if (cmd) {
            cmd();
        } else {
            this.print('Command not recognized. Type "help" for available commands.', 'error');
        }
    }

    welcomeMessage() {
        this.print('INITIALIZING SECURITY CONSOLE...', 'system');
        setTimeout(() => {
            this.print('SYSTEM READY', 'success');
            this.print('Type "help" for available commands.', 'info');
        }, 1000);
    }

    showHelp() {
        const commands = [
            'help    - Show available commands',
            'about   - Display personal information',
            'projects- Show portfolio projects',
            'skills  - List technical skills',
            'contact - Display contact information',
            'scan    - Run network security scan',
            'matrix  - Toggle matrix animation',
            'clear   - Clear terminal output'
        ];
        commands.forEach(cmd => this.print(cmd));
    }

    showProjects() {
        const projects = [
            {
                name: 'Digital Evidence Suite',
                desc: 'Advanced digital forensics tool for evidence collection and analysis',
                tech: ['Python', 'Forensics', 'Cryptography']
            },
            {
                name: 'Parental Monitor',
                desc: 'Secure monitoring solution with advanced privacy features',
                tech: ['Python', 'Security', 'Analytics']
            },
            {
                name: 'NetRunner Social Analyzer',
                desc: 'Cyberpunk-themed OSINT tool for social media analysis',
                tech: ['React', 'FastAPI', 'D3.js']
            }
        ];

        projects.forEach(project => {
            this.print(`
                <div class="project-card">
                    <h3 class="project-title">${project.name}</h3>
                    <p class="project-desc">${project.desc}</p>
                    <div class="project-tech">
                        ${project.tech.map(t => `<span class="tech-tag">${t}</span>`).join('')}
                    </div>
                </div>
            `);
        });
    }

    showSkills() {
        const skills = {
            'Security': ['Penetration Testing', 'Digital Forensics', 'Network Security', 'OSINT'],
            'Programming': ['Python', 'JavaScript', 'React', 'FastAPI'],
            'Tools': ['Wireshark', 'Metasploit', 'Burp Suite', 'Nmap'],
            'Other': ['System Administration', 'Network Analysis', 'Threat Modeling']
        };

        Object.entries(skills).forEach(([category, items]) => {
            this.print(`<div class="skills-category">
                <h3 class="category-title">${category}</h3>
                <div class="skills-grid">
                    ${items.map(skill => `<span class="skill-item">${skill}</span>`).join('')}
                </div>
            </div>`);
        });
    }

    showContact() {
        this.print(`
            <div class="contact-info">
                <div class="contact-item">
                    <span class="icon">📧</span>
                    <a href="mailto:your.email@example.com">your.email@example.com</a>
                </div>
                <div class="contact-item">
                    <span class="icon">💼</span>
                    <a href="https://linkedin.com/in/yourprofile" target="_blank">LinkedIn</a>
                </div>
                <div class="contact-item">
                    <span class="icon">💻</span>
                    <a href="https://github.com/yourusername" target="_blank">GitHub</a>
                </div>
            </div>
        `);
    }

    simulateNetworkScan() {
        const steps = [
            'INITIALIZING NETWORK SCAN...',
            'SCANNING PORT RANGE 1-1024...',
            'ANALYZING NETWORK TOPOLOGY...',
            'CHECKING SECURITY VULNERABILITIES...',
            'GENERATING SECURITY REPORT...'
        ];

        let i = 0;
        const interval = setInterval(() => {
            if (i < steps.length) {
                this.print(steps[i], 'scan-step');
                i++;
            } else {
                clearInterval(interval);
                this.print('SCAN COMPLETE. NO VULNERABILITIES DETECTED.', 'success');
            }
        }, 1000);
    }

    startMatrixRain() {
        const canvas = document.createElement('canvas');
        canvas.className = 'matrix-rain';
        document.body.appendChild(canvas);
        
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()';
        const fontSize = 14;
        const columns = canvas.width / fontSize;
        const drops = Array(Math.floor(columns)).fill(1);

        function draw() {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            ctx.fillStyle = '#0F0';
            ctx.font = fontSize + 'px monospace';
            
            for (let i = 0; i < drops.length; i++) {
                const text = chars[Math.floor(Math.random() * chars.length)];
                ctx.fillText(text, i * fontSize, drops[i] * fontSize);
                
                if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                    drops[i] = 0;
                }
                drops[i]++;
            }
        }

        const animation = setInterval(draw, 33);
        
        setTimeout(() => {
            clearInterval(animation);
            document.body.removeChild(canvas);
        }, 10000);
    }

    showAbout() {
        this.print(`
            <div class="about-section">
                <h2>SECURITY SPECIALIST // DEVELOPER</h2>
                <p>Specialized in cybersecurity, digital forensics, and secure application development.
                   Passionate about creating tools that enhance digital security and privacy.</p>
                <div class="stats">
                    <div class="stat-item">
                        <span class="stat-label">Projects Completed</span>
                        <span class="stat-value">15+</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Security Tools Developed</span>
                        <span class="stat-value">8</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Years Experience</span>
                        <span class="stat-value">5+</span>
                    </div>
                </div>
            </div>
        `);
    }

    clear() {
        this.output.innerHTML = '';
    }
}

// Initialize terminal when the page loads
document.addEventListener('DOMContentLoaded', () => {
    window.terminal = new HackerTerminal('terminal');
});
