package com.example.mentora.dto.falta;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NonNull;
import lombok.Setter;

@Getter
@Setter
public class FaltaCreateDTO {
    @NotNull
    private Long idAluno;

    @NotNull
    private Long idDisciplina;

    @NotNull
    private Boolean justificada;
}
