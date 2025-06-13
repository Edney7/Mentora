package com.example.mentora.controller;

import com.example.mentora.dto.professor.ProfessorResponseDTO;
import com.example.mentora.service.professor.ProfessorService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/professores") // O endpoint base para operações relacionadas a perfis de professores
@Tag(name = "Perfis de Professores", description = "Visualização e gerenciamento de perfis de professores")
public class ProfessorController {

    private final ProfessorService professorService;

    // Injeção de dependência do ProfessorService via construtor
    public ProfessorController(ProfessorService professorService) {
        this.professorService = professorService;
    }

    @Operation(summary = "Listar todos os perfis de professores ativos")
    @GetMapping
    public ResponseEntity<List<ProfessorResponseDTO>> listarProfessoresAtivos() { // Nome do método atualizado
        List<ProfessorResponseDTO> professores = professorService.listarProfessoresAtivos(); // Chamada correta
        return ResponseEntity.ok(professores);
    }

    @Operation(summary = "Buscar perfil de professor ativo por ID")
    @GetMapping("/{id}")
    public ResponseEntity<ProfessorResponseDTO> buscarProfessorAtivoPorId(@PathVariable Long id) { // Nome do método atualizado
        ProfessorResponseDTO professor = professorService.buscarProfessorAtivoPorId(id); // Chamada correta
        return ResponseEntity.ok(professor);
    }


}
