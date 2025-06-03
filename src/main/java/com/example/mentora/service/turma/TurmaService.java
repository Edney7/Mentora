package com.example.mentora.service.turma;

import com.example.mentora.dto.turma.TurmaCreateDTO;
import com.example.mentora.dto.turma.TurmaResponseDTO;
import com.example.mentora.dto.turma.TurmaUpdateDTO;

import java.util.List;

public interface TurmaService {

    TurmaResponseDTO cadastrar(TurmaCreateDTO dto);

    List<TurmaResponseDTO> listarTurmasAtivas();
    TurmaResponseDTO buscarTurmaAtivaPorId(Long id);

    TurmaResponseDTO atualizar(Long id, TurmaUpdateDTO dto);

    void desativarTurma(Long id);
    void reativarTurma(Long id);

    List<TurmaResponseDTO> listarTodasAsTurmas();
}
