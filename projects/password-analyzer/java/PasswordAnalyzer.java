 /**
 * Password Analyzer Program
 * 
 * Purpose: This program evaluates the strength of passwords and provides feedback on how to make them more secure.
 * It checks various security criteria like length, character types, and common patterns that might make a password weak.
 * 
 * How it works:
 * 1. User provides a password
 * 2. Program checks multiple security criteria
 * 3. Program calculates a strength score (0-10)
 * 4. Program provides feedback and suggestions for improvement
 */

import java.util.ArrayList;
import java.util.List;
import java.util.regex.Pattern;

class PasswordAnalyzer {
    // These are the basic rules for passwords
    // MIN_LENGTH: Password must be at least this many characters
    // MAX_LENGTH: Password cannot be longer than this
    // SPECIAL_CHARS: List of special characters that make passwords stronger
    private static final int MIN_LENGTH = 8;
    private static final int MAX_LENGTH = 30;
    private static final String SPECIAL_CHARS = "!@#$%^&*(),.?\":{}|<>";

    /*
     * Password Strength Levels
     * 
     * This section defines different levels of password strength:
     * - CRITICAL (0-2): Very weak, easily crackable
     * - WEAK (3-4): Better but still not secure
     * - MODERATE (5-6): Acceptable for low-security needs
     * - STRONG (7-8): Good for most purposes
     * - MAXIMUM_SECURITY (9-10): Excellent, very hard to crack
     */
    public enum StrengthLevel {
        CRITICAL(0, 2, "Critical - Extremely vulnerable"),
        WEAK(3, 4, "Weak - Easy to crack"),
        MODERATE(5, 6, "Moderate - Average strength"),
        STRONG(7, 8, "Strong - Good protection"),
        MAXIMUM_SECURITY(9, 10, "Maximum Security - Excellent protection");

        private final int minScore;
        private final int maxScore;
        private final String description;

        StrengthLevel(int minScore, int maxScore, String description) {
            this.minScore = minScore;
            this.maxScore = maxScore;
            this.description = description;
        }

        public String getDescription() {
            return description;
        }

        public static StrengthLevel fromScore(int score) {
            for (StrengthLevel level : values()) {
                if (score >= level.minScore && score <= level.maxScore) {
                    return level;
                }
            }
            return CRITICAL;
        }
    }

    /*
     * Password Analysis Result Class
     * 
     * This class holds all the information about a password's analysis:
     * - score: Number from 0 to 10 indicating strength
     * - strength: The strength level (CRITICAL to MAXIMUM_SECURITY)
     * - metCriteria: List of security requirements that were met
     * - suggestions: List of ways to make the password stronger
     */
    public static class AnalysisResult {
        private final int score;
        private final StrengthLevel strength;
        private final List<String> metCriteria;
        private final List<String> suggestions;

        public AnalysisResult(int score, StrengthLevel strength, 
                            List<String> metCriteria, List<String> suggestions) {
            this.score = score;
            this.strength = strength;
            this.metCriteria = metCriteria;
            this.suggestions = suggestions;
        }

        public int getScore() { return score; }
        public StrengthLevel getStrength() { return strength; }
        public List<String> getMetCriteria() { return metCriteria; }
        public List<String> getSuggestions() { return suggestions; }

        @Override
        public String toString() {
            StringBuilder sb = new StringBuilder();
            sb.append("Password Analysis Result:\n");
            sb.append("Score: ").append(score).append("/10\n");
            sb.append("Strength: ").append(strength.getDescription()).append("\n\n");
            
            sb.append("Met Criteria:\n");
            for (String criterion : metCriteria) {
                sb.append("✓ ").append(criterion).append("\n");
            }
            
            if (!suggestions.isEmpty()) {
                sb.append("\nSuggestions for improvement:\n");
                for (String suggestion : suggestions) {
                    sb.append("- ").append(suggestion).append("\n");
                }
            }
            
            return sb.toString();
        }
    }

    /*
     * Main Password Analysis Method
     * 
     * This is the core function that evaluates a password's strength.
     * Steps:
     * 1. Check if password is empty or null
     * 2. Check length requirements
     * 3. Look for different types of characters (uppercase, lowercase, numbers, special)
     * 4. Check for patterns that might make it weak
     * 5. Calculate final score
     * 6. Generate helpful suggestions
     */
    public AnalysisResult analyzePassword(String password) {
        if (password == null || password.isEmpty()) {
            return new AnalysisResult(0, StrengthLevel.CRITICAL,
                    new ArrayList<>(), List.of("Password cannot be empty"));
        }

        List<String> metCriteria = new ArrayList<>();
        List<String> suggestions = new ArrayList<>();
        int score = 0;

        // Check length
        if (password.length() >= MIN_LENGTH && password.length() <= MAX_LENGTH) {
            metCriteria.add("Length requirement met (" + MIN_LENGTH + "-" + MAX_LENGTH + " characters)");
            score += 2;
        } else {
            suggestions.add("Password should be between " + MIN_LENGTH + " and " + MAX_LENGTH + " characters");
        }

        // Check for uppercase letters
        if (Pattern.compile("[A-Z]").matcher(password).find()) {
            metCriteria.add("Contains uppercase letters");
            score++;
        } else {
            suggestions.add("Add uppercase letters");
        }

        // Check for lowercase letters
        if (Pattern.compile("[a-z]").matcher(password).find()) {
            metCriteria.add("Contains lowercase letters");
            score++;
        } else {
            suggestions.add("Add lowercase letters");
        }

        // Check for numbers
        if (Pattern.compile("\\d").matcher(password).find()) {
            metCriteria.add("Contains numbers");
            score++;
        } else {
            suggestions.add("Add numbers");
        }

        // Check for special characters
        if (Pattern.compile("[" + Pattern.quote(SPECIAL_CHARS) + "]").matcher(password).find()) {
            metCriteria.add("Contains special characters");
            score++;
        } else {
            suggestions.add("Add special characters");
        }

        // Check for repeating characters
        if (!Pattern.compile("(.)\\1{2,}").matcher(password).find()) {
            metCriteria.add("No repeating characters");
            score++;
        } else {
            suggestions.add("Avoid repeating characters");
        }

        // Check for sequential patterns
        if (!hasSequentialPatterns(password)) {
            metCriteria.add("No sequential patterns");
            score++;
        } else {
            suggestions.add("Avoid sequential patterns (e.g., abc, 123)");
        }

        // Check for common patterns
        if (!hasCommonPatterns(password)) {
            metCriteria.add("No common patterns");
            score += 2;
        } else {
            suggestions.add("Avoid common patterns and dictionary words");
        }

        return new AnalysisResult(score, StrengthLevel.fromScore(score), metCriteria, suggestions);
    }

    /*
     * Pattern Detection: Sequential Characters
     * 
     * This function looks for easy-to-guess sequences like:
     * - "abc", "123" (forward sequences)
     * - "cba", "321" (backward sequences)
     * 
     * Examples of sequences to catch:
     * - "password123" (has "123")
     * - "abcdef" (has "abc")
     * - "321password" (has "321")
     */
    private boolean hasSequentialPatterns(String password) {
        String lowerPass = password.toLowerCase();
        String sequences = "abcdefghijklmnopqrstuvwxyz0123456789";
        
        for (int i = 0; i < sequences.length() - 2; i++) {
            String forward = sequences.substring(i, i + 3);
            String reverse = new StringBuilder(forward).reverse().toString();
            if (lowerPass.contains(forward) || lowerPass.contains(reverse)) {
                return true;
            }
        }
        return false;
    }

    /*
     * Pattern Detection: Common Passwords
     * 
     * This function checks if the password contains common words or patterns
     * that hackers often try first, such as:
     * - "password"
     * - "admin"
     * - "qwerty"
     * - Other frequently used passwords
     * 
     * Even if these words are part of a longer password, they make it weaker
     * because hackers have special tools to look for these patterns.
     */
    private boolean hasCommonPatterns(String password) {
        String lowerPass = password.toLowerCase();
        String[] commonPatterns = {
            "password", "123456", "qwerty", "admin", "letmein",
            "welcome", "monkey", "dragon", "master", "hello"
        };
        
        for (String pattern : commonPatterns) {
            if (lowerPass.contains(pattern)) {
                return true;
            }
        }
        return false;
    }

    /*
     * Program Testing
     * 
     * This section demonstrates how the password analyzer works by testing
     * different types of passwords:
     * - Common weak passwords
     * - Strong passwords with mixed characters
     * - Passwords with numbers and special characters
     * - Short and long passwords
     * 
     * Each test shows:
     * - The password being tested
     * - Its strength score
     * - What makes it strong or weak
     * - How to improve it
     */
    public static void main(String[] args) {
        PasswordAnalyzer analyzer = new PasswordAnalyzer();
        
        // Test some passwords
        String[] testPasswords = {
            "password123",
            "Cyb3rPunk#2077",
            "abc123",
            "StrongP@ssw0rd!",
            "qwerty",
            "H4ck3r_Pr0t0c0l"
        };

        for (String password : testPasswords) {
            System.out.println("\nTesting password: " + password);
            System.out.println("----------------------------------------");
            AnalysisResult result = analyzer.analyzePassword(password);
            System.out.println(result);
        }
    }
}
