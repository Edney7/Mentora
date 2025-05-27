package com.example.mentora.controller;

// Removido ProfessorCreateDTO se não for mais usado
import com.example.mentora.dto.professor.ProfessorResponseDTO;
import com.example.mentora.service.professor.ProfessorService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
// Removido @Valid para o POST, pois o POST foi removido
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*; // @RequestBody removido do import se não houver mais POSTs/PUTs com body aqui

import java.util.List;

@RestController
@RequestMapping("/professores") // Este endpoint agora serve para gerenciar perfis de Professor existentes
@Tag(name = "Perfis de Professores", description = "Visualização e gerenciamento de perfis de professores")
public class ProfessorController {

    private final ProfessorService professorService;

    public ProfessorController(ProfessorService professorService) {
        this.professorService = professorService;
    }

    @Operation(summary = "Listar todos os perfis de professores")
    @GetMapping
    public ResponseEntity<List<ProfessorResponseDTO>> listarTodos() {
        List<ProfessorResponseDTO> professores = professorService.listarTodos();
        return ResponseEntity.ok(professores);
    }

    @Operation(summary = "Buscar perfil de professor por ID")
    @GetMapping("/{id}")
    public ResponseEntity<ProfessorResponseDTO> buscarPorId(@PathVariable Long id) {
        ProfessorResponseDTO professor = professorService.buscarPorId(id);
        return ResponseEntity.ok(professor);
    }

}
