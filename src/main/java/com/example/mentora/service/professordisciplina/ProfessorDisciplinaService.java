package com.example.mentora.service.professordisciplina;

import com.example.mentora.dto.professordisciplina.ProfessorDisciplinaCreateDTO;
import com.example.mentora.dto.professordisciplina.ProfessorDisciplinaResponseDTO;

import java.util.List;

public interface ProfessorDisciplinaService {
    ProfessorDisciplinaResponseDTO vincular(ProfessorDisciplinaCreateDTO dto);
    List<ProfessorDisciplinaResponseDTO> listarTodos();
}
