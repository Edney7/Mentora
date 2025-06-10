package com.example.mentora.service.turmadisciplinaprofessor;

import com.example.mentora.dto.ofertadisciplinaturma.OfertaDisciplinaTurmaResponseDTO;

import java.util.List;

public interface OfertaDisciplinaTurmaService {
    void associar(Long turmaId, Long disciplinaId, Long professorId);
    List<OfertaDisciplinaTurmaResponseDTO> listarPorTurma(Long turmaId);
    // Adicione outros métodos conforme a necessidade (ex: desassociar, atualizar)
}
