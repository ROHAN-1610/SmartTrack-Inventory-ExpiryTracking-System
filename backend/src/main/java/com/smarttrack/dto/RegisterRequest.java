package com.smarttrack.dto;

import lombok.Data;

@Data
public class RegisterRequest {
    private String username;
    private String email;
    private String password;
    private String confirmPassword;
    private String fullName;
    private String role; // Role can be ADMIN, MANAGER, or OPERATOR
}
