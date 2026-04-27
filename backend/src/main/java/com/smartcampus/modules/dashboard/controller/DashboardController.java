package com.smartcampus.modules.dashboard.controller;

import com.smartcampus.modules.dashboard.dto.DashboardSummaryResponse;
import com.smartcampus.modules.dashboard.service.DashboardService;
import com.smartcampus.shared.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/summary")
    public ResponseEntity<ApiResponse<DashboardSummaryResponse>> getDashboardSummary(
            @AuthenticationPrincipal String email) {
        try {
            DashboardSummaryResponse summary = dashboardService.getUserDashboardSummary(email);
            return ResponseEntity.ok(new ApiResponse<>(true, "Dashboard summary fetched successfully", summary));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, e.getMessage(), null));
        }
    }
}
