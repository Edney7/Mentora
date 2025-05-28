package com.example.mentora.service.aluno;

import com.example.mentora.dto.aluno.AlunoResponseDTO;
import java.util.List;

public interface AlunoService {
    List<AlunoResponseDTO> listarAtivos();
    AlunoResponseDTO buscarAtivoPorId(Long id);
    // Outros métodos se houver...
}
