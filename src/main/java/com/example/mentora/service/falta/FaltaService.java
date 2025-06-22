package com.example.mentora.service.falta; // Ou o seu pacote de serviços

import com.example.mentora.dto.falta.AlunoFaltasResumoDTO;
import com.example.mentora.dto.falta.FaltaCreateDTO;
import com.example.mentora.dto.falta.FaltaResponseDTO;

import java.time.LocalDate;
import java.util.List;

public interface FaltaService {

    FaltaResponseDTO registrarFalta(FaltaCreateDTO dto);

    //FaltaResponseDTO justificarFalta(Long faltaId, FaltaJustificativaDTO dto);

    FaltaResponseDTO buscarFaltaPorId(Long id);

    List<FaltaResponseDTO> listarFaltasPorAluno(Long alunoId);

    List<FaltaResponseDTO> listarFaltasPorAlunoEDisciplina(Long alunoId, Long disciplinaId);
    // <<<<<<<< ADICIONE ESTE MÉTODO AQUI NA INTERFACE >>>>>>>>
    List<FaltaResponseDTO> sincronizarFaltasPorAula(Long aulaId, List<FaltaCreateDTO> faltasParaManter, Long professorQueEstaRegistrandoId);

    // <<<<<<<< E este também, se ainda não estiver >>>>>>>>
    List<FaltaResponseDTO> listarFaltasDeUmaAula(Long aulaId);
    List<FaltaResponseDTO> listarFaltasPorProfessor(Long professorId);

    List<FaltaResponseDTO> listarFaltasPorData(LocalDate dataFalta);

    void excluirFalta(Long faltaId);

    List<FaltaResponseDTO> listarTodasFaltas();

    AlunoFaltasResumoDTO buscarResumoFaltasPorAluno(Long alunoId);
}