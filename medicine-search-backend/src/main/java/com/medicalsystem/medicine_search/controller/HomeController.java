package com.medicalsystem.medicine_search.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HomeController {

    @GetMapping("/api")
    public String home() {
        return "Medicine Search Backend is Running Successfully!";
    }

    @GetMapping("/api/health")
    public String healthCheck() {
        return "API is working fine!";
    }
}
