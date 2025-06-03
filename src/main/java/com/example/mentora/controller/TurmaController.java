package com.example.mentora.controller;

import com.example.mentora.dto.aluno.AlunoResponseDTO;
import com.example.mentora.dto.disciplina.DisciplinaResponseDTO;
import com.example.mentora.dto.turma.TurmaCreateDTO;
import com.example.mentora.dto.turma.TurmaResponseDTO;
import com.example.mentora.dto.turma.TurmaUpdateDTO;
import com.example.mentora.dto.turmadisciplina.AtualizarDisciplinasTurmaRequestDTO;
import com.example.mentora.dto.turmadisciplina.VincularDisciplinaTurmaRequestDTO;
import com.example.mentora.service.aluno.AlunoService;
import com.example.mentora.service.turma.TurmaService;
import com.example.mentora.service.turmadisciplina.TurmaDisciplinaService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
// import org.springframework.security.access.prepost.PreAuthorize; // Para segurança do endpoint

import java.util.List;

@RestController
@RequestMapping("/turmas")
@Tag(name = "Turmas", description = "Gerenciamento de turmas, suas disciplinas e alunos")
public class TurmaController {

    private final TurmaService turmaService;
    private final AlunoService alunoService;
    // TurmaDisciplinaService será usado pelo TurmaDisciplinaController

    public TurmaController(TurmaService turmaService,
                           AlunoService alunoService) {
        this.turmaService = turmaService;
        this.alunoService = alunoService;
    }

    @Operation(summary = "Cadastrar uma nova turma")
    @PostMapping
    public ResponseEntity<TurmaResponseDTO> cadastrarTurma(@Valid @RequestBody TurmaCreateDTO dto) {
        TurmaResponseDTO turmaCriada = turmaService.cadastrar(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(turmaCriada);
    }

    @Operation(summary = "Listar todas as turmas ativas")
    @GetMapping
    public ResponseEntity<List<TurmaResponseDTO>> listarTurmasAtivas() {
        List<TurmaResponseDTO> turmas = turmaService.listarTurmasAtivas();
        return ResponseEntity.ok(turmas);
    }

    @Operation(summary = "Listar TODAS as turmas (ativas e inativas) - Acesso restrito (ex: Admin)")
    @GetMapping("/todas")
    public ResponseEntity<List<TurmaResponseDTO>> listarTodasAsTurmas() {
        List<TurmaResponseDTO> turmas = turmaService.listarTodasAsTurmas();
        return ResponseEntity.ok(turmas);
    }

    @Operation(summary = "Buscar uma turma ativa por ID")
    @GetMapping("/{id}")
    public ResponseEntity<TurmaResponseDTO> buscarTurmaAtivaPorId(@PathVariable Long id) {
        TurmaResponseDTO turma = turmaService.buscarTurmaAtivaPorId(id);
        return ResponseEntity.ok(turma);
    }

    @Operation(summary = "Atualizar os dados de uma turma")
    @PutMapping("/{id}")
    public ResponseEntity<TurmaResponseDTO> atualizarTurma(
            @PathVariable Long id,
            @Valid @RequestBody TurmaUpdateDTO dto) {
        TurmaResponseDTO turmaAtualizada = turmaService.atualizar(id, dto);
        return ResponseEntity.ok(turmaAtualizada);
    }

    @Operation(summary = "Desativar uma turma (soft delete)")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> desativarTurma(@PathVariable Long id){
        turmaService.desativarTurma(id);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "Reativar uma turma")
    @PostMapping("/{id}/reativar")
    public ResponseEntity<Void> reativarTurma(@PathVariable Long id) {
        turmaService.reativarTurma(id);
        return ResponseEntity.ok().build();
    }

    @Operation(summary = "Listar todos os alunos ativos de uma turma específica")
    @GetMapping("/{turmaId}/alunos")
    public ResponseEntity<List<AlunoResponseDTO>> listarAlunosDaTurma(
            @Parameter(description = "ID da turma para buscar os alunos") @PathVariable Long turmaId) {
        List<AlunoResponseDTO> alunos = alunoService.listarAlunosPorTurma(turmaId);
        return ResponseEntity.ok(alunos);
    }
}
