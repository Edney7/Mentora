package com.example.mentora.controller;

import com.example.mentora.dto.aluno.AlunoResponseDTO;
import com.example.mentora.service.aluno.AlunoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/alunos") // O endpoint base para operações relacionadas a perfis de alunos
@Tag(name = "Perfis de Alunos", description = "Visualização e gerenciamento de perfis de alunos")
public class AlunoController {

    private final AlunoService alunoService;

    // Injeção de dependência do AlunoService via construtor
    public AlunoController(AlunoService alunoService) {
        this.alunoService = alunoService;
    }

    @Operation(summary = "Listar todos os perfis de alunos ativos")
    @GetMapping
    public ResponseEntity<List<AlunoResponseDTO>> listarAlunosAtivos() {
        List<AlunoResponseDTO> alunos = alunoService.listarAtivos();
        return ResponseEntity.ok(alunos);
    }

    @Operation(summary = "Buscar perfil de aluno ativo por ID")
    @GetMapping("/{id}")
    public ResponseEntity<AlunoResponseDTO> buscarAlunoAtivoPorId(@PathVariable Long id) {
        AlunoResponseDTO aluno = alunoService.buscarAtivoPorId(id);
        return ResponseEntity.ok(aluno);
    }
    
}
