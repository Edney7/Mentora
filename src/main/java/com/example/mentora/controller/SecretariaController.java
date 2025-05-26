package com.example.mentora.controller;

import com.example.mentora.dto.secretaria.SecretariaCreateDTO;
import com.example.mentora.dto.secretaria.SecretariaResponseDTO;
import com.example.mentora.service.secretaria.SecretariaService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/secretarias")
@Tag(name = "Secretarias", description = "Gerenciamento de secretarias")
public class SecretariaController {

    private final SecretariaService secretariaService;

    public SecretariaController(SecretariaService secretariaService) {
        this.secretariaService = secretariaService;
    }

    @Operation(summary = "Cadastrar uma nova secretaria")
    @PostMapping
    public ResponseEntity<SecretariaResponseDTO> cadastrar(@Valid @RequestBody SecretariaCreateDTO dto) {
        return ResponseEntity.ok(secretariaService.cadastrar(dto));
    }

    @Operation(summary = "Listar todas as secretarias")
    @GetMapping
    public ResponseEntity<List<SecretariaResponseDTO>> listarTodos() {
        return ResponseEntity.ok(secretariaService.listarTodos());
    }
}
