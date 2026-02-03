package com.smarttrack.controller;

import com.smarttrack.dto.DashboardOverview;

import com.smarttrack.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class DashboardController {
    
    private final DashboardService dashboardService;
    
    @GetMapping("/overview")
    public ResponseEntity<DashboardOverview> getDashboardOverview() {
        DashboardOverview overview = dashboardService.getDashboardOverview();
        return ResponseEntity.ok(overview);
    }
}
