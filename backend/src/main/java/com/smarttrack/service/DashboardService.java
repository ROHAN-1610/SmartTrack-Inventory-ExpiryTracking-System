package com.smarttrack.service;

import com.smarttrack.dto.DashboardOverview;
import com.smarttrack.entity.Category;
import com.smarttrack.entity.InventoryBatch;
import com.smarttrack.repository.CategoryRepository;
import com.smarttrack.repository.InventoryBatchRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.TextStyle;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DashboardService {
    
    private final InventoryBatchRepository batchRepository;
    private final CategoryRepository categoryRepository;
    
    public DashboardOverview getDashboardOverview() {
        LocalDate today = LocalDate.now();
        LocalDate nearExpiryDate = today.plusDays(30);
        
        // Get metrics
        Long totalStock = batchRepository.countActiveBatches();
        Double inventoryValue = batchRepository.getTotalInventoryValue();
        Long expiredCount = batchRepository.countExpiredBatches(today);
        Long nearExpiryCount = batchRepository.countNearExpiryBatches(today, nearExpiryDate);
        
        // System status
        String systemStatus = expiredCount > 0 ? "CRITICAL" : 
                             nearExpiryCount > 0 ? "WARNING" : "HEALTHY";
        
        // Expiry forecast for next 6 months
        List<DashboardOverview.ExpiryForecast> forecast = generateExpiryForecast();
        
        // Stock distribution by category
        Map<String, DashboardOverview.StockDistribution> distribution = getStockDistribution();
        
        return new DashboardOverview(
                totalStock != null ? totalStock : 0L,
                inventoryValue != null ? inventoryValue : 0.0,
                nearExpiryCount != null ? nearExpiryCount : 0L,
                expiredCount != null ? expiredCount : 0L,
                systemStatus,
                forecast,
                distribution
        );
    }
    
    private List<DashboardOverview.ExpiryForecast> generateExpiryForecast() {
        List<DashboardOverview.ExpiryForecast> forecast = new ArrayList<>();
        LocalDate today = LocalDate.now();
        
        for (int i = 0; i < 6; i++) {
            LocalDate monthStart = today.plusMonths(i).withDayOfMonth(1);
            LocalDate monthEnd = monthStart.plusMonths(1).minusDays(1);
            
            List<InventoryBatch> batches = batchRepository.findBatchesExpiringBetween(monthStart, monthEnd);
            long expiryVolume = batches.size();
            
            String monthName = monthStart.getMonth().getDisplayName(TextStyle.SHORT, Locale.ENGLISH);
            forecast.add(new DashboardOverview.ExpiryForecast(monthName, expiryVolume));
        }
        
        return forecast;
    }
    
    private Map<String, DashboardOverview.StockDistribution> getStockDistribution() {
        List<Category> categories = categoryRepository.findAll();
        List<InventoryBatch> allBatches = batchRepository.findAllActiveBatchesOrderedByExpiry();
        
        Map<String, DashboardOverview.StockDistribution> distribution = new HashMap<>();
        
        for (Category category : categories) {
            List<InventoryBatch> categoryBatches = allBatches.stream()
                    .filter(b -> b.getProduct().getCategory() != null && 
                               b.getProduct().getCategory().getId().equals(category.getId()))
                    .collect(Collectors.toList());
            
            long count = categoryBatches.size();
            double value = categoryBatches.stream()
                    .mapToDouble(b -> b.getQuantity() * (b.getUnitPrice() != null ? b.getUnitPrice().doubleValue() : 0))
                    .sum();
            
            distribution.put(category.getName(), 
                    new DashboardOverview.StockDistribution(
                            category.getName(), 
                            count, 
                            value, 
                            category.getColor()
                    )
            );
        }
        
        return distribution;
    }
}
