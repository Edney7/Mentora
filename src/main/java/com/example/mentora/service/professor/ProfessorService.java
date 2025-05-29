package com.example.mentora.service.professor;

import com.example.mentora.dto.professor.ProfessorResponseDTO;
import java.util.List;

public interface ProfessorService {
    // O método de cadastro individual foi removido anteriormente.

    List<ProfessorResponseDTO> listarProfessoresAtivos(); // Anteriormente listarTodos()
    ProfessorResponseDTO buscarProfessorAtivoPorId(Long id); // Anteriormente buscarPorId()

    // Outros métodos específicos para gerenciamento de Professor, se houver
    // Ex: vincularDisciplinasAoProfessor(Long professorId, List<Long> disciplinaIds);
}
