package com.smarttrack.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@Table(name = "alerts")
@Data
@NoArgsConstructor
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class Alert {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "batch_id", nullable = false)
    private InventoryBatch batch;
    
    @Column(name = "alert_type", nullable = false, length = 20)
    @Enumerated(EnumType.STRING)
    private AlertType alertType;
    
    @Column(nullable = false, length = 20)
    @Enumerated(EnumType.STRING)
    private Severity severity;
    
    @Column(nullable = false, columnDefinition = "TEXT")
    private String message;
    
    @Column(name = "is_acknowledged")
    private Boolean isAcknowledged = false;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "acknowledged_by")
    private User acknowledgedBy;
    
    @Column(name = "acknowledged_at")
    private LocalDateTime acknowledgedAt;
    
    @CreatedDate
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
    
    public enum AlertType {
        EXPIRY, LOW_STOCK, RESTOCK_RECOMMENDATION
    }
    
    public enum Severity {
        CRITICAL, WARNING, INFO
    }
}
