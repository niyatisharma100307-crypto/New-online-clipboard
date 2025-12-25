package com.online_clipboard_backend.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HealthCheckupController {

    @GetMapping("/health-check")
    public String healthCheck() {
        return "Server is running";
    }

}
