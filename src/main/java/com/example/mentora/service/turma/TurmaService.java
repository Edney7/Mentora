package com.example.mentora.service.turma;

import com.example.mentora.dto.turma.TurmaCreateDTO;
import com.example.mentora.dto.turma.TurmaDetalhadaDTO;
import com.example.mentora.dto.turma.TurmaResponseDTO;
import com.example.mentora.dto.turma.TurmaUpdateDTO;

import java.util.List;

public interface TurmaService {

    TurmaResponseDTO cadastrar(TurmaCreateDTO dto);

    List<TurmaResponseDTO> listarTurmasAtivas();
    TurmaResponseDTO buscarTurmaAtivaPorId(Long id);

    TurmaResponseDTO atualizar(Long id, TurmaUpdateDTO dto); // MÉTODO QUE VAMOS IMPLEMENTAR/REVISAR

    void desativarTurma(Long id);
    void reativarTurma(Long id);

    TurmaDetalhadaDTO buscarDetalhesDaTurma(Long id);

    // Métodos para buscar todas as turmas (incluindo inativas) podem ser adicionados aqui para admin
    // List<TurmaResponseDTO> listarTodasAsTurmas();
    // TurmaResponseDTO buscarTurmaPorIdIncluindoInativas(Long id);
}
