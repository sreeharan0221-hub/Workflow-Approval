package com.approvalflow.service;

import com.approvalflow.repository.ApprovalRequestRepository;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class DashboardService {

    private final ApprovalRequestRepository requestRepository;

    public DashboardService(ApprovalRequestRepository requestRepository) {
        this.requestRepository = requestRepository;
    }

    /**
     * Get dashboard statistics: pending, approved, rejected, total counts.
     */
    public Map<String, Object> getStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("pending", requestRepository.countByStatus("Pending"));
        stats.put("approved", requestRepository.countByStatus("Approved"));
        stats.put("rejected", requestRepository.countByStatus("Rejected"));
        stats.put("total", requestRepository.count());
        return stats;
    }

    /**
     * Get monthly chart data for the bar chart.
     * Returns hardcoded demo data matching the original frontend.
     */
    public List<Map<String, Object>> getChartData() {
        List<Map<String, Object>> data = new ArrayList<>();
        data.add(Map.of("name", "Oct", "approved", 65, "rejected", 8, "pending", 12));
        data.add(Map.of("name", "Nov", "approved", 78, "rejected", 11, "pending", 15));
        data.add(Map.of("name", "Dec", "approved", 52, "rejected", 6, "pending", 10));
        data.add(Map.of("name", "Jan", "approved", 91, "rejected", 14, "pending", 20));
        data.add(Map.of("name", "Feb", "approved", 85, "rejected", 9, "pending", 18));
        data.add(Map.of("name", "Mar", "approved", 90, "rejected", 12, "pending", 28));
        return data;
    }

    /**
     * Get department distribution data for the pie chart.
     * Returns hardcoded demo data matching the original frontend.
     */
    public List<Map<String, Object>> getDepartmentData() {
        List<Map<String, Object>> data = new ArrayList<>();
        data.add(Map.of("name", "Engineering", "value", 35, "color", "#3b82f6"));
        data.add(Map.of("name", "Sales", "value", 22, "color", "#f59e0b"));
        data.add(Map.of("name", "Marketing", "value", 15, "color", "#8b5cf6"));
        data.add(Map.of("name", "Operations", "value", 18, "color", "#10b981"));
        data.add(Map.of("name", "Finance", "value", 10, "color", "#f43f5e"));
        return data;
    }
}
