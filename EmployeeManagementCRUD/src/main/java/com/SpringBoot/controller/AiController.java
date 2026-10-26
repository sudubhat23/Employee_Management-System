package com.SpringBoot.controller;

import com.SpringBoot.service.AiService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/ai")
@CrossOrigin(origins = "*", allowedHeaders = "*")
@Tag(name = "AI Workforce Assistant API", description = "Endpoints for AI-powered chat, employee profile intelligence, and HR policy guidance")
public class AiController {

    @Autowired
    private AiService aiService;

    @Operation(summary = "Ask AI Assistant for employee details, workforce analytics, or HR queries")
    @PostMapping("/chat")
    public ResponseEntity<Map<String, Object>> chat(@RequestBody Map<String, Object> request) {
        String prompt = (String) request.getOrDefault("prompt", "");
        @SuppressWarnings("unchecked")
        List<Map<String, String>> history = (List<Map<String, String>>) request.get("history");

        Map<String, Object> response = aiService.processChat(prompt, history);
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "Generate AI summary and growth analysis for a specific employee")
    @GetMapping("/employee/{id}/insights")
    public ResponseEntity<Map<String, Object>> getEmployeeInsights(@PathVariable Integer id) {
        Map<String, Object> summary = aiService.getEmployeeAiSummary(id);
        return ResponseEntity.ok(summary);
    }
}
