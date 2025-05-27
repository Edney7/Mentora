package com.example.mentora.dto.falta;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NonNull;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class FaltaCreateDTO {
    @NotNull(message = "O ID do aluno é obrigatório.")
    private Long idAluno;

    @NotNull(message = "O ID da disciplina é obrigatório.")
    private Long idDisciplina;

    @NotNull(message = "A data da falta é obrigatória.")
    private LocalDate dataFalta;

    @NotNull(message = "O status de justificada é obrigatório.")
    private Boolean justificada;

    private String descricaoJustificativa;
}
