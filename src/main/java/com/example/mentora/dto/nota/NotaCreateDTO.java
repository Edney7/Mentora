package com.example.mentora.dto.nota;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class NotaCreateDTO {

    @NotNull(message = "O valor da nota é obrigatório.")
    @DecimalMin(value = "0.0", inclusive = true, message = "A nota não pode ser menor que 0.")
    @DecimalMax(value = "100.0", inclusive = true, message = "A nota não pode ser maior que 100.")
    private Double valor;

    @NotNull(message = "O ID do Aluno é obrigatório.")
    private Long alunoId;

    @NotNull(message = "O ID da Disciplina é obrigatório.")
    private Long disciplinaId;

    @NotNull(message = "O ID do Professor é obrigatório.")
    private Long professorId;
}