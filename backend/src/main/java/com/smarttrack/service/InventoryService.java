package com.smarttrack.service;

import com.smarttrack.dto.InventoryBatchDTO;
import com.smarttrack.entity.InventoryBatch;
import com.smarttrack.entity.Product;
import com.smarttrack.repository.InventoryBatchRepository;
import com.smarttrack.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class InventoryService {
    
    private final InventoryBatchRepository batchRepository;
    private final ProductRepository productRepository;
    
    public List<InventoryBatchDTO> getAllInventoryBatches() {
        return batchRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public List<InventoryBatchDTO> getNearExpiryBatches(int days) {
        LocalDate today = LocalDate.now();
        LocalDate futureDate = today.plusDays(days);
        
        return batchRepository.findBatchesExpiringBetween(today, futureDate).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public List<InventoryBatchDTO> getExpiredBatches() {
        return batchRepository.findExpiredBatches(LocalDate.now()).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    @Transactional
    public InventoryBatchDTO createBatch(InventoryBatch batch) {
        Product product = productRepository.findById(batch.getProduct().getId())
                .orElseThrow(() -> new RuntimeException("Product not found"));
        
        batch.setProduct(product);
        updateBatchStatus(batch);
        
        InventoryBatch savedBatch = batchRepository.save(batch);
        return convertToDTO(savedBatch);
    }
    
    @Transactional
    public InventoryBatchDTO updateBatch(Long id, InventoryBatch batchDetails) {
        InventoryBatch batch = batchRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Batch not found"));
        
        batch.setBatchNumber(batchDetails.getBatchNumber());
        batch.setQuantity(batchDetails.getQuantity());
        batch.setUnitPrice(batchDetails.getUnitPrice());
        batch.setManufacturingDate(batchDetails.getManufacturingDate());
        batch.setExpiryDate(batchDetails.getExpiryDate());
        batch.setStorageLocation(batchDetails.getStorageLocation());
        batch.setNotes(batchDetails.getNotes());
        
        updateBatchStatus(batch);
        
        InventoryBatch updatedBatch = batchRepository.save(batch);
        return convertToDTO(updatedBatch);
    }
    
    @Transactional
    public void deleteBatch(Long id) {
        batchRepository.deleteById(id);
    }
    
    public List<InventoryBatchDTO> searchBatches(String keyword) {
        return batchRepository.searchBatches(keyword).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    private void updateBatchStatus(InventoryBatch batch) {
        LocalDate today = LocalDate.now();
        LocalDate expiryDate = batch.getExpiryDate();
        
        if (expiryDate.isBefore(today)) {
            batch.setStatus(InventoryBatch.BatchStatus.EXPIRED);
        } else if (expiryDate.isBefore(today.plusDays(30))) {
            batch.setStatus(InventoryBatch.BatchStatus.NEAR_EXPIRY);
        } else {
            batch.setStatus(InventoryBatch.BatchStatus.GOOD);
        }
    }
    
    private InventoryBatchDTO convertToDTO(InventoryBatch batch) {
        InventoryBatchDTO dto = new InventoryBatchDTO();
        dto.setId(batch.getId());
        dto.setProductId(batch.getProduct().getId());
        dto.setProductName(batch.getProduct().getName());
        dto.setCategoryName(batch.getProduct().getCategory() != null ? 
                           batch.getProduct().getCategory().getName() : "Uncategorized");
        dto.setBatchNumber(batch.getBatchNumber());
        dto.setQuantity(batch.getQuantity());
        dto.setUnitPrice(batch.getUnitPrice());
        dto.setManufacturingDate(batch.getManufacturingDate());
        dto.setExpiryDate(batch.getExpiryDate());
        dto.setStatus(batch.getStatus().name());
        dto.setStorageLocation(batch.getStorageLocation());
        dto.setNotes(batch.getNotes());
        
        long daysUntilExpiry = ChronoUnit.DAYS.between(LocalDate.now(), batch.getExpiryDate());
        dto.setDaysUntilExpiry((int) daysUntilExpiry);
        
        return dto;
    }
}
