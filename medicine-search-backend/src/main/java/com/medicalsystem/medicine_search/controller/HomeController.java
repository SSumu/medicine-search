package com.medicalsystem.medicine_search.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HomeController {

    @GetMapping("/")
    public String home() {
        return "http://localhost:8080/api/swagger-ui/index.html";
    }

    @GetMapping("/api/health")
    public String healthCheck() {
        return "API is working fine!";
    }
}
