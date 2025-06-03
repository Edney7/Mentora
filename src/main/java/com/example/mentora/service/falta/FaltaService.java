package com.example.mentora.service.falta; // Ou o seu pacote de serviços

import com.example.mentora.dto.falta.FaltaCreateDTO;
import com.example.mentora.dto.falta.FaltaJustificativaDTO;
import com.example.mentora.dto.falta.FaltaResponseDTO;

import java.time.LocalDate;
import java.util.List;

public interface FaltaService {

    FaltaResponseDTO registarFalta(FaltaCreateDTO dto);

    FaltaResponseDTO justificarFalta(Long faltaId, FaltaJustificativaDTO dto);

    FaltaResponseDTO buscarFaltaPorId(Long id);

    List<FaltaResponseDTO> listarFaltasPorAluno(Long alunoId);

    List<FaltaResponseDTO> listarFaltasPorAlunoEDisciplina(Long alunoId, Long disciplinaId);

    List<FaltaResponseDTO> listarFaltasPorProfessor(Long professorId);

    List<FaltaResponseDTO> listarFaltasPorData(LocalDate dataFalta);

    void excluirFalta(Long faltaId);

    List<FaltaResponseDTO> listarTodasFaltas();
}
