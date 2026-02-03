package com.smarttrack.repository;

import com.smarttrack.entity.InventoryBatch;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface InventoryBatchRepository extends JpaRepository<InventoryBatch, Long> {
    
    List<InventoryBatch> findByProductId(Long productId);
    
    @Query("SELECT ib FROM InventoryBatch ib WHERE ib.expiryDate < :date AND ib.quantity > 0")
    List<InventoryBatch> findExpiredBatches(@Param("date") LocalDate date);
    
    @Query("SELECT ib FROM InventoryBatch ib WHERE ib.expiryDate BETWEEN :startDate AND :endDate AND ib.quantity > 0 ORDER BY ib.expiryDate ASC")
    List<InventoryBatch> findBatchesExpiringBetween(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);
    
    @Query("SELECT ib FROM InventoryBatch ib WHERE ib.quantity > 0 ORDER BY ib.expiryDate ASC")
    List<InventoryBatch> findAllActiveBatchesOrderedByExpiry();
    
    @Query("SELECT COUNT(ib) FROM InventoryBatch ib WHERE ib.quantity > 0")
    Long countActiveBatches();
    
    @Query("SELECT SUM(ib.quantity * ib.unitPrice) FROM InventoryBatch ib WHERE ib.quantity > 0")
    Double getTotalInventoryValue();
    
    @Query("SELECT ib FROM InventoryBatch ib JOIN ib.product p WHERE " +
           "LOWER(p.name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(ib.batchNumber) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<InventoryBatch> searchBatches(@Param("keyword") String keyword);
    
    @Query("SELECT COUNT(ib) FROM InventoryBatch ib WHERE ib.expiryDate < :date AND ib.quantity > 0")
    Long countExpiredBatches(@Param("date") LocalDate date);
    
    @Query("SELECT COUNT(ib) FROM InventoryBatch ib WHERE ib.expiryDate BETWEEN :startDate AND :endDate AND ib.quantity > 0")
    Long countNearExpiryBatches(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);
}
