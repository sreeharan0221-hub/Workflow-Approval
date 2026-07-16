package com.approvalflow.controller;

import com.approvalflow.model.ApprovalRequest;
import com.approvalflow.service.RequestService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/requests")
public class RequestController {

    private final RequestService requestService;

    public RequestController(RequestService requestService) {
        this.requestService = requestService;
    }

    /**
     * GET /api/requests?status=Pending
     * Get all requests, optionally filtered by status.
     */
    @GetMapping
    public ResponseEntity<List<ApprovalRequest>> getAllRequests(
            @RequestParam(required = false) String status) {
        return ResponseEntity.ok(requestService.getAllRequests(status));
    }

    /**
     * POST /api/requests
     * Create a new request with auto-routing.
     */
    @PostMapping
    public ResponseEntity<ApprovalRequest> createRequest(@RequestBody Map<String, Object> body) {
        ApprovalRequest request = requestService.createRequest(body);
        return ResponseEntity.ok(request);
    }

    /**
     * GET /api/requests/pending?role=CFO
     * Get pending requests for a specific approver role.
     */
    @GetMapping("/pending")
    public ResponseEntity<List<ApprovalRequest>> getPendingRequests(
            @RequestParam(defaultValue = "svhec") String role) {
        return ResponseEntity.ok(requestService.getPendingRequests(role));
    }

    /**
     * PUT /api/requests/{requestId}/approve
     */
    @PutMapping("/{requestId}/approve")
    public ResponseEntity<Map<String, Object>> approveRequest(@PathVariable String requestId) {
        boolean success = requestService.approveRequest(requestId);
        if (success) {
            return ResponseEntity.ok(Map.of("success", true, "message",
                "Request " + requestId + " has been successfully approved."));
        }
        return ResponseEntity.status(404).body(Map.of("success", false, "error", "Request not found"));
    }

    /**
     * PUT /api/requests/{requestId}/reject
     */
    @PutMapping("/{requestId}/reject")
    public ResponseEntity<Map<String, Object>> rejectRequest(@PathVariable String requestId) {
        boolean success = requestService.rejectRequest(requestId);
        if (success) {
            return ResponseEntity.ok(Map.of("success", true, "message",
                "Request " + requestId + " has been successfully rejected."));
        }
        return ResponseEntity.status(404).body(Map.of("success", false, "error", "Request not found"));
    }
}
