package com.example.mentora.service.aluno;

import com.example.mentora.dto.aluno.AlunoCreateDTO;
import com.example.mentora.dto.aluno.AlunoResponseDTO;

import java.util.List;

public interface AlunoService {
    AlunoResponseDTO cadastrar(AlunoCreateDTO dto);
    List<AlunoResponseDTO> listar();
}
