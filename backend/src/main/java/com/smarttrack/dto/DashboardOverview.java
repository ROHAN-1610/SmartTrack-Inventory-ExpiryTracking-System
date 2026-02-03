package com.smarttrack.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DashboardOverview {
    private Long totalStock;
    private Double inventoryValue;
    private Long nearExpiryCount;
    private Long expiredCount;
    private String systemStatus;
    private List<ExpiryForecast> expiryForecast;
    private Map<String, StockDistribution> stockDistribution;
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ExpiryForecast {
        private String month;
        private Long expiryVolume;
    }
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class StockDistribution {
        private String category;
        private Long count;
        private Double value;
        private String color;
    }
}
