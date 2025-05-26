package com.example.mentora.service.disciplina;

import com.example.mentora.dto.disciplina.DisciplinaCreateDTO;
import com.example.mentora.dto.disciplina.DisciplinaResponseDTO;

import java.util.List;

public interface DisciplinaService {
    DisciplinaResponseDTO criar(DisciplinaCreateDTO dto);
    List<DisciplinaResponseDTO> listar();
}
