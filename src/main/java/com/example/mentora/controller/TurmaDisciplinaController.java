package com.example.mentora.controller;

import com.example.mentora.dto.disciplina.DisciplinaResponseDTO;
import com.example.mentora.dto.turmadisciplina.AtualizarDisciplinasTurmaRequestDTO;
import com.example.mentora.dto.turmadisciplina.VincularDisciplinaTurmaRequestDTO;
import com.example.mentora.service.turmadisciplina.TurmaDisciplinaService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid; // Adicionar se DTOs internos tiverem validações
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/turmas") // Continua com o mesmo base path para manter a estrutura RESTful (/turmas/{turmaId}/disciplinas)
@Tag(name = "Turma - Disciplinas", description = "Gerenciamento da associação entre Turmas e Disciplinas")
public class TurmaDisciplinaController {

    private final TurmaDisciplinaService turmaDisciplinaService;

    public TurmaDisciplinaController(TurmaDisciplinaService turmaDisciplinaService) {
        this.turmaDisciplinaService = turmaDisciplinaService;
    }

    @Operation(summary = "Listar todas as disciplinas associadas a uma turma específica")
    @GetMapping("/{turmaId}/disciplinas")
    public ResponseEntity<List<DisciplinaResponseDTO>> listarDisciplinasDaTurma(
            @Parameter(description = "ID da turma para buscar as disciplinas") @PathVariable Long turmaId) {
        List<DisciplinaResponseDTO> disciplinas = turmaDisciplinaService.listarDisciplinasPorTurma(turmaId);
        return ResponseEntity.ok(disciplinas);
    }

    @Operation(summary = "Vincular uma única disciplina a uma turma")
    @PostMapping("/{turmaId}/disciplinas/{disciplinaId}")
    public ResponseEntity<Void> vincularDisciplinaNaTurma(
            @Parameter(description = "ID da turma") @PathVariable Long turmaId,
            @Parameter(description = "ID da disciplina a ser vinculada") @PathVariable Long disciplinaId) {

        VincularDisciplinaTurmaRequestDTO dto = new VincularDisciplinaTurmaRequestDTO();
        dto.setTurmaId(turmaId);
        dto.setDisciplinaId(disciplinaId);
        turmaDisciplinaService.vincularDisciplina(dto);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @Operation(summary = "Desvincular uma disciplina específica de uma turma")
    @DeleteMapping("/{turmaId}/disciplinas/{disciplinaId}")
    public ResponseEntity<Void> desvincularDisciplinaDaTurma(
            @Parameter(description = "ID da turma") @PathVariable Long turmaId,
            @Parameter(description = "ID da disciplina a ser desvinculada") @PathVariable Long disciplinaId) {
        turmaDisciplinaService.desvincularDisciplina(turmaId, disciplinaId);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "Atualizar (substituir) todas as disciplinas vinculadas a uma turma")
    @PutMapping("/{turmaId}/disciplinas")
    public ResponseEntity<Void> atualizarDisciplinasDaTurma(
            @Parameter(description = "ID da turma") @PathVariable Long turmaId,
            @Parameter(description = "Lista de IDs das disciplinas que devem estar associadas à turma. As associações anteriores serão removidas.")
            @RequestBody List<Long> disciplinaIds) { // Recebe diretamente a lista de IDs

        AtualizarDisciplinasTurmaRequestDTO dto = new AtualizarDisciplinasTurmaRequestDTO();
        dto.setTurmaId(turmaId);
        dto.setDisciplinaIds(disciplinaIds);
        turmaDisciplinaService.atualizarDisciplinasDaTurma(dto);
        return ResponseEntity.ok().build();
    }
}
