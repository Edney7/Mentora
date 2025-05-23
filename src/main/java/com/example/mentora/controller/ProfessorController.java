package com.example.mentora.controller;

import com.example.mentora.dto.professor.ProfessorCreateDTO;
import com.example.mentora.dto.professor.ProfessorResponseDTO;
import com.example.mentora.service.professor.ProfessorService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/professores")
@Tag(name = "Professores", description = "Gerenciamento de professores")
public class ProfessorController {

    private final ProfessorService professorService;

    public ProfessorController(ProfessorService professorService) {
        this.professorService = professorService;
    }

    @Operation(summary = "Cadastrar um novo professor")
    @PostMapping
    public ResponseEntity<ProfessorResponseDTO> cadastrar(@Valid @RequestBody ProfessorCreateDTO dto) {
        return ResponseEntity.ok(professorService.cadastrar(dto));
    }

    @Operation(summary = "Listar todos os professores")
    @GetMapping
    public ResponseEntity<List<ProfessorResponseDTO>> listarTodos() {
        return ResponseEntity.ok(professorService.listarTodos());
    }
}
