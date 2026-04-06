package com.online_clipboard_backend.controller;

import com.online_clipboard_backend.repository.ClipRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class HealthCheckupController {

    private final ClipRepository clipRepository;

    @GetMapping("/health-check")
    public String healthCheck() {
        // Poking the database to wake it up if it's sleeping (common in free-tier DBs)
        clipRepository.count(); 
        return "Server and Database are running";
    }

}
