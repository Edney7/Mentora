package com.example.mentora.controller;

import com.example.mentora.dto.TurmaCreateDTO;
import com.example.mentora.dto.TurmaResponseDTO;
import com.example.mentora.service.TurmaService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/turmas")
@Tag(name = "Turmas", description = "Gerenciamento de turmas")
public class TurmaController {

    private final TurmaService turmaService;

    public TurmaController(TurmaService turmaService) {
        this.turmaService = turmaService;
    }

    @Operation(summary = "Cadastrar nova turma")
    @PostMapping
    public ResponseEntity<TurmaResponseDTO> cadastrar(@Valid @RequestBody TurmaCreateDTO dto) {
        return ResponseEntity.ok(turmaService.cadastrar(dto));
    }

    @Operation(summary = "Listar turmas")
    @GetMapping
    public ResponseEntity<List<TurmaResponseDTO>> listar() {
        return ResponseEntity.ok(turmaService.listar());
    }
}
