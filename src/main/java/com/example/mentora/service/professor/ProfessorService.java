package com.example.mentora.service.professor;

import com.example.mentora.dto.professor.ProfessorResponseDTO;
import java.util.List;

public interface ProfessorService {

    List<ProfessorResponseDTO> listarProfessoresAtivos();
    ProfessorResponseDTO buscarProfessorAtivoPorId(Long id);

}
