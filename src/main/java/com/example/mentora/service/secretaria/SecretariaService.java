package com.example.mentora.service.secretaria;

import com.example.mentora.dto.secretaria.SecretariaResponseDTO;
import java.util.List;

public interface SecretariaService {

    List<SecretariaResponseDTO> listarSecretariasAtivas();
    SecretariaResponseDTO buscarSecretariaAtivaPorId(Long id);

}
