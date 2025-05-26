package com.example.mentora.dto.secretaria;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SecretariaCreateDTO {

    @NotNull(message = "ID do usuário é obrigatório")
    private Long idUsuario;
}
