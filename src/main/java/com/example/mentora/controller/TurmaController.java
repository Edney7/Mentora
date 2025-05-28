package com.example.mentora.controller;

import com.example.mentora.dto.disciplina.DisciplinaResponseDTO;
import com.example.mentora.dto.turma.TurmaCreateDTO;
import com.example.mentora.dto.turma.TurmaResponseDTO;
import com.example.mentora.dto.turma.TurmaUpdateDTO;
import com.example.mentora.dto.turmadisciplina.AtualizarDisciplinasTurmaRequestDTO;
import com.example.mentora.dto.turmadisciplina.VincularDisciplinaTurmaRequestDTO;
import com.example.mentora.service.turma.TurmaService;
import com.example.mentora.service.turmadisciplina.TurmaDisciplinaService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/turmas")
@Tag(name = "Turmas", description = "Gerenciamento de turmas e suas disciplinas associadas")
public class TurmaController {

    private final TurmaService turmaService;
    private final TurmaDisciplinaService turmaDisciplinaService;

    public TurmaController(TurmaService turmaService, TurmaDisciplinaService turmaDisciplinaService) {
        this.turmaService = turmaService;
        this.turmaDisciplinaService = turmaDisciplinaService;
    }

    @Operation(summary = "Cadastrar uma nova turma")
    @PostMapping
    public ResponseEntity<TurmaResponseDTO> cadastrarTurma(@Valid @RequestBody TurmaCreateDTO dto) {
        TurmaResponseDTO turmaCriada = turmaService.cadastrar(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(turmaCriada);
    }

    @Operation(summary = "Listar todas as turmas ativas")
    @GetMapping
    public ResponseEntity<List<TurmaResponseDTO>> listarTurmasAtivas() { // Renomeado
        List<TurmaResponseDTO> turmas = turmaService.listarTurmasAtivas(); // Chamada atualizada
        return ResponseEntity.ok(turmas);
    }

    @Operation(summary = "Buscar uma turma ativa por ID")
    @GetMapping("/{id}")
    public ResponseEntity<TurmaResponseDTO> buscarTurmaAtivaPorId(@PathVariable Long id) { // Renomeado
        TurmaResponseDTO turma = turmaService.buscarTurmaAtivaPorId(id); // Chamada atualizada
        return ResponseEntity.ok(turma);
    }

    @Operation(summary = "Atualizar os dados de uma turma (pode incluir status ativa/inativa)")
    @PutMapping("/{id}")
    public ResponseEntity<TurmaResponseDTO> atualizarTurma(
            @PathVariable Long id,
            @Valid @RequestBody TurmaUpdateDTO dto) {
        TurmaResponseDTO turmaAtualizada = turmaService.atualizar(id, dto);
        return ResponseEntity.ok(turmaAtualizada);
    }

    @Operation(summary = "Desativar uma turma (soft delete)")
    @DeleteMapping("/{id}") // Endpoint continua DELETE, mas a ação é desativar
    public ResponseEntity<Void> desativarTurma(@PathVariable Long id){
        turmaService.desativarTurma(id); // Chamada atualizada
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "Reativar uma turma")
    @PostMapping("/{id}/reativar") // Novo endpoint para reativar
    public ResponseEntity<Void> reativarTurma(@PathVariable Long id) {
        turmaService.reativarTurma(id);
        return ResponseEntity.ok().build(); // Ou noContent() se preferir
    }

    // --- Endpoints para Gerenciar Disciplinas da Turma (permanecem os mesmos) ---

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
            @RequestBody List<Long> disciplinaIds) {
        AtualizarDisciplinasTurmaRequestDTO dto = new AtualizarDisciplinasTurmaRequestDTO();
        dto.setTurmaId(turmaId);
        dto.setDisciplinaIds(disciplinaIds);
        turmaDisciplinaService.atualizarDisciplinasDaTurma(dto);
        return ResponseEntity.ok().build();
    }
}
