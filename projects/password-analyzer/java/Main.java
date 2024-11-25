import java.util.ArrayList;
import java.util.List;
import java.util.regex.Pattern;

class PasswordAnalyzer {
    private static final int MIN_LENGTH = 8;
    private static final int MAX_LENGTH = 30;
    private static final String SPECIAL_CHARS = "!@#$%^&*(),.?\":{}|<>";

    enum StrengthLevel {
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

    static class AnalysisResult {
        private final int score;
        private final StrengthLevel strength;
        private final List<String> metCriteria;
        private final List<String> suggestions;

        public AnalysisResult(int score, StrengthLevel strength, List<String> metCriteria, List<String> suggestions) {
            this.score = score;
            this.strength = strength;
            this.metCriteria = metCriteria;
            this.suggestions = suggestions;
        }

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

    public AnalysisResult analyzePassword(String password) {
        if (password == null || password.isEmpty()) {
            return new AnalysisResult(0, StrengthLevel.CRITICAL,
                    new ArrayList<>(), List.of("Password cannot be empty"));
        }

        List<String> metCriteria = new ArrayList<>();
        List<String> suggestions = new ArrayList<>();
        int score = 0;

        if (password.length() >= MIN_LENGTH && password.length() <= MAX_LENGTH) {
            metCriteria.add("Length requirement met (" + MIN_LENGTH + "-" + MAX_LENGTH + " characters)");
            score += 2;
        } else {
            suggestions.add("Password should be between " + MIN_LENGTH + " and " + MAX_LENGTH + " characters");
        }

        if (Pattern.compile("[A-Z]").matcher(password).find()) {
            metCriteria.add("Contains uppercase letters");
            score++;
        } else {
            suggestions.add("Add uppercase letters");
        }

        if (Pattern.compile("[a-z]").matcher(password).find()) {
            metCriteria.add("Contains lowercase letters");
            score++;
        } else {
            suggestions.add("Add lowercase letters");
        }

        if (Pattern.compile("\\d").matcher(password).find()) {
            metCriteria.add("Contains numbers");
            score++;
        } else {
            suggestions.add("Add numbers");
        }

        if (Pattern.compile("[" + Pattern.quote(SPECIAL_CHARS) + "]").matcher(password).find()) {
            metCriteria.add("Contains special characters");
            score++;
        } else {
            suggestions.add("Add special characters");
        }

        if (!Pattern.compile("(.)\\1{2,}").matcher(password).find()) {
            metCriteria.add("No repeating characters");
            score++;
        } else {
            suggestions.add("Avoid repeating characters");
        }

        if (!hasSequentialPatterns(password)) {
            metCriteria.add("No sequential patterns");
            score++;
        } else {
            suggestions.add("Avoid sequential patterns (e.g., abc, 123)");
        }

        if (!hasCommonPatterns(password)) {
            metCriteria.add("No common patterns");
            score += 2;
        } else {
            suggestions.add("Avoid common patterns and dictionary words");
        }

        return new AnalysisResult(score, StrengthLevel.fromScore(score), metCriteria, suggestions);
    }

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
}

public class Main {
    public static void main(String[] args) {
        PasswordAnalyzer analyzer = new PasswordAnalyzer();
        
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
            PasswordAnalyzer.AnalysisResult result = analyzer.analyzePassword(password);
            System.out.println(result);
        }
    }
}