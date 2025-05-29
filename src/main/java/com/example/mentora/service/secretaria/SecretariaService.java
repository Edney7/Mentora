package com.example.mentora.service.secretaria;

import com.example.mentora.dto.secretaria.SecretariaResponseDTO;
import java.util.List;

public interface SecretariaService {
    // O método de cadastro individual foi removido anteriormente.

    List<SecretariaResponseDTO> listarSecretariasAtivas(); // Anteriormente listarTodos()
    SecretariaResponseDTO buscarSecretariaAtivaPorId(Long id); // Anteriormente buscarPorId()

    // Outros métodos específicos para gestão de Secretaria, se houver
}
