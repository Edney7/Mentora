package com.example.mentora.controller; // Ou o seu pacote de controllers

import com.example.mentora.dto.falta.FaltaCreateDTO;
import com.example.mentora.dto.falta.FaltaJustificativaDTO;
import com.example.mentora.dto.falta.FaltaResponseDTO;
import com.example.mentora.service.falta.FaltaService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/faltas")
@Tag(name = "Faltas", description = "Operações relacionadas ao registo e gestão de faltas de alunos")
public class FaltaController {

    private final FaltaService faltaService;

    @Autowired
    public FaltaController(FaltaService faltaService) {
        this.faltaService = faltaService;
    }

    @Operation(summary = "Registar uma nova falta para um aluno")
    @PostMapping
    public ResponseEntity<FaltaResponseDTO> registarFalta(@Valid @RequestBody FaltaCreateDTO faltaCreateDTO) {
        FaltaResponseDTO faltaRegistada = faltaService.registarFalta(faltaCreateDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(faltaRegistada);
    }

    @Operation(summary = "Justificar uma falta existente")
    @PutMapping("/{faltaId}/justificar") // Pode ser PATCH também, dependendo da semântica desejada
    public ResponseEntity<FaltaResponseDTO> justificarFalta(
            @Parameter(description = "ID da falta a ser justificada") @PathVariable Long faltaId,
            @Valid @RequestBody FaltaJustificativaDTO faltaJustificativaDTO) {
        FaltaResponseDTO faltaJustificada = faltaService.justificarFalta(faltaId, faltaJustificativaDTO);
        return ResponseEntity.ok(faltaJustificada);
    }

    @Operation(summary = "Buscar uma falta específica pelo seu ID")
    @GetMapping("/{id}")
    public ResponseEntity<FaltaResponseDTO> buscarFaltaPorId(
            @Parameter(description = "ID da falta") @PathVariable Long id) {
        FaltaResponseDTO falta = faltaService.buscarFaltaPorId(id);
        return ResponseEntity.ok(falta);
    }

    @Operation(summary = "Listar todas as faltas de um aluno específico")
    @GetMapping("/aluno/{alunoId}")
    public ResponseEntity<List<FaltaResponseDTO>> listarFaltasDoAluno(
            @Parameter(description = "ID do aluno para buscar as faltas") @PathVariable Long alunoId) {
        List<FaltaResponseDTO> faltas = faltaService.listarFaltasPorAluno(alunoId);
        return ResponseEntity.ok(faltas);
    }

    @Operation(summary = "Listar todas as faltas de um aluno para uma disciplina específica")
    @GetMapping("/aluno/{alunoId}/disciplina/{disciplinaId}")
    public ResponseEntity<List<FaltaResponseDTO>> listarFaltasDoAlunoPorDisciplina(
            @Parameter(description = "ID do aluno") @PathVariable Long alunoId,
            @Parameter(description = "ID da disciplina") @PathVariable Long disciplinaId) {
        List<FaltaResponseDTO> faltas = faltaService.listarFaltasPorAlunoEDisciplina(alunoId, disciplinaId);
        return ResponseEntity.ok(faltas);
    }

    @Operation(summary = "Listar todas as faltas registadas por um professor específico")
    @GetMapping("/professor/{professorId}")
    public ResponseEntity<List<FaltaResponseDTO>> listarFaltasDoProfessor(
            @Parameter(description = "ID do professor para buscar as faltas registadas") @PathVariable Long professorId) {
        List<FaltaResponseDTO> faltas = faltaService.listarFaltasPorProfessor(professorId);
        return ResponseEntity.ok(faltas);
    }

    @Operation(summary = "Listar todas as faltas registadas numa data específica")
    @GetMapping("/data/{dataFalta}")
    public ResponseEntity<List<FaltaResponseDTO>> listarFaltasPorData(
            @Parameter(description = "Data da falta no formato YYYY-MM-DD")
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dataFalta) {
        List<FaltaResponseDTO> faltas = faltaService.listarFaltasPorData(dataFalta);
        return ResponseEntity.ok(faltas);
    }

    @Operation(summary = "Excluir uma falta específica")
    @DeleteMapping("/{faltaId}")
    public ResponseEntity<Void> excluirFalta(
            @Parameter(description = "ID da falta a ser excluída") @PathVariable Long faltaId) {
        faltaService.excluirFalta(faltaId);
        return ResponseEntity.noContent().build(); // Retorna 204 No Content
    }
}
