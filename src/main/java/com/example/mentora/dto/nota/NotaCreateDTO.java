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
    // Ajuste o valor máximo conforme a sua escala (ex: 10.0 ou 20.0 se for o caso em Portugal)
    @DecimalMax(value = "100.0", inclusive = true, message = "A nota não pode ser maior que 100.")
    private Double valor;

    @NotNull(message = "O ID do Aluno é obrigatório.")
    private Long alunoId;

    @NotNull(message = "O ID da Disciplina é obrigatório.")
    private Long disciplinaId;

    @NotNull(message = "O ID do Professor é obrigatório.") // Campo adicionado
    private Long professorId;
}