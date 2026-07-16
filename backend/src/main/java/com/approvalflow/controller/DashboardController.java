package com.approvalflow.controller;

import com.approvalflow.service.DashboardService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    /**
     * GET /api/dashboard/stats
     * Returns { pending: N, approved: N, rejected: N, total: N }
     */
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getStats() {
        return ResponseEntity.ok(dashboardService.getStats());
    }

    /**
     * GET /api/dashboard/chart-data
     * Returns monthly bar chart data.
     */
    @GetMapping("/chart-data")
    public ResponseEntity<List<Map<String, Object>>> getChartData() {
        return ResponseEntity.ok(dashboardService.getChartData());
    }

    /**
     * GET /api/dashboard/department-data
     * Returns department distribution pie chart data.
     */
    @GetMapping("/department-data")
    public ResponseEntity<List<Map<String, Object>>> getDepartmentData() {
        return ResponseEntity.ok(dashboardService.getDepartmentData());
    }
}
