package com.example.mentora.controller;

import com.example.mentora.dto.UsuarioCreateDTO;
import com.example.mentora.dto.UsuarioResponseDTO;
import com.example.mentora.service.UsuarioService;
import com.example.mentora.repository.UsuarioRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/usuarios")
@Tag(name = "Usuários", description = "Operações relacionadas aos usuários")
public class UsuarioController {

    private final UsuarioService usuarioService;
    private final UsuarioRepository repository;

    public UsuarioController(UsuarioService usuarioService, UsuarioRepository repository) {
        this.usuarioService = usuarioService;
        this.repository = repository;
    }

    @Operation(summary = "Listar todos os usuários")
    @GetMapping
    public ResponseEntity<List<UsuarioResponseDTO>> listar() {
        var usuarios = repository.findAll()
                .stream()
                .map(usuarioService::toResponseDTO)
                .collect(Collectors.toList());

        return ResponseEntity.ok(usuarios);
    }

    @Operation(summary = "Criar um novo usuário")
    @PostMapping
    public ResponseEntity<UsuarioResponseDTO> criar(@Valid @RequestBody UsuarioCreateDTO dto) {
        UsuarioResponseDTO response = usuarioService.cadastrar(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}
