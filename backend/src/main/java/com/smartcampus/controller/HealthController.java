package com.smartcampus.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/health")
public class HealthController {

    @GetMapping
    public Map<String, Object> getHealthStatus() {
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Backend running");
        return response;
    }
}