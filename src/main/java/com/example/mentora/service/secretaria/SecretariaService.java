package com.example.mentora.service.secretaria;

import com.example.mentora.dto.secretaria.SecretariaCreateDTO;
import com.example.mentora.dto.secretaria.SecretariaResponseDTO;

import java.util.List;

public interface SecretariaService {
    SecretariaResponseDTO cadastrar(SecretariaCreateDTO dto);
    List<SecretariaResponseDTO> listarTodos();
}
