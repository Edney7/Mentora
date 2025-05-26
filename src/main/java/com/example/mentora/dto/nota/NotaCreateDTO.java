package com.example.mentora.dto.nota;

import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class NotaCreateDTO {

    @NotNull(message = "Valor da nota é obrigatório")
    private Double valor;

    @NotNull(message = "Data de lançamento é obrigatória")
    private LocalDate dtLancamento;

    @NotNull(message = "ID do aluno é obrigatório")
    private Long idAluno;

    @NotNull(message = "ID da disciplina é obrigatório")
    private Long idDisciplina;
}
