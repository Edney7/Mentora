package com.example.mentora.controller; // Ou o seu pacote de controllers

import com.example.mentora.dto.nota.NotaCreateDTO;
import com.example.mentora.dto.nota.NotaResponseDTO;
import com.example.mentora.dto.nota.NotaUpdateDTO; // Importar se for usar endpoints de atualização
import com.example.mentora.service.nota.NotaService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/notas")
@Tag(name = "Notas", description = "Operações relacionadas ao lançamento e visualização de notas")
public class NotaController {

    private final NotaService notaService;

    @Autowired
    public NotaController(NotaService notaService) {
        this.notaService = notaService;
    }

    @Operation(summary = "Lançar (criar) uma nova nota")
    @PostMapping
    public ResponseEntity<NotaResponseDTO> lancarNota(@Valid @RequestBody NotaCreateDTO notaCreateDTO) {
        NotaResponseDTO notaCriada = notaService.lancarNota(notaCreateDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(notaCriada);
    }
    @GetMapping
    public List<NotaResponseDTO> listarTodasNotas() {
        return notaService.listarTodasNotas();
    }
    @Operation(summary = "Buscar uma nota específica pelo seu ID")
    @GetMapping("/{id}")
    public ResponseEntity<NotaResponseDTO> buscarNotaPorId(@PathVariable Long id) {
        NotaResponseDTO nota = notaService.buscarNotaPorId(id);
        return ResponseEntity.ok(nota);
    }

    @Operation(summary = "Listar todas as notas de um aluno específico")
    @GetMapping("/aluno/{alunoId}")
    public ResponseEntity<List<NotaResponseDTO>> listarNotasDoAluno(
            @Parameter(description = "ID do aluno para buscar as notas") @PathVariable Long alunoId) {
        List<NotaResponseDTO> notas = notaService.listarNotasPorAluno(alunoId);
        return ResponseEntity.ok(notas);
    }

    @Operation(summary = "Listar todas as notas de um aluno para uma disciplina específica")
    @GetMapping("/aluno/{alunoId}/disciplina/{disciplinaId}")
    public ResponseEntity<List<NotaResponseDTO>> listarNotasDoAlunoPorDisciplina(
            @Parameter(description = "ID do aluno") @PathVariable Long alunoId,
            @Parameter(description = "ID da disciplina") @PathVariable Long disciplinaId) {
        List<NotaResponseDTO> notas = notaService.listarNotasPorAlunoEDisciplina(alunoId, disciplinaId);
        return ResponseEntity.ok(notas);
    }

    // --- Endpoints Opcionais (descomente e implemente no serviço se necessário) ---

    /*
    @Operation(summary = "Atualizar uma nota existente")
    @PutMapping("/{notaId}")
    public ResponseEntity<NotaResponseDTO> atualizarNota(
            @Parameter(description = "ID da nota a ser atualizada") @PathVariable Long notaId,
            @Valid @RequestBody NotaUpdateDTO notaUpdateDTO) {
        NotaResponseDTO notaAtualizada = notaService.atualizarNota(notaId, notaUpdateDTO);
        return ResponseEntity.ok(notaAtualizada);
    }
    */

    /*
    @Operation(summary = "Excluir uma nota específica")
    @DeleteMapping("/{notaId}")
    public ResponseEntity<Void> excluirNota(
            @Parameter(description = "ID da nota a ser excluída") @PathVariable Long notaId) {
        notaService.excluirNota(notaId);
        return ResponseEntity.noContent().build();
    }
    */

    /*
    @Operation(summary = "Listar todas as notas lançadas por um professor específico")
    @GetMapping("/professor/{professorId}")
    public ResponseEntity<List<NotaResponseDTO>> listarNotasDoProfessor(
            @Parameter(description = "ID do professor para buscar as notas lançadas") @PathVariable Long professorId) {
        List<NotaResponseDTO> notas = notaService.listarNotasPorProfessor(professorId); // Requer implementação no serviço
        return ResponseEntity.ok(notas);
    }
    */
}
