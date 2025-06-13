package com.example.mentora.controller;

import com.example.mentora.dto.secretaria.SecretariaResponseDTO;
import com.example.mentora.service.secretaria.SecretariaService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/secretarias") // O endpoint base para operações relacionadas a perfis de secretaria
@Tag(name = "Perfis de Secretarias", description = "Visualização e gestão de perfis de secretarias")
public class SecretariaController {

    private final SecretariaService secretariaService;

    // Injeção de dependência do SecretariaService via construtor
    public SecretariaController(SecretariaService secretariaService) {
        this.secretariaService = secretariaService;
    }

    @Operation(summary = "Listar todos os perfis de secretarias ativos")
    @GetMapping
    public ResponseEntity<List<SecretariaResponseDTO>> listarSecretariasAtivas() { // Nome do método atualizado
        List<SecretariaResponseDTO> secretarias = secretariaService.listarSecretariasAtivas(); // Chamada correta
        return ResponseEntity.ok(secretarias);
    }

    @Operation(summary = "Buscar perfil de secretaria ativo por ID")
    @GetMapping("/{id}")
    public ResponseEntity<SecretariaResponseDTO> buscarSecretariaAtivaPorId(@PathVariable Long id) { // Nome do método atualizado
        SecretariaResponseDTO secretaria = secretariaService.buscarSecretariaAtivaPorId(id); // Chamada correta
        return ResponseEntity.ok(secretaria);
    }

}
