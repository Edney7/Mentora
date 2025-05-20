package com.example.mentora;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication(scanBasePackages = "com.example.mentora")
public class MentoraApplication {

	public static void main(String[] args) {
		SpringApplication.run(MentoraApplication.class, args);
	}

}
