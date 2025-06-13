package com.example.mentora.controller;

import com.example.mentora.dto.usuario.UsuarioCreateDTO;
import com.example.mentora.dto.usuario.UsuarioResponseDTO;
import com.example.mentora.dto.usuario.LoginRequestDTO;
import com.example.mentora.dto.usuario.UsuarioUpdateDTO;
import com.example.mentora.service.usuario.UsuarioService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/usuarios")
@Tag(name = "Usuários", description = "Gerenciamento de usuários e autenticação")
public class UsuarioController {

    private final UsuarioService usuarioService;

    public UsuarioController(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    @Operation(summary = "Cadastrar um novo usuário (Aluno, Professor ou Secretaria)")
    @PostMapping
    public ResponseEntity<UsuarioResponseDTO> cadastrar(@Valid @RequestBody UsuarioCreateDTO dto) {
        UsuarioResponseDTO usuarioCriado = usuarioService.cadastrar(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(usuarioCriado);
    }

    @Operation(summary = "Listar todos os usuários ativos")
    @GetMapping
    public ResponseEntity<List<UsuarioResponseDTO>> listarUsuariosAtivos() {
        List<UsuarioResponseDTO> usuarios = usuarioService.listarUsuariosAtivos();
        return ResponseEntity.ok(usuarios);
    }

    @Operation(summary = "Buscar um usuário ativo por ID")
    @GetMapping("/{id}")
    public ResponseEntity<UsuarioResponseDTO> buscarUsuarioAtivoPorId(@PathVariable Long id) {
        UsuarioResponseDTO usuario = usuarioService.buscarUsuarioAtivoPorId(id);
        return ResponseEntity.ok(usuario);
    }

    @Operation(summary = "Listar TODOS os usuários (ativos e inativos) - Acesso restrito (ex: Admin)")
    @GetMapping("/todos") // Novo endpoint
    public ResponseEntity<List<UsuarioResponseDTO>> listarTodosOsUsuarios() {
        List<UsuarioResponseDTO> usuarios = usuarioService.listarTodosOsUsuarios();
        return ResponseEntity.ok(usuarios);
    }

    @Operation(summary = "Buscar um usuário por ID (ativo ou inativo) - Acesso restrito (ex: Admin)")
    @GetMapping("/todos/{id}") // Novo endpoint para diferenciar da busca apenas por ativos
    public ResponseEntity<UsuarioResponseDTO> buscarUsuarioPorIdIncluindoInativos(@PathVariable Long id) {
        UsuarioResponseDTO usuario = usuarioService.buscarUsuarioPorIdIncluindoInativos(id);
        return ResponseEntity.ok(usuario);
    }


    @Operation(summary = "Autenticar um usuário")
    @PostMapping("/login")
    public ResponseEntity<UsuarioResponseDTO> login(@Valid @RequestBody LoginRequestDTO dto) {
        UsuarioResponseDTO usuarioAutenticado = usuarioService.autenticar(dto);
        return ResponseEntity.ok(usuarioAutenticado);
    }

    @Operation(summary = "Desativar um usuário (soft delete)")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> desativarUsuario(@PathVariable Long id) {
        usuarioService.desativarUsuario(id);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "Reativar um usuário")
    @PostMapping("/{id}/reativar")
    public ResponseEntity<Void> reativarUsuario(@PathVariable Long id) {
        usuarioService.reativarUsuario(id);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<UsuarioResponseDTO> atualizarUsuario(@PathVariable Long id, @RequestBody UsuarioUpdateDTO dto) {
        UsuarioResponseDTO atualizado = usuarioService.atualizar(id, dto);
        return ResponseEntity.ok(atualizado);
    }

}
