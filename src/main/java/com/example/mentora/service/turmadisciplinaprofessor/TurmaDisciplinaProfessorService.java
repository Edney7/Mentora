package com.example.mentora.service.turmadisciplinaprofessor;

import com.example.mentora.dto.turmadisciplinaprofessor.TurmaDisciplinaProfessorResponseDTO;
import com.example.mentora.dto.turma.TurmaResponseDTO;

import java.util.List;

public interface TurmaDisciplinaProfessorService {
    void associar(Long turmaId, Long disciplinaId, Long professorId);
    List<TurmaDisciplinaProfessorResponseDTO> listarPorTurma(Long turmaId);
    // Adicione outros métodos conforme a necessidade (ex: desassociar, atualizar)
    List<TurmaResponseDTO> listarTurmasPorProfessor(Long professorId);
}
