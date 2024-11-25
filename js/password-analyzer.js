class PasswordAnalyzer {
    constructor() {
        this.strengthLevels = {
            CRITICAL: { score: 2, color: '#ff0000' },
            WEAK: { score: 4, color: '#ff4400' },
            MODERATE: { score: 6, color: '#ffaa00' },
            STRONG: { score: 8, color: '#00cc00' },
            MAXIMUM_SECURITY: { score: 10, color: '#00ff00' }
        };
    }

    analyzePassword(password) {
        const criteria = {
            length: password.length >= 8 && password.length <= 30,
            uppercase: /[A-Z]/.test(password),
            lowercase: /[a-z]/.test(password),
            numbers: /\d/.test(password),
            special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
            noCommonPatterns: !this.hasCommonPatterns(password),
            noRepeatingChars: !(/(.)\1{2,}/.test(password)),
            noSequential: !this.hasSequentialPatterns(password)
        };

        const score = this.calculateScore(criteria);
        const strength = this.getStrengthLabel(score);
        const suggestions = this.generateSuggestions(criteria);

        return {
            score,
            strength,
            criteria,
            suggestions
        };
    }

    hasCommonPatterns(password) {
        const commonPatterns = [
            'password', '123456', 'qwerty', 'admin',
            'letmein', 'welcome', 'monkey', 'dragon'
        ];
        return commonPatterns.some(pattern => 
            password.toLowerCase().includes(pattern));
    }

    hasSequentialPatterns(password) {
        const sequences = [
            'abcdefghijklmnopqrstuvwxyz',
            '0123456789',
            'qwertyuiop',
            'asdfghjkl',
            'zxcvbnm'
        ];
        
        const lowercasePassword = password.toLowerCase();
        for (let seq of sequences) {
            for (let i = 0; i < seq.length - 2; i++) {
                const pattern = seq.slice(i, i + 3);
                if (lowercasePassword.includes(pattern)) {
                    return true;
                }
            }
        }
        return false;
    }

    calculateScore(criteria) {
        let score = 0;
        
        // Base criteria
        if (criteria.length) score += 2;
        if (criteria.uppercase) score += 1;
        if (criteria.lowercase) score += 1;
        if (criteria.numbers) score += 1;
        if (criteria.special) score += 1;
        
        // Advanced criteria
        if (criteria.noCommonPatterns) score += 2;
        if (criteria.noRepeatingChars) score += 1;
        if (criteria.noSequential) score += 1;

        return Math.min(10, score);
    }

    getStrengthLabel(score) {
        if (score >= 9) return 'MAXIMUM_SECURITY';
        if (score >= 7) return 'STRONG';
        if (score >= 5) return 'MODERATE';
        if (score >= 3) return 'WEAK';
        return 'CRITICAL';
    }

    generateSuggestions(criteria) {
        const suggestions = [];
        
        if (!criteria.length) {
            suggestions.push('Use 8-30 characters');
        }
        if (!criteria.uppercase) {
            suggestions.push('Add uppercase letters');
        }
        if (!criteria.lowercase) {
            suggestions.push('Add lowercase letters');
        }
        if (!criteria.numbers) {
            suggestions.push('Include numbers');
        }
        if (!criteria.special) {
            suggestions.push('Add special characters (!@#$%^&*(),.?":{}|<>)');
        }
        if (!criteria.noCommonPatterns) {
            suggestions.push('Avoid common words and patterns');
        }
        if (!criteria.noRepeatingChars) {
            suggestions.push('Avoid repeating characters (e.g., "aaa")');
        }
        if (!criteria.noSequential) {
            suggestions.push('Avoid sequential patterns (e.g., "abc", "123")');
        }

        return suggestions;
    }
}
