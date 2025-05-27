package com.example.mentora.controller;

import com.example.mentora.dto.falta.FaltaCreateDTO;
import com.example.mentora.model.Falta;
import com.example.mentora.service.falta.FaltaService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/faltas")
public class FaltaController {
    @Autowired
    private FaltaService faltaService;

    @PostMapping
    public Falta registrarFalta(@RequestBody @Valid FaltaCreateDTO dto) {
        return faltaService.registraFalta(dto);
    }
}
