package com.approvalflow.model;

import jakarta.persistence.*;

@Entity
@Table(name = "approval_requests")
public class ApprovalRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String requestId; // e.g. REQ-12345

    @Column(nullable = false)
    private String title;

    private String requester;
    private String department;
    private String category;
    private String amount;

    @Column(length = 2000)
    private String description;

    private boolean isEmergency;

    @Column(nullable = false)
    private String status; // Pending, Approved, Rejected

    private String date;
    private String pendingWith; // Current approver role

    public ApprovalRequest() {}

    public ApprovalRequest(String requestId, String title, String requester, String department,
                           String category, String amount, String description, boolean isEmergency,
                           String status, String date, String pendingWith) {
        this.requestId = requestId;
        this.title = title;
        this.requester = requester;
        this.department = department;
        this.category = category;
        this.amount = amount;
        this.description = description;
        this.isEmergency = isEmergency;
        this.status = status;
        this.date = date;
        this.pendingWith = pendingWith;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getRequestId() { return requestId; }
    public void setRequestId(String requestId) { this.requestId = requestId; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getRequester() { return requester; }
    public void setRequester(String requester) { this.requester = requester; }

    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getAmount() { return amount; }
    public void setAmount(String amount) { this.amount = amount; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public boolean getIsEmergency() { return isEmergency; }
    public void setIsEmergency(boolean isEmergency) { this.isEmergency = isEmergency; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getDate() { return date; }
    public void setDate(String date) { this.date = date; }

    public String getPendingWith() { return pendingWith; }
    public void setPendingWith(String pendingWith) { this.pendingWith = pendingWith; }
}
