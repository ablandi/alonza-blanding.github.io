package com.netrunner.controller;

import com.netrunner.service.PasswordAnalyzerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/password")
public class PasswordController {
    private final PasswordAnalyzerService analyzerService;

    @Autowired
    public PasswordController(PasswordAnalyzerService analyzerService) {
        this.analyzerService = analyzerService;
    }

    @PostMapping("/analyze")
    public ResponseEntity<Map<String, Object>> analyzePassword(@RequestBody Map<String, String> request) {
        String password = request.get("password");
        if (password == null || password.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok(analyzerService.analyzePassword(password));
    }
}
