package com.example.mentora.service.secretaria;

import com.example.mentora.dto.secretaria.SecretariaResponseDTO;
// Se você criar um SecretariaUpdateDTO para atualizar dados específicos do perfil Secretaria:
// import com.example.mentora.dto.secretaria.SecretariaUpdateDTO;

import java.util.List;

public interface SecretariaService {
    List<SecretariaResponseDTO> listarTodos();
    SecretariaResponseDTO buscarPorId(Long id);
}
