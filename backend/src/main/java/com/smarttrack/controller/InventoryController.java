package com.smarttrack.controller;

import com.smarttrack.dto.InventoryBatchDTO;
import com.smarttrack.entity.InventoryBatch;
import com.smarttrack.service.InventoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/inventory")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class InventoryController {
    
    private final InventoryService inventoryService;
    
    @GetMapping
    public ResponseEntity<List<InventoryBatchDTO>> getAllInventory() {
        return ResponseEntity.ok(inventoryService.getAllInventoryBatches());
    }
    
    @GetMapping("/near-expiry")
    public ResponseEntity<List<InventoryBatchDTO>> getNearExpiry(@RequestParam(defaultValue = "30") int days) {
        return ResponseEntity.ok(inventoryService.getNearExpiryBatches(days));
    }
    
    @GetMapping("/expired")
    public ResponseEntity<List<InventoryBatchDTO>> getExpired() {
        return ResponseEntity.ok(inventoryService.getExpiredBatches());
    }
    
    @GetMapping("/search")
    public ResponseEntity<List<InventoryBatchDTO>> searchInventory(@RequestParam String keyword) {
        return ResponseEntity.ok(inventoryService.searchBatches(keyword));
    }
    
    @PostMapping
    public ResponseEntity<InventoryBatchDTO> createBatch(@RequestBody InventoryBatch batch) {
        InventoryBatchDTO created = inventoryService.createBatch(batch);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<InventoryBatchDTO> updateBatch(@PathVariable Long id, @RequestBody InventoryBatch batch) {
        InventoryBatchDTO updated = inventoryService.updateBatch(id, batch);
        return ResponseEntity.ok(updated);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBatch(@PathVariable Long id) {
        inventoryService.deleteBatch(id);
        return ResponseEntity.noContent().build();
    }
}
