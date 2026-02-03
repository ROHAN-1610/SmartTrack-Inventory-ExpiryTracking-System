package com.smarttrack.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class RegisterResponse {
    private String message;
    private Long id;
    private String username;
    private String email;
    private String fullName;
    private String role;
}
