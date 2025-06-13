package com.example.mentora.service.professordisciplina;

import com.example.mentora.dto.disciplina.DisciplinaResponseDTO;
import com.example.mentora.dto.professor.ProfessorResponseDTO; // Importar o DTO correto
import com.example.mentora.dto.professordisciplina.AtualizarDisciplinasProfessorRequestDTO;
import com.example.mentora.dto.professordisciplina.VincularDisciplinaProfessorRequestDTO;

import java.util.List;

public interface ProfessorDisciplinaService {

    void vincularDisciplinaAoProfessor(VincularDisciplinaProfessorRequestDTO dto);

    void desvincularDisciplinaDoProfessor(Long professorId, Long disciplinaId);

    void atualizarDisciplinasDoProfessor(AtualizarDisciplinasProfessorRequestDTO dto);

    List<DisciplinaResponseDTO> listarDisciplinasPorProfessor(Long professorId);

    List<ProfessorResponseDTO> listarProfessoresPorDisciplina(Long disciplinaId);
}
