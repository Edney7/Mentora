package com.example.mentora.controller;

import com.example.mentora.dto.ofertadisciplinaturma.OfertaDisciplinaTurmaRequestDTO;
import com.example.mentora.dto.ofertadisciplinaturma.OfertaDisciplinaTurmaResponseDTO;
import com.example.mentora.service.turmadisciplinaprofessor.OfertaDisciplinaTurmaService;
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
    private OfertaDisciplinaTurmaService service;

    @Operation(summary = "Associar uma disciplina a um professor em uma turma")
    @PostMapping
    public ResponseEntity<Void> associarDisciplinaProfessorTurma(
            @RequestBody OfertaDisciplinaTurmaRequestDTO request) {
        service.associar(request.getTurmaId(),
                request.getDisciplinaId(),
                request.getProfessorId());
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @Operation(summary = "Listar disciplinas e seus professores para uma turma específica")
    @GetMapping("/turma/{turmaId}")
    public ResponseEntity<List<OfertaDisciplinaTurmaResponseDTO>> listarOfertasPorTurma(
            @PathVariable Long turmaId) {
        List<OfertaDisciplinaTurmaResponseDTO> ofertas = service.listarPorTurma(turmaId);
        return ResponseEntity.ok(ofertas);
    }
}
