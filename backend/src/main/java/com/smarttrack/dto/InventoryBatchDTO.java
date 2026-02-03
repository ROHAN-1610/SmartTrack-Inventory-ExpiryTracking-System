package com.smarttrack.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class InventoryBatchDTO {
    private Long id;
    private Long productId;
    private String productName;
    private String categoryName;
    private String batchNumber;
    private Integer quantity;
    private BigDecimal unitPrice;
    private LocalDate manufacturingDate;
    private LocalDate expiryDate;
    private String status;
    private String storageLocation;
    private String notes;
    private Integer daysUntilExpiry;
}
