package com.example.mentora.dto.presenca;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class PresencaCreateDTO {
    @NotNull
    private Long idAluno;

    @NotNull
    private Long idDisciplina;

    @NotNull
    private Boolean presente;

    @NotNull
    private LocalDate dtLancamento;
}
