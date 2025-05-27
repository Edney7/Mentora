package com.example.mentora.controller;

import com.example.mentora.dto.aluno.AlunoResponseDTO;
import com.example.mentora.service.aluno.AlunoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/alunos")
@Tag(name = "Perfis de Alunos", description = "Visualização e gerenciamento de perfis de alunos")
public class AlunoController {

    private final AlunoService alunoService;

    public AlunoController(AlunoService alunoService) {
        this.alunoService = alunoService;
    }

    @Operation(summary = "Listar todos os perfis de alunos")
    @GetMapping
    public ResponseEntity<List<AlunoResponseDTO>> listar() {
        List<AlunoResponseDTO> alunos = alunoService.listar();
        return ResponseEntity.ok(alunos);
    }

    @Operation(summary = "Buscar perfil de aluno por ID")
    @GetMapping("/{id}")
    public ResponseEntity<AlunoResponseDTO> buscarPorId(@PathVariable Long id) {
        AlunoResponseDTO aluno = alunoService.buscarPorId(id);
        return ResponseEntity.ok(aluno);
    }

}
