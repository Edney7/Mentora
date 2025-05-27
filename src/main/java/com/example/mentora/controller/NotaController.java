package com.example.mentora.controller;

import com.example.mentora.dto.nota.NotaCreateDTO;
import com.example.mentora.dto.nota.NotaResponseDTO;
import com.example.mentora.service.nota.NotaService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/notas")
@Tag(name = "Notas", description = "Gerenciamento de Notas dos Alunos")
public class NotaController {

    private final NotaService notaService;

    public NotaController(NotaService notaService) {
        this.notaService = notaService;
    }

    @PostMapping
    @Operation(summary = "Cadastrar nota")
    public ResponseEntity<NotaResponseDTO> cadastrar(@Valid @RequestBody NotaCreateDTO dto) {
        return ResponseEntity.ok(notaService.cadastrar(dto));
    }

    @GetMapping
    @Operation(summary = "Listar notas")
    public ResponseEntity<List<NotaResponseDTO>> listar() {
        return ResponseEntity.ok(notaService.listar());
    }
}
