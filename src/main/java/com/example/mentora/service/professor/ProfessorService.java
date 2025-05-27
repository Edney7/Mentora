package com.example.mentora.service.professor;

import com.example.mentora.dto.professor.ProfessorResponseDTO;
// Se você criar um ProfessorUpdateDTO para atualizar dados específicos do perfil Professor:
// import com.example.mentora.dto.professor.ProfessorUpdateDTO;

import java.util.List;

public interface ProfessorService {
    List<ProfessorResponseDTO> listarTodos();
    ProfessorResponseDTO buscarPorId(Long id);
    // ProfessorResponseDTO atualizar(Long id, ProfessorUpdateDTO dto); // Exemplo
    // void deletar(Long id); // Exemplo (cuidado com o usuário e disciplinas associadas)
}
