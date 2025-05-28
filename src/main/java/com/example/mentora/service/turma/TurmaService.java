package com.example.mentora.service.turma;

import com.example.mentora.dto.turma.TurmaCreateDTO;
import com.example.mentora.dto.turma.TurmaResponseDTO;
import com.example.mentora.dto.turma.TurmaUpdateDTO;

import java.util.List;

public interface TurmaService {

    TurmaResponseDTO cadastrar(TurmaCreateDTO dto); // Cria uma turma ativa por padrão

    List<TurmaResponseDTO> listarTurmasAtivas(); // Anteriormente listar()
    TurmaResponseDTO buscarTurmaAtivaPorId(Long id); // Anteriormente buscarPorId()

    TurmaResponseDTO atualizar(Long id, TurmaUpdateDTO dto); // Pode atualizar o status 'ativa'

    void desativarTurma(Long id); // Novo método para soft delete (substitui excluir)
    void reativarTurma(Long id);  // Novo método para reativar

    // Se precisar de métodos para buscar todas as turmas (incluindo inativas) para admin:
    // List<TurmaResponseDTO> listarTodasAsTurmas();
    // TurmaResponseDTO buscarTurmaPorIdIncluindoInativas(Long id);
}
