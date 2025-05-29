package com.example.mentora.controller;

import com.example.mentora.dto.presenca.PresencaCreateDTO;
import com.example.mentora.model.Presenca;
import com.example.mentora.service.presenca.PresencaService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/presencas")

public class PresencaController {
    @Autowired
    private PresencaService presencaService;

    @PostMapping
    public Presenca registrarPresenca(@RequestBody @Valid PresencaCreateDTO dto){
        return presencaService.registrarPresenca(dto);
    }
}
