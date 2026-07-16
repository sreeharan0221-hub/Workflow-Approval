package com.approvalflow.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

@Entity
@Table(name = "workflow_steps")
public class WorkflowStep {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String role;

    private int timeout; // SLA escalation hours (0 = no timeout)

    private int stepOrder;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "workflow_rule_id")
    @JsonIgnore
    private WorkflowRule workflowRule;

    public WorkflowStep() {}

    public WorkflowStep(String role, int timeout, int stepOrder) {
        this.role = role;
        this.timeout = timeout;
        this.stepOrder = stepOrder;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public int getTimeout() { return timeout; }
    public void setTimeout(int timeout) { this.timeout = timeout; }

    public int getStepOrder() { return stepOrder; }
    public void setStepOrder(int stepOrder) { this.stepOrder = stepOrder; }

    public WorkflowRule getWorkflowRule() { return workflowRule; }
    public void setWorkflowRule(WorkflowRule workflowRule) { this.workflowRule = workflowRule; }
}
