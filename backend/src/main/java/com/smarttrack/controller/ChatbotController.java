package com.smarttrack.controller;

import com.smarttrack.dto.ChatRequest;
import com.smarttrack.dto.ChatResponse;
import com.smarttrack.service.ChatbotService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ChatbotController {

    private final ChatbotService chatbotService;

    @PostMapping
    public ResponseEntity<ChatResponse> chat(@RequestBody ChatRequest req) {
        String mode = req.getMode() == null ? "HELP" : req.getMode();
        String reply = chatbotService.reply(req);
        return ResponseEntity.ok(new ChatResponse(reply, mode));
    }
}
