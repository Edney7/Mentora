package com.example.mentora.controller; // Ou o seu pacote de controllers

import com.example.mentora.dto.disciplina.DisciplinaResponseDTO;
import com.example.mentora.dto.professor.ProfessorResponseDTO; // Usaremos este DTO
import com.example.mentora.dto.professordisciplina.AtualizarDisciplinasProfessorRequestDTO;
import com.example.mentora.dto.professordisciplina.VincularDisciplinaProfessorRequestDTO;
import com.example.mentora.service.professordisciplina.ProfessorDisciplinaService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid; // Para validar o corpo da requisição, se necessário
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/professores") // Base path, as operações são sub-recursos de professor ou disciplina
@Tag(name = "Professor - Disciplinas", description = "Gerenciamento da associação entre Professores e Disciplinas")
public class ProfessorDisciplinaController {

    private final ProfessorDisciplinaService professorDisciplinaService;

    public ProfessorDisciplinaController(ProfessorDisciplinaService professorDisciplinaService) {
        this.professorDisciplinaService = professorDisciplinaService;
    }

    @Operation(summary = "Listar todas as disciplinas associadas a um professor específico")
    @GetMapping("/{professorId}/disciplinas")
    public ResponseEntity<List<DisciplinaResponseDTO>> listarDisciplinasDoProfessor(
            @Parameter(description = "ID do professor") @PathVariable Long professorId) {
        List<DisciplinaResponseDTO> disciplinas = professorDisciplinaService.listarDisciplinasPorProfessor(professorId);
        return ResponseEntity.ok(disciplinas);
    }

    // Este endpoint poderia estar em DisciplinaController se preferir focar na disciplina
    @Operation(summary = "Listar todos os professores associados a uma disciplina específica")
    @GetMapping("/disciplinas/{disciplinaId}/professores") // Path alternativo para focar na disciplina
    public ResponseEntity<List<ProfessorResponseDTO>> listarProfessoresDaDisciplina(
            @Parameter(description = "ID da disciplina") @PathVariable Long disciplinaId) {
        List<ProfessorResponseDTO> professores = professorDisciplinaService.listarProfessoresPorDisciplina(disciplinaId);
        return ResponseEntity.ok(professores);
    }

    @Operation(summary = "Vincular uma única disciplina a um professor")
    @PostMapping("/{professorId}/disciplinas/{disciplinaId}")
    public ResponseEntity<Void> vincularDisciplinaAoProfessor(
            @Parameter(description = "ID do professor") @PathVariable Long professorId,
            @Parameter(description = "ID da disciplina a ser vinculada") @PathVariable Long disciplinaId) {

        VincularDisciplinaProfessorRequestDTO dto = new VincularDisciplinaProfessorRequestDTO();
        dto.setProfessorId(professorId);
        dto.setDisciplinaId(disciplinaId);
        professorDisciplinaService.vincularDisciplinaAoProfessor(dto);
        // Retorna 201 Created pois um novo vínculo foi criado
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @Operation(summary = "Desvincular uma disciplina específica de um professor")
    @DeleteMapping("/{professorId}/disciplinas/{disciplinaId}")
    public ResponseEntity<Void> desvincularDisciplinaDoProfessor(
            @Parameter(description = "ID do professor") @PathVariable Long professorId,
            @Parameter(description = "ID da disciplina a ser desvinculada") @PathVariable Long disciplinaId) {
        professorDisciplinaService.desvincularDisciplinaDoProfessor(professorId, disciplinaId);
        // Retorna 204 No Content, indicando sucesso sem corpo de resposta
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "Atualizar (substituir) todas as disciplinas vinculadas a um professor")
    @PutMapping("/{professorId}/disciplinas")
    public ResponseEntity<Void> atualizarDisciplinasDoProfessor(
            @Parameter(description = "ID do professor") @PathVariable Long professorId,
            @Parameter(description = "Lista de IDs das disciplinas que devem estar associadas ao professor. As associações anteriores serão removidas.")
            @RequestBody List<Long> disciplinaIds) { // Recebe diretamente a lista de IDs

        AtualizarDisciplinasProfessorRequestDTO dto = new AtualizarDisciplinasProfessorRequestDTO();
        dto.setProfessorId(professorId);
        dto.setDisciplinaIds(disciplinaIds);
        professorDisciplinaService.atualizarDisciplinasDoProfessor(dto);
        // Retorna 200 OK, pois a operação foi de atualização do conjunto de disciplinas
        return ResponseEntity.ok().build();
    }
}
