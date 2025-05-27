package com.example.mentora.service.professor;

import com.example.mentora.dto.professor.ProfessorCreateDTO;
import com.example.mentora.dto.professor.ProfessorResponseDTO;

import java.util.List;

public interface ProfessorService {
    ProfessorResponseDTO cadastrar(ProfessorCreateDTO dto);
    List<ProfessorResponseDTO> listarTodos();
}

