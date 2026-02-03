package com.smarttrack.service;

import com.smarttrack.dto.RegisterRequest;
import com.smarttrack.dto.RegisterResponse;
import com.smarttrack.entity.User;
import com.smarttrack.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    // Method to handle user registration
    public RegisterResponse registerUser(RegisterRequest registerRequest) {

        // Check if username or email already exists
        if (userRepository.existsByUsername(registerRequest.getUsername())) {
            return new RegisterResponse("Username already exists", null, null, null, null, null);
        }
        if (userRepository.existsByEmail(registerRequest.getEmail())) {
            return new RegisterResponse("Email already exists", null, null, null, null, null);
        }

        // If password and confirmPassword match
        if (!registerRequest.getPassword().equals(registerRequest.getConfirmPassword())) {
            return new RegisterResponse("Passwords do not match", null, null, null, null, null);
        }

        // Validate role
        if (!User.Role.isValidRole(registerRequest.getRole())) {
            return new RegisterResponse("Invalid role", null, null, null, null, null);
        }

        // Create new user entity
        User user = new User();
        user.setUsername(registerRequest.getUsername());
        user.setEmail(registerRequest.getEmail());
        user.setPassword(passwordEncoder.encode(registerRequest.getPassword())); // Encrypt password
        user.setFullName(registerRequest.getFullName());
        user.setRole(User.Role.valueOf(registerRequest.getRole().toUpperCase())); // Set role from request
        user.setIsActive(true);

        // Save user to the database
        user = userRepository.save(user);

        // Return response
        return new RegisterResponse("User registered successfully", user.getId(), user.getUsername(), user.getEmail(), user.getFullName(), user.getRole().name());
    }
}
