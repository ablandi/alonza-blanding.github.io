package com.netrunner.service;

import org.passay.*;
import org.springframework.stereotype.Service;
import java.util.*;

@Service
public class PasswordAnalyzerService {
    private final PasswordValidator validator;

    public PasswordAnalyzerService() {
        List<Rule> rules = Arrays.asList(
            new LengthRule(8, 30),
            new CharacterRule(EnglishCharacterData.UpperCase, 1),
            new CharacterRule(EnglishCharacterData.LowerCase, 1),
            new CharacterRule(EnglishCharacterData.Digit, 1),
            new CharacterRule(EnglishCharacterData.Special, 1),
            new WhitespaceRule(),
            new IllegalSequenceRule(EnglishSequenceData.Alphabetical, 5, false),
            new IllegalSequenceRule(EnglishSequenceData.Numerical, 5, false),
            new IllegalSequenceRule(EnglishSequenceData.USQwerty, 5, false)
        );
        this.validator = new PasswordValidator(rules);
    }

    public Map<String, Object> analyzePassword(String password) {
        Map<String, Object> result = new HashMap<>();
        RuleResult validationResult = validator.validate(new PasswordData(password));
        
        // Calculate strength score
        int score = calculateStrengthScore(password);
        
        result.put("valid", validationResult.isValid());
        result.put("score", score);
        result.put("strength", getStrengthLabel(score));
        result.put("suggestions", validator.getMessages(validationResult));
        
        // Add detailed analysis
        Map<String, Boolean> criteria = new HashMap<>();
        criteria.put("length", password.length() >= 8);
        criteria.put("uppercase", password.matches(".*[A-Z].*"));
        criteria.put("lowercase", password.matches(".*[a-z].*"));
        criteria.put("numbers", password.matches(".*\\d.*"));
        criteria.put("special", password.matches(".*[!@#$%^&*(),.?\":{}|<>].*"));
        
        result.put("criteria", criteria);
        
        return result;
    }

    private int calculateStrengthScore(String password) {
        int score = 0;
        
        // Length contribution
        score += Math.min(10, password.length() / 2);
        
        // Character variety contribution
        if (password.matches(".*[A-Z].*")) score += 2;
        if (password.matches(".*[a-z].*")) score += 2;
        if (password.matches(".*\\d.*")) score += 2;
        if (password.matches(".*[!@#$%^&*(),.?\":{}|<>].*")) score += 4;
        
        // Deduct for patterns
        if (password.matches(".*(.+)\\1+.*")) score -= 2; // Repeated sequences
        if (password.matches(".*(?i)(password|admin|user).*")) score -= 3; // Common words
        if (password.matches(".*(?i)(123|abc).*")) score -= 2; // Common sequences
        
        return Math.max(0, Math.min(10, score));
    }

    private String getStrengthLabel(int score) {
        if (score >= 9) return "MAXIMUM SECURITY";
        if (score >= 7) return "STRONG";
        if (score >= 5) return "MODERATE";
        if (score >= 3) return "WEAK";
        return "CRITICAL";
    }
}
