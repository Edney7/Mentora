package com.example.mentora.controller;

import com.example.mentora.dto.disciplina.DisciplinaCreateDTO;
import com.example.mentora.dto.disciplina.DisciplinaResponseDTO;
import com.example.mentora.service.disciplina.DisciplinaService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/disciplinas")
public class DisciplinaController {

    private final DisciplinaService disciplinaService;

    public DisciplinaController(DisciplinaService disciplinaService) {
        this.disciplinaService = disciplinaService;
    }

    @PostMapping
    public ResponseEntity<DisciplinaResponseDTO> criar(@Valid @RequestBody DisciplinaCreateDTO dto) {
        return ResponseEntity.ok(disciplinaService.criar(dto));
    }

    @GetMapping
    public ResponseEntity<List<DisciplinaResponseDTO>> listar() {
        return ResponseEntity.ok(disciplinaService.listar());
    }
}
