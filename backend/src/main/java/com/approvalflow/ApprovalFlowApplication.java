package com.approvalflow;

import com.approvalflow.model.ApprovalRequest;
import com.approvalflow.model.WorkflowRule;
import com.approvalflow.repository.ApprovalRequestRepository;
import com.approvalflow.repository.WorkflowRuleRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import java.util.Arrays;

@SpringBootApplication
public class ApprovalFlowApplication {

    public static void main(String[] args) {
        SpringApplication.run(ApprovalFlowApplication.class, args);
    }

    @Bean
    public CorsFilter corsFilter() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowCredentials(true);
        config.setAllowedOrigins(Arrays.asList("http://localhost:5173", "http://localhost:3000", "http://localhost:8080"));
        config.setAllowedHeaders(Arrays.asList("*"));
        config.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return new CorsFilter(source);
    }

    @Bean
    public CommandLineRunner dataSeeder(ApprovalRequestRepository requestRepository,
                                        WorkflowRuleRepository workflowRuleRepository) {
        return args -> {
            seedWorkflowRules(workflowRuleRepository);
            seedSampleRequests(requestRepository);
            System.out.println("✅ Database seeded with demo data!");
        };
    }

    private void seedWorkflowRules(WorkflowRuleRepository workflowRuleRepository) {
        if (workflowRuleRepository.count() > 0) return;

        // 1. Infrastructure and Resources
        WorkflowRule infra = new WorkflowRule("Infrastructure and Resources 🏢", "Standard",
            "Hardware, software, and IT asset requests.", "emerald", "Building2");
        infra.addStep("Employee", 0, 0);
        infra.addStep("IT Helpdesk", 24, 1);
        infra.addStep("Managing Director", 0, 2);
        workflowRuleRepository.save(infra);

        // 2. Financial Approval
        WorkflowRule financial = new WorkflowRule("Financial Approval 💰", "Standard",
            "For budgets and expenses over ₹10,000.", "blue", "FileText");
        financial.addStep("Employee", 0, 0);
        financial.addStep("Team Leader", 48, 1);
        financial.addStep("Accountant", 24, 2);
        financial.addStep("CFO", 0, 3);
        workflowRuleRepository.save(financial);

        // 3. Hiring and Recruitment
        WorkflowRule hiring = new WorkflowRule("Hiring and Recruitment 👥", "Standard",
            "Standard recruitment requests for all departments.", "indigo", "Users");
        hiring.addStep("Employee", 0, 0);
        hiring.addStep("Team Leader", 48, 1);
        hiring.addStep("HR Team", 0, 2);
        workflowRuleRepository.save(hiring);

        // 4. Project Approval
        WorkflowRule project = new WorkflowRule("Project Approval 📊", "Standard",
            "New project initiations and milestone sign-offs.", "amber", "Target");
        project.addStep("Employee", 0, 0);
        project.addStep("Team Leader", 24, 1);
        project.addStep("CFO", 0, 2);
        workflowRuleRepository.save(project);

        // 5. Leave Approval
        WorkflowRule leave = new WorkflowRule("Leave Approval 🗓️", "Fast-Track",
            "Standard PTO, Sick leave, and HR queries.", "purple", "Calendar");
        leave.addStep("Employee", 0, 0);
        leave.addStep("Reporting Manager", 0, 1);
        workflowRuleRepository.save(leave);

        // 6. Emergency Approval
        WorkflowRule emergency = new WorkflowRule("Emergency Approval 🚨", "Critical",
            "High priority requests requiring immediate attention.", "rose", "AlertTriangle");
        emergency.addStep("Employee", 0, 0);
        emergency.addStep("Team Leader", 2, 1);
        emergency.addStep("Managing Director", 0, 2);
        workflowRuleRepository.save(emergency);
    }

    private void seedSampleRequests(ApprovalRequestRepository requestRepository) {
        if (requestRepository.count() > 0) return;

        String[] categories = {
            "Infrastructure and Resources 🏢",
            "Financial Approval 💰",
            "Hiring and Recruitment 👥",
            "Project Approval 📊"
        };
        String[] titles = {
            "Office Supplies Purchase", "Emergency Server Repair", "Laptop for New Hire",
            "Travel Reimbursement", "Software License", "Cloud Storage", "Team Lunch",
            "Marketing Ads", "Consulting Fee", "Hardware Repair"
        };
        String[] employees = {
            "Priya Sharma", "Rahul Verma", "Anita Desai", "Suresh Patel",
            "Deepak Kumar", "Meena Iyer", "Ravi Verma", "Kavya Singh"
        };
        String[] departments = {"Engineering", "Sales", "HR", "IT", "Marketing", "Finance", "Operations"};
        String[] admins = {"Manager", "Accountant", "CFO", "Managing Director"};

        // Generate 342 sample requests (matching original frontend count)
        for (int i = 0; i < 342; i++) {
            String status;
            double rand = Math.random();
            if (rand > 0.8) {
                status = "Pending";
            } else if (rand > 0.7) {
                status = "Rejected";
            } else {
                status = "Approved";
            }

            ApprovalRequest req = new ApprovalRequest(
                "REQ-" + (1000 + i),
                titles[i % titles.length],
                employees[i % employees.length],
                departments[i % departments.length],
                categories[(int)(Math.random() * categories.length)],
                "₹" + (int)(Math.random() * 50000 + 1000),
                "Auto generated request for demo purposes.",
                Math.random() > 0.95,
                status,
                "2026-0" + (int)(Math.random() * 3 + 1) + "-" + String.format("%02d", (int)(Math.random() * 28 + 1)),
                status.equals("Pending") ? admins[(int)(Math.random() * admins.length)] : "—"
            );

            requestRepository.save(req);
        }
    }
}

