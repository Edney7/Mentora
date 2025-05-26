package com.example.mentora.dto.professor;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ProfessorCreateDTO {
    @NotNull(message = "ID do usuário é obrigatório")
    private Long idUsuario;
}
