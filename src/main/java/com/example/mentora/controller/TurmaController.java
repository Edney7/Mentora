package com.example.mentora.controller;

import com.example.mentora.dto.turma.TurmaCreateDTO;
import com.example.mentora.dto.turma.TurmaResponseDTO;
import com.example.mentora.dto.turma.TurmaUpdateDTO;
import com.example.mentora.service.turma.TurmaService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/turmas")
@Tag(name = "Turmas", description = "Operações CRUD para Turmas") // Descrição atualizada
public class TurmaController {

    private final TurmaService turmaService;

    // TurmaDisciplinaService foi removido daqui
    public TurmaController(TurmaService turmaService) {
        this.turmaService = turmaService;
    }

    @Operation(summary = "Cadastrar uma nova turma")
    @PostMapping
    public ResponseEntity<TurmaResponseDTO> cadastrarTurma(@Valid @RequestBody TurmaCreateDTO dto) {
        TurmaResponseDTO turmaCriada = turmaService.cadastrar(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(turmaCriada);
    }

    @Operation(summary = "Listar todas as turmas ativas") // Assumindo que seu TurmaService.listar() agora é listarTurmasAtivas()
    @GetMapping
    public ResponseEntity<List<TurmaResponseDTO>> listarTurmasAtivas() {
        List<TurmaResponseDTO> turmas = turmaService.listarTurmasAtivas(); // Ajustado para listar apenas ativas
        return ResponseEntity.ok(turmas);
    }

    @Operation(summary = "Buscar uma turma ativa por ID") // Assumindo que seu TurmaService.buscarPorId() agora é buscarTurmaAtivaPorId()
    @GetMapping("/{id}")
    public ResponseEntity<TurmaResponseDTO> buscarTurmaAtivaPorId(@PathVariable Long id) {
        TurmaResponseDTO turma = turmaService.buscarTurmaAtivaPorId(id); // Ajustado para buscar apenas ativa
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
    public ResponseEntity<Void> desativarTurma(@PathVariable Long id){ // Nome do método reflete a ação
        turmaService.desativarTurma(id); // Ajustado para desativar em vez de excluir
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "Reativar uma turma")
    @PostMapping("/{id}/reativar")
    public ResponseEntity<Void> reativarTurma(@PathVariable Long id) {
        turmaService.reativarTurma(id);
        return ResponseEntity.ok().build();
    }

    // Os endpoints relacionados a Turma-Disciplina foram movidos para TurmaDisciplinaController
}
