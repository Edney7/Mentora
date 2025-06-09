package com.example.mentora.controller;

import com.example.mentora.dto.aluno.AlunoResponseDTO; // 1. Importar AlunoResponseDTO
import com.example.mentora.dto.turma.TurmaCreateDTO;
import com.example.mentora.dto.turma.TurmaDetalhadaDTO;
import com.example.mentora.dto.turma.TurmaResponseDTO;
import com.example.mentora.dto.turma.TurmaUpdateDTO;
import com.example.mentora.service.aluno.AlunoService; // 2. Importar AlunoService
import com.example.mentora.service.turma.TurmaService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter; // Importar @Parameter
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/turmas")
@Tag(name = "Turmas", description = "Operações CRUD para Turmas e visualização de seus alunos") // Tag description atualizada
public class TurmaController {

    private final TurmaService turmaService;
    private final AlunoService alunoService; // 3. Declarar AlunoService

    // 4. Adicionar AlunoService ao construtor para injeção de dependência
    public TurmaController(TurmaService turmaService, AlunoService alunoService) {
        this.turmaService = turmaService;
        this.alunoService = alunoService; // 5. Atribuir AlunoService
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

    // --- NOVO ENDPOINT PARA LISTAR ALUNOS DA TURMA ---
    @Operation(summary = "Listar todos os alunos ativos de uma turma específica")
    @GetMapping("/{turmaId}/alunos")
    public ResponseEntity<List<AlunoResponseDTO>> listarAlunosDaTurma(
            @Parameter(description = "ID da turma para buscar os alunos") @PathVariable Long turmaId) {
        List<AlunoResponseDTO> alunos = alunoService.listarAlunosPorTurma(turmaId);
        return ResponseEntity.ok(alunos);
    }

    @GetMapping("/{id}/detalhes")
    public ResponseEntity<TurmaDetalhadaDTO> buscarDetalhes(@PathVariable Long id) {
        return ResponseEntity.ok(turmaService.buscarDetalhesDaTurma(id));
    }


    // Os métodos que gerenciavam a associação Turma-Disciplina
    // devem estar APENAS no TurmaDisciplinaController.
}
