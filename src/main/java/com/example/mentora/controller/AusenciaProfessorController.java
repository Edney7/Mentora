package com.example.mentora.controller; // Ou o seu pacote de controllers

import com.example.mentora.dto.ausenciaprofessor.AusenciaProfessorCreateDTO;
import com.example.mentora.dto.ausenciaprofessor.AusenciaProfessorResponseDTO;
import com.example.mentora.service.ausenciaprofessor.AusenciaProfessorService;
// Para obter o utilizador autenticado (se necessário para validação de permissão mais granular)
// import org.springframework.security.core.annotation.AuthenticationPrincipal;
// import org.springframework.security.core.userdetails.UserDetails;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/ausencias-professor") // Endpoint base para ausências de professor
@Tag(name = "Ausências de Professores", description = "Operações relacionadas ao registo e gestão de ausências de professores")
public class AusenciaProfessorController {

    private final AusenciaProfessorService ausenciaProfessorService;

    @Autowired
    public AusenciaProfessorController(AusenciaProfessorService ausenciaProfessorService) {
        this.ausenciaProfessorService = ausenciaProfessorService;
    }

    @Operation(summary = "Registar uma nova ausência planeada para um professor")
    @PostMapping
    public ResponseEntity<AusenciaProfessorResponseDTO> registarAusencia(
            @Valid @RequestBody AusenciaProfessorCreateDTO ausenciaCreateDTO) {
        // Numa implementação real com Spring Security, obteríamos o ID do professor logado
        // a partir do contexto de segurança para o parâmetro 'professorLogadoUsuarioId'.
        // Exemplo simplificado: Se for a secretaria a registar, o professorId já vem no DTO.
        // Se for o próprio professor, o controller poderia extrair o seu ID de usuário do Principal
        // e o serviço buscaria o ID do perfil Professor.
        // Por agora, vamos assumir que o professorId no DTO é o alvo e o segundo parâmetro do serviço pode ser null
        // se a lógica de permissão no serviço for adaptada ou se o controller enriquecer isso.

        // Para este exemplo, vamos assumir que se o professor está a registar a sua própria ausência,
        // o ID do professor no DTO deve corresponder ao ID do utilizador logado (após conversão para ID de Professor).
        // Esta lógica de permissão seria mais robusta com Spring Security.
        // Long professorLogadoUsuarioId = obterIdDoUsuarioLogado(); // Função hipotética
        // AusenciaProfessorResponseDTO ausenciaRegistada = ausenciaProfessorService.registarAusencia(ausenciaCreateDTO, professorLogadoUsuarioId);

        // Simplificação para este exemplo: o serviço usará o professorId do DTO.
        // A lógica de permissão no serviço (se professorLogadoId é null, assume secretaria, etc.) será acionada.
        AusenciaProfessorResponseDTO ausenciaRegistada = ausenciaProfessorService.registarAusencia(ausenciaCreateDTO, null); // Passando null para professorLogadoId por agora
        return ResponseEntity.status(HttpStatus.CREATED).body(ausenciaRegistada);
    }

    @Operation(summary = "Buscar uma ausência de professor específica pelo seu ID")
    @GetMapping("/{id}")
    public ResponseEntity<AusenciaProfessorResponseDTO> buscarAusenciaPorId(
            @Parameter(description = "ID da ausência") @PathVariable Long id) {
        AusenciaProfessorResponseDTO ausencia = ausenciaProfessorService.buscarAusenciaPorId(id);
        return ResponseEntity.ok(ausencia);
    }

    @Operation(summary = "Listar todas as ausências registadas para um professor específico")
    @GetMapping("/professor/{professorId}")
    public ResponseEntity<List<AusenciaProfessorResponseDTO>> listarAusenciasDoProfessor(
            @Parameter(description = "ID do professor para buscar as ausências") @PathVariable Long professorId) {
        List<AusenciaProfessorResponseDTO> ausencias = ausenciaProfessorService.listarAusenciasPorProfessor(professorId);
        return ResponseEntity.ok(ausencias);
    }

    @Operation(summary = "Listar todas as ausências de professores registadas numa data específica")
    @GetMapping("/data/{dataAusencia}")
    public ResponseEntity<List<AusenciaProfessorResponseDTO>> listarAusenciasPorData(
            @Parameter(description = "Data da ausência no formato YYYY-MM-DD")
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dataAusencia) {
        List<AusenciaProfessorResponseDTO> ausencias = ausenciaProfessorService.listarAusenciasPorData(dataAusencia);
        return ResponseEntity.ok(ausencias);
    }

    @Operation(summary = "Listar todas as ausências de professores planeadas (visão geral)")
    @GetMapping
    public ResponseEntity<List<AusenciaProfessorResponseDTO>> listarTodasAusencias() {
        List<AusenciaProfessorResponseDTO> ausencias = ausenciaProfessorService.listarTodasAusencias();
        return ResponseEntity.ok(ausencias);
    }

    @Operation(summary = "Cancelar (excluir) uma ausência planeada de professor")
    @DeleteMapping("/{ausenciaId}")
    public ResponseEntity<Void> cancelarAusencia(
            @Parameter(description = "ID da ausência a ser cancelada") @PathVariable Long ausenciaId) {
        // Numa implementação real com Spring Security, obteríamos o ID do utilizador logado.
        // Long usuarioLogadoId = obterIdDoUsuarioLogado(); // Função hipotética
        // ausenciaProfessorService.cancelarAusencia(ausenciaId, usuarioLogadoId);

        // Simplificação: Para este exemplo, vamos assumir que a verificação de permissão
        // dentro do serviço lidará com isso ou que este endpoint é para administradores/secretaria.
        // Se for um professor a cancelar a sua própria, o serviço precisaria do ID do utilizador logado.
        // Para um teste simples, podemos passar um ID de utilizador fixo (ex: ID de uma secretaria)
        // ou adaptar o serviço para não exigir o usuarioLogadoId se a permissão for tratada de outra forma.
        // Por agora, passarei um ID de utilizador hipotético (ex: 1L) para a lógica de permissão no serviço.
        // Substitua isto pela obtenção real do ID do utilizador logado.
        Long idUsuarioLogadoHipotetico = 1L; // SUBSTITUIR PELA LÓGICA REAL DE OBTER UTILIZADOR LOGADO
        ausenciaProfessorService.cancelarAusencia(ausenciaId, idUsuarioLogadoHipotetico);
        return ResponseEntity.noContent().build();
    }

    // Função hipotética para obter o ID do utilizador logado (a ser implementada com Spring Security)
    /*
    private Long obterIdDoUsuarioLogado() {
        // Lógica para obter o UserDetails/Principal do Spring Security
        // Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        // if (principal instanceof UserDetails) {
        //     String username = ((UserDetails)principal).getUsername();
        //     // Buscar o usuário pelo username e retornar o ID
        //     // Usuario usuario = usuarioRepository.findByEmail(username).orElse(null);
        //     // return (usuario != null) ? usuario.getId() : null;
        // }
        return null; // Retornar null ou lançar exceção se não autenticado
    }
    */
}
