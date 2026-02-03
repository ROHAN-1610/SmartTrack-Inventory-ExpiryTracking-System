package com.smarttrack;

import org.springframework.boot.SpringApplication;

import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableJpaAuditing
@EnableScheduling
public class SmartTrackApplication {

    public static void main(String[] args) {
        SpringApplication.run(SmartTrackApplication.class, args);
        System.out.println("\n========================================");
        System.out.println("SmartTrack Inventory System Started!");
        System.out.println("API: http://localhost:8080");
        System.out.println("Swagger UI: http://localhost:8080/swagger-ui.html");
        System.out.println("========================================\n");
    }
}

