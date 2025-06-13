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
    @Operation(summary = "Filtrar ausências por nome e mês de ausência ou mês de registro")
    @GetMapping("/filtro")
    public ResponseEntity<List<AusenciaProfessorResponseDTO>> filtrarAusencias(
            @RequestParam(required = false) String nome,
            @RequestParam(required = false) Integer mesAusencia,
            @RequestParam(required = false) Integer mesRegistro) {

        List<AusenciaProfessorResponseDTO> ausencias = ausenciaProfessorService
                .filtrarAusencias(nome, mesAusencia, mesRegistro);

        return ResponseEntity.ok(ausencias);
    }
    @Operation(summary = "Registar uma nova ausência planeada para um professor")
    @PostMapping
    public ResponseEntity<AusenciaProfessorResponseDTO> registarAusencia(
            @Valid @RequestBody AusenciaProfessorCreateDTO ausenciaCreateDTO) {
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
        Long idUsuarioLogadoHipotetico = 1L; // SUBSTITUIR PELA LÓGICA REAL DE OBTER UTILIZADOR LOGADO
        ausenciaProfessorService.cancelarAusencia(ausenciaId, idUsuarioLogadoHipotetico);
        return ResponseEntity.noContent().build();
    }

}