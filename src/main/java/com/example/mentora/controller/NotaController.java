package com.example.mentora.controller; // Ou o seu pacote de controllers

import com.example.mentora.dto.nota.AlunoNotasResumoDTO;
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

    @Operation(summary = "Resumo de notas de um aluno (com totais e por disciplina)")
    @GetMapping("/aluno/{alunoId}/resumo")
    public ResponseEntity<AlunoNotasResumoDTO> buscarResumoNotas(
            @Parameter(description = "ID do aluno") @PathVariable Long alunoId){
        AlunoNotasResumoDTO resumo = notaService.buscarResumoNotas(alunoId);
        return ResponseEntity.ok(resumo);
    }
}