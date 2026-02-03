package com.smarttrack.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI smarttrackOpenApi() {
        return new OpenAPI()
                .info(new Info()
                        .title("SmartTrack Inventory API")
                        .version("1.1.0")
                        .description("Inventory, expiry tracking, reports, and offline chatbot endpoints"));
    }
}
