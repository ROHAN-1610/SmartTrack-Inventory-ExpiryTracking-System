package com.smarttrack.dto;

import lombok.Data;

@Data
public class ChatRequest {
    private String message;
    /** mode can be HELP or INVENTORY */
    private String mode;
}
