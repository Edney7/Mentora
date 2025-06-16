package com.example.mentora.controller;

import com.example.mentora.dto.turmadisciplinaprofessor.TurmaDisciplinaProfessorRequestDTO;
import com.example.mentora.dto.turmadisciplinaprofessor.TurmaDisciplinaProfessorResponseDTO;
import com.example.mentora.dto.turma.TurmaResponseDTO;
import com.example.mentora.service.turmadisciplinaprofessor.TurmaDisciplinaProfessorService;
import io.swagger.v3.oas.annotations.Operation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/turma-disciplina-professor")
public class TurmaDisciplinaProfessorController {


    @Autowired
    private TurmaDisciplinaProfessorService service;

    @Operation(summary = "Associar uma disciplina a um professor em uma turma")
    @PostMapping
    public ResponseEntity<Void> associarDisciplinaProfessorTurma(
            @RequestBody TurmaDisciplinaProfessorRequestDTO request) {
        service.associar(request.getTurmaId(),
                request.getDisciplinaId(),
                request.getProfessorId());
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @Operation(summary = "Listar disciplinas e seus professores para uma turma específica")
    @GetMapping("/turma/{turmaId}")
    public ResponseEntity<List<TurmaDisciplinaProfessorResponseDTO>> listarOfertasPorTurma(
            @PathVariable Long turmaId) {
        List<TurmaDisciplinaProfessorResponseDTO> ofertas = service.listarPorTurma(turmaId);
        return ResponseEntity.ok(ofertas);
    }
    @Operation(summary = "listar as turmas do professor")
    @GetMapping("/professor/{professorId}")
    public List<TurmaResponseDTO> listarTurmasDoProfessor(@PathVariable Long professorId) {
        return service.listarTurmasPorProfessor(professorId);
    }
}
