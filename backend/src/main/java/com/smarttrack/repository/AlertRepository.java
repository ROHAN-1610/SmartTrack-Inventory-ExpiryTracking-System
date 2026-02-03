package com.smarttrack.repository;

import com.smarttrack.entity.Alert;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AlertRepository extends JpaRepository<Alert, Long> {
    
    List<Alert> findByIsAcknowledgedFalseOrderByCreatedAtDesc();
    
    @Query("SELECT a FROM Alert a WHERE a.isAcknowledged = false AND a.severity = 'CRITICAL' ORDER BY a.createdAt DESC")
    List<Alert> findUnacknowledgedCriticalAlerts();
    
    Long countByIsAcknowledgedFalse();
}
