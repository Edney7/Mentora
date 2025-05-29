package com.example.mentora.controller; // Ou o seu pacote de controllers

import com.example.mentora.dto.disciplina.DisciplinaCreateDTO;
import com.example.mentora.dto.disciplina.DisciplinaResponseDTO;
import com.example.mentora.dto.disciplina.DisciplinaUpdateDTO;
import com.example.mentora.service.disciplina.DisciplinaService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/disciplinas")
@Tag(name = "Disciplinas", description = "Gerenciamento de disciplinas acadêmicas")
public class DisciplinaController {

    private final DisciplinaService disciplinaService;

    @Autowired
    public DisciplinaController(DisciplinaService disciplinaService) {
        this.disciplinaService = disciplinaService;
    }

    @Operation(summary = "Cadastrar uma nova disciplina")
    @PostMapping
    public ResponseEntity<DisciplinaResponseDTO> cadastrarDisciplina(@Valid @RequestBody DisciplinaCreateDTO dto) {
        DisciplinaResponseDTO disciplinaCriada = disciplinaService.cadastrar(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(disciplinaCriada);
    }

    @Operation(summary = "Listar todas as disciplinas")
    @GetMapping
    public ResponseEntity<List<DisciplinaResponseDTO>> listarTodasDisciplinas() {
        List<DisciplinaResponseDTO> disciplinas = disciplinaService.listarTodas();
        return ResponseEntity.ok(disciplinas);
    }

    @Operation(summary = "Buscar uma disciplina por ID")
    @GetMapping("/{id}")
    public ResponseEntity<DisciplinaResponseDTO> buscarDisciplinaPorId(@PathVariable Long id) {
        DisciplinaResponseDTO disciplina = disciplinaService.buscarPorId(id);
        return ResponseEntity.ok(disciplina);
    }

    @Operation(summary = "Atualizar os dados de uma disciplina")
    @PutMapping("/{id}")
    public ResponseEntity<DisciplinaResponseDTO> atualizarDisciplina(
            @PathVariable Long id,
            @Valid @RequestBody DisciplinaUpdateDTO dto) {
        DisciplinaResponseDTO disciplinaAtualizada = disciplinaService.atualizar(id, dto);
        return ResponseEntity.ok(disciplinaAtualizada);
    }

    @Operation(summary = "Excluir uma disciplina")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluirDisciplina(@PathVariable Long id) {
        disciplinaService.excluir(id);
        return ResponseEntity.noContent().build(); // Retorna 204 No Content
    }
}
