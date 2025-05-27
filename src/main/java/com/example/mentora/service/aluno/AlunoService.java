package com.example.mentora.service.aluno;

import com.example.mentora.dto.aluno.AlunoResponseDTO;
// Se você criar um AlunoUpdateDTO para atualizar dados específicos do perfil Aluno:
// import com.example.mentora.dto.aluno.AlunoUpdateDTO;

import java.util.List;

public interface AlunoService {
    List<AlunoResponseDTO> listar();
    AlunoResponseDTO buscarPorId(Long id);
}
