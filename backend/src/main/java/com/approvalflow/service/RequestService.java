package com.approvalflow.service;

import com.approvalflow.model.ApprovalRequest;
import com.approvalflow.repository.ApprovalRequestRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class RequestService {

    private final ApprovalRequestRepository requestRepository;

    public RequestService(ApprovalRequestRepository requestRepository) {
        this.requestRepository = requestRepository;
    }

    /**
     * Get all requests, optionally filtered by status.
     */
    public List<ApprovalRequest> getAllRequests(String status) {
        if (status != null && !status.isEmpty()) {
            return requestRepository.findByStatus(status);
        }
        return requestRepository.findAllByOrderByIdDesc();
    }

    /**
     * Get pending requests for a specific approver role.
     * If role is "svhec" (super admin), return ALL pending requests.
     */
    public List<ApprovalRequest> getPendingRequests(String role) {
        if ("svhec".equals(role) || "Super Admin".equals(role)) {
            return requestRepository.findByStatus("Pending");
        }
        return requestRepository.findByPendingWithAndStatus(role, "Pending");
    }

    /**
     * Create a new approval request with auto-routing logic.
     * Migrated from NewRequest.tsx frontend logic.
     */
    public ApprovalRequest createRequest(Map<String, Object> data) {
        String title = (String) data.get("title");
        String requester = (String) data.getOrDefault("requester", "Employee User");
        String department = (String) data.get("department");
        String category = (String) data.get("category");
        String amount = (String) data.getOrDefault("amount", "N/A");
        String description = (String) data.getOrDefault("description", "");
        boolean isEmergency = Boolean.TRUE.equals(data.get("isEmergency"));

        // ==========================================
        // SMART AUTO-ROUTING LOGIC (from frontend)
        // ==========================================
        String assignedAdmin = "Manager"; // Default

        if (isEmergency) {
            assignedAdmin = "Managing Director";
        } else if (category != null) {
            if (category.contains("Financial")) {
                // Parse amount for routing decision
                try {
                    String cleanAmount = amount.replaceAll("[^0-9.]", "");
                    double numericAmount = cleanAmount.isEmpty() ? 0 : Double.parseDouble(cleanAmount);
                    assignedAdmin = numericAmount > 50000 ? "CFO" : "Accountant";
                } catch (NumberFormatException e) {
                    assignedAdmin = "Accountant";
                }
            } else if (category.contains("Infrastructure")) {
                assignedAdmin = "Managing Director";
            } else if (category.contains("Hiring") || category.contains("Project") || category.contains("Leave")) {
                assignedAdmin = "Manager";
            }
        }

        // Generate unique request ID
        String requestId = "REQ-" + (10000 + (int)(Math.random() * 90000));

        ApprovalRequest request = new ApprovalRequest(
            requestId,
            title,
            requester,
            department,
            category,
            amount,
            description,
            isEmergency,
            "Pending",
            LocalDate.now().toString(),
            assignedAdmin
        );

        return requestRepository.save(request);
    }

    /**
     * Approve a request by its request ID string.
     */
    public boolean approveRequest(String requestId) {
        Optional<ApprovalRequest> opt = requestRepository.findByRequestId(requestId);
        if (opt.isPresent()) {
            ApprovalRequest req = opt.get();
            req.setStatus("Approved");
            req.setPendingWith("—");
            requestRepository.save(req);
            return true;
        }
        return false;
    }

    /**
     * Reject a request by its request ID string.
     */
    public boolean rejectRequest(String requestId) {
        Optional<ApprovalRequest> opt = requestRepository.findByRequestId(requestId);
        if (opt.isPresent()) {
            ApprovalRequest req = opt.get();
            req.setStatus("Rejected");
            req.setPendingWith("—");
            requestRepository.save(req);
            return true;
        }
        return false;
    }
}
