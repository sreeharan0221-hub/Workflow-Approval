package com.approvalflow.model;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "workflow_rules")
public class WorkflowRule {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    private String type; // Standard, Fast-Track, Critical
    private String description;
    private String color; // UI theme color
    private String icon;  // Icon name for frontend

    @OneToMany(mappedBy = "workflowRule", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    @OrderBy("stepOrder ASC")
    private List<WorkflowStep> steps = new ArrayList<>();

    public WorkflowRule() {}

    public WorkflowRule(String title, String type, String description, String color, String icon) {
        this.title = title;
        this.type = type;
        this.description = description;
        this.color = color;
        this.icon = icon;
    }

    // Helper to add step
    public void addStep(String role, int timeout, int order) {
        WorkflowStep step = new WorkflowStep(role, timeout, order);
        step.setWorkflowRule(this);
        this.steps.add(step);
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getColor() { return color; }
    public void setColor(String color) { this.color = color; }

    public String getIcon() { return icon; }
    public void setIcon(String icon) { this.icon = icon; }

    public List<WorkflowStep> getSteps() { return steps; }
    public void setSteps(List<WorkflowStep> steps) { this.steps = steps; }
}
