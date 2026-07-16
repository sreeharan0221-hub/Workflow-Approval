package com.approvalflow.controller;

import com.approvalflow.model.User;
import com.approvalflow.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final AuthService authService;

    public UserController(AuthService authService) {
        this.authService = authService;
    }

    /**
     * GET /api/users/pending
     * Get all users with Pending status.
     */
    @GetMapping("/pending")
    public ResponseEntity<List<User>> getPendingUsers() {
        return ResponseEntity.ok(authService.getPendingUsers());
    }

    /**
     * PUT /api/users/{username}/approve
     */
    @PutMapping("/{username}/approve")
    public ResponseEntity<Map<String, Object>> approveUser(@PathVariable String username) {
        boolean success = authService.approveUser(username);
        if (success) {
            return ResponseEntity.ok(Map.of("success", true, "message", "User " + username + " approved."));
        }
        return ResponseEntity.status(404).body(Map.of("success", false, "error", "User not found"));
    }

    /**
     * PUT /api/users/{username}/reject
     */
    @PutMapping("/{username}/reject")
    public ResponseEntity<Map<String, Object>> rejectUser(@PathVariable String username) {
        boolean success = authService.rejectUser(username);
        if (success) {
            return ResponseEntity.ok(Map.of("success", true, "message", "User " + username + " rejected."));
        }
        return ResponseEntity.status(404).body(Map.of("success", false, "error", "User not found"));
    }
}
