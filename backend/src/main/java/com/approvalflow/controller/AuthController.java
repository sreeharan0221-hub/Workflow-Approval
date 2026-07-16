package com.approvalflow.controller;

import com.approvalflow.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    /**
     * POST /api/auth/login
     * Body: { "username": "...", "password": "..." }
     */
    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody Map<String, String> body) {
        String username = body.get("username");
        String password = body.get("password");

        Map<String, Object> result = authService.login(username, password);

        if (Boolean.TRUE.equals(result.get("success"))) {
            return ResponseEntity.ok(result);
        }
        return ResponseEntity.status(401).body(result);
    }

    /**
     * POST /api/auth/register
     * Body: { "username": "...", "password": "...", "role": "..." }
     */
    @PostMapping("/register")
    public ResponseEntity<Map<String, Object>> register(@RequestBody Map<String, String> body) {
        String username = body.get("username");
        String password = body.get("password");
        String role = body.getOrDefault("role", "Employee");

        Map<String, Object> result = authService.register(username, password, role);

        if (Boolean.TRUE.equals(result.get("success"))) {
            return ResponseEntity.ok(result);
        }
        return ResponseEntity.status(409).body(result);
    }
}
