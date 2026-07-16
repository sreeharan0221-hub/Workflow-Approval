package com.approvalflow.controller;

import com.approvalflow.model.WorkflowRule;
import com.approvalflow.service.WorkflowService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/workflows")
public class WorkflowController {

    private final WorkflowService workflowService;

    public WorkflowController(WorkflowService workflowService) {
        this.workflowService = workflowService;
    }

    /**
     * GET /api/workflows
     * Get all workflow rules with steps.
     */
    @GetMapping
    public ResponseEntity<List<WorkflowRule>> getAllWorkflows() {
        return ResponseEntity.ok(workflowService.getAllWorkflows());
    }

    /**
     * PUT /api/workflows/{id}
     * Update workflow steps and SLA configuration.
     * Body: { "steps": [{ "role": "...", "timeout": N }, ...] }
     */
    @PutMapping("/{id}")
    public ResponseEntity<WorkflowRule> updateWorkflow(
            @PathVariable Long id,
            @RequestBody Map<String, Object> body) {
        WorkflowRule updated = workflowService.updateWorkflow(id, body);
        return ResponseEntity.ok(updated);
    }
}
