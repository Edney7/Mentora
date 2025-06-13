package com.example.mentora.service.ausenciaprofessor;

import com.example.mentora.dto.ausenciaprofessor.AusenciaProfessorCreateDTO;
import com.example.mentora.dto.ausenciaprofessor.AusenciaProfessorResponseDTO;

import java.time.LocalDate;
import java.util.List;

public interface AusenciaProfessorService {

    AusenciaProfessorResponseDTO registarAusencia(AusenciaProfessorCreateDTO dto, Long professorLogadoId);

    AusenciaProfessorResponseDTO buscarAusenciaPorId(Long id);

    List<AusenciaProfessorResponseDTO> listarAusenciasPorProfessor(Long professorId);

    List<AusenciaProfessorResponseDTO> listarAusenciasPorData(LocalDate dataAusencia);

    List<AusenciaProfessorResponseDTO> listarTodasAusencias();

    void cancelarAusencia(Long ausenciaId, Long usuarioLogadoId);

    List<AusenciaProfessorResponseDTO> filtrarAusencias(String nome, Integer mesAusencia, Integer mesRegistro);

}