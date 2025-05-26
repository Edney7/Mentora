package com.example.mentora.controller;

import com.example.mentora.dto.aluno.AlunoCreateDTO;
import com.example.mentora.dto.aluno.AlunoResponseDTO;
import com.example.mentora.service.aluno.AlunoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/alunos")
@Tag(name = "Alunos", description = "Gerenciamento de Alunos")
public class AlunoController {

    private final AlunoService alunoService;

    public AlunoController(AlunoService alunoService) {
        this.alunoService = alunoService;
    }

    @Operation(summary = "Cadastrar aluno")
    @PostMapping
    public ResponseEntity<AlunoResponseDTO> cadastrar(@Valid @RequestBody AlunoCreateDTO dto) {
        return ResponseEntity.ok(alunoService.cadastrar(dto));
    }

    @Operation(summary = "Listar alunos")
    @GetMapping
    public ResponseEntity<List<AlunoResponseDTO>> listar() {
        return ResponseEntity.ok(alunoService.listar());
    }
}
