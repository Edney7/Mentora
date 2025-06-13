package com.example.mentora.controller;

import com.example.mentora.dto.aluno.AlunoResponseDTO;
import com.example.mentora.service.aluno.AlunoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/alunos") // O endpoint base para operações relacionadas a perfis de alunos
@Tag(name = "Perfis de Alunos", description = "Visualização e gerenciamento de perfis de alunos")
public class AlunoController {

    private final AlunoService alunoService;

    // Injeção de dependência do AlunoService via construtor
    public AlunoController(AlunoService alunoService) {
        this.alunoService = alunoService;
    }

    /**
     * Endpoint para listar todos os perfis de alunos ativos.
     * Um aluno é considerado ativo se o seu Usuário associado estiver ativo.
     * @return ResponseEntity contendo uma lista de AlunoResponseDTO e status HTTP OK.
     */
    @Operation(summary = "Listar todos os perfis de alunos ativos")
    @GetMapping
    public ResponseEntity<List<AlunoResponseDTO>> listarAlunosAtivos() {
        List<AlunoResponseDTO> alunos = alunoService.listarAtivos();
        return ResponseEntity.ok(alunos);
    }

    /**
     * Endpoint para buscar um perfil de aluno ativo pelo seu ID.
     * Retorna o aluno se encontrado e se o Usuário associado estiver ativo.
     * @param id O ID do perfil do aluno a ser buscado.
     * @return ResponseEntity contendo o AlunoResponseDTO e status HTTP OK, ou erro se não encontrado/inativo.
     */
    @Operation(summary = "Buscar perfil de aluno ativo por ID")
    @GetMapping("/{id}")
    public ResponseEntity<AlunoResponseDTO> buscarAlunoAtivoPorId(@PathVariable Long id) {
        AlunoResponseDTO aluno = alunoService.buscarAtivoPorId(id);
        return ResponseEntity.ok(aluno);
    }

    @Operation(summary = "Buscar perfil de aluno pelo ID do Usuário associado",
            description = "Retorna os dados do perfil de aluno (incluindo seu ID) a partir do ID do usuário logado.")
    @GetMapping("/by-usuario/{usuarioId}") // A rota que o frontend vai chamar
    public ResponseEntity<AlunoResponseDTO> buscarAlunoByUsuarioId(
            @Parameter(description = "ID do usuário associado ao aluno") @PathVariable Long usuarioId) {
        AlunoResponseDTO aluno = alunoService.buscarAlunoByUsuarioId(usuarioId);
        return ResponseEntity.ok(aluno);
    }
}
