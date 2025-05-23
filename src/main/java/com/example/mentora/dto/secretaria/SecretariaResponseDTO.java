package com.example.mentora.dto.secretaria;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class SecretariaResponseDTO {
    private Long id;
    private Long idUsuario;
    private String nomeUsuario;
    private String emailUsuario;
}
