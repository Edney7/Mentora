package com.example.mentora.config; // Ou o seu pacote de configuração

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig {

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**") // Aplica a todos os endpoints da API
                        .allowedOrigins("http://localhost:3000") // URL do seu frontend React
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH") // Métodos HTTP permitidos
                        .allowedHeaders("*") // Permite todos os cabeçalhos na requisição
                        .allowCredentials(true) // Permite o envio de credenciais (cookies, cabeçalhos de autorização)
                        .maxAge(3600); // Tempo (em segundos) que o resultado da requisição preflight OPTIONS pode ser cacheado
            }
        };
    }
}
