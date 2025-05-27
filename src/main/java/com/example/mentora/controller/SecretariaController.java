package com.example.mentora.controller;

// Removido SecretariaCreateDTO se não for mais usado
import com.example.mentora.dto.secretaria.SecretariaResponseDTO;
import com.example.mentora.service.secretaria.SecretariaService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
// Removido @Valid para o POST, pois o POST foi removido
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*; // @RequestBody removido do import se não houver mais POSTs/PUTs com body aqui

import java.util.List;

@RestController
@RequestMapping("/secretarias") // Este endpoint agora serve para gerenciar perfis de Secretaria existentes
@Tag(name = "Perfis de Secretarias", description = "Visualização e gerenciamento de perfis de secretarias")
public class SecretariaController {

    private final SecretariaService secretariaService;

    public SecretariaController(SecretariaService secretariaService) {
        this.secretariaService = secretariaService;
    }

    @Operation(summary = "Listar todos os perfis de secretarias")
    @GetMapping
    public ResponseEntity<List<SecretariaResponseDTO>> listarTodos() {
        List<SecretariaResponseDTO> secretarias = secretariaService.listarTodos();
        return ResponseEntity.ok(secretarias);
    }

    @Operation(summary = "Buscar perfil de secretaria por ID")
    @GetMapping("/{id}")
    public ResponseEntity<SecretariaResponseDTO> buscarPorId(@PathVariable Long id) {
        SecretariaResponseDTO secretaria = secretariaService.buscarPorId(id);
        return ResponseEntity.ok(secretaria);
    }
}
