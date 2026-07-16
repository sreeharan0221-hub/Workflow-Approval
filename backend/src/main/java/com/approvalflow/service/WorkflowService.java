package com.approvalflow.service;

import com.approvalflow.model.WorkflowRule;
import com.approvalflow.model.WorkflowStep;
import com.approvalflow.repository.WorkflowRuleRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class WorkflowService {

    private final WorkflowRuleRepository workflowRuleRepository;

    public WorkflowService(WorkflowRuleRepository workflowRuleRepository) {
        this.workflowRuleRepository = workflowRuleRepository;
    }

    /**
     * Get all workflow rules with their steps.
     */
    public List<WorkflowRule> getAllWorkflows() {
        return workflowRuleRepository.findAll();
    }

    /**
     * Update workflow steps and SLA configuration.
     */
    @Transactional
    @SuppressWarnings("unchecked")
    public WorkflowRule updateWorkflow(Long id, Map<String, Object> data) {
        Optional<WorkflowRule> opt = workflowRuleRepository.findById(id);
        if (opt.isEmpty()) {
            throw new RuntimeException("Workflow rule not found with id: " + id);
        }

        WorkflowRule rule = opt.get();

        // Clear existing steps
        rule.getSteps().clear();

        // Add new steps from the request body
        List<Map<String, Object>> stepsData = (List<Map<String, Object>>) data.get("steps");
        if (stepsData != null) {
            for (int i = 0; i < stepsData.size(); i++) {
                Map<String, Object> stepData = stepsData.get(i);
                String role = (String) stepData.get("role");
                int timeout = stepData.get("timeout") instanceof Number
                    ? ((Number) stepData.get("timeout")).intValue() : 0;

                WorkflowStep step = new WorkflowStep(role, timeout, i);
                step.setWorkflowRule(rule);
                rule.getSteps().add(step);
            }
        }

        return workflowRuleRepository.save(rule);
    }
}
