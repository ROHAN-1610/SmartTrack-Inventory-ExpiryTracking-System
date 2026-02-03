package com.smarttrack.service;

import com.smarttrack.dto.ChatRequest;
import com.smarttrack.repository.InventoryBatchRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.Locale;

@Service
@RequiredArgsConstructor
public class ChatbotService {

    private final InventoryBatchRepository batchRepository;

    public String reply(ChatRequest req) {
        String msg = req.getMessage() == null ? "" : req.getMessage().trim();
        String mode = req.getMode() == null ? "HELP" : req.getMode().trim().toUpperCase(Locale.ROOT);
        String lower = msg.toLowerCase(Locale.ROOT);

        // Lightweight intent detection
        if (lower.isBlank()) {
            return "Type a question. Try: 'what is FEFO?' or 'items expiring in 14 days'";
        }

        // INVENTORY assistant intents
        if (mode.equals("INVENTORY") || lower.contains("expire") || lower.contains("expiry") || lower.contains("near expiry")) {
            Integer days = extractDays(lower);
            if (days == null) days = 30;
            LocalDate today = LocalDate.now();
            long near = batchRepository.countNearExpiryBatches(today, today.plusDays(days));
            long expired = batchRepository.countExpiredBatches(today);
            return "Inventory summary: " + near + " batch(es) expiring within " + days + " day(s), and " + expired + " expired batch(es). " +
                    "Tip: Use FEFO to pick items that expire sooner.";
        }

        if (lower.contains("total") && (lower.contains("value") || lower.contains("inventory value"))) {
            Double v = batchRepository.getTotalInventoryValue();
            return "Current estimated inventory value is $" + (v == null ? "0" : String.format(Locale.ROOT, "%.2f", v)) + ".";
        }

        // HELP / FAQ intents
        if (lower.contains("fefo")) {
            return "FEFO means First-Expiry-First-Out: always use/sell the batch with the nearest expiry date first to reduce waste.";
        }
        if (lower.contains("fifo")) {
            return "FIFO means First-In-First-Out: you use older received stock first. FEFO is better when expiry dates vary.";
        }
        if (lower.contains("batch") || lower.contains("lot")) {
            return "Batch/Lot tracking records stock per batch number + expiry date. This improves traceability and recall management.";
        }
        if (lower.contains("add") && (lower.contains("batch") || lower.contains("product"))) {
            return "To add inventory: go to Inventory List → Add Product (or add batch). Enter product, batch number, qty, and expiry date.";
        }
        if (lower.contains("alerts") || lower.contains("notification")) {
            return "Alerts warn you about Near-Expiry and Expired items. Use them to prioritize FEFO picking or disposal actions.";
        }

        return "I can help with expiry, batches, FEFO/FIFO, and system usage. Try: 'items expiring in 7 days', 'what is FEFO?', or 'inventory value'.";
    }

    private Integer extractDays(String lower) {
        // very small parser: looks for patterns like 'in 14 days'
        try {
            String[] tokens = lower.replaceAll("[^0-9 ]", " ").trim().split("\\s+");
            for (String t : tokens) {
                if (!t.isBlank()) {
                    int n = Integer.parseInt(t);
                    if (n >= 0 && n <= 3650) return n;
                }
            }
        } catch (Exception ignored) {
        }
        return null;
    }
}
