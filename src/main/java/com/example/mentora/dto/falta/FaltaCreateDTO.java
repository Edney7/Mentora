package com.example.mentora.dto.falta; // Ou o seu pacote de DTOs

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDate;

@Getter
@Setter
public class FaltaCreateDTO {

    @NotNull(message = "O ID do Aluno é obrigatório.")
    private Long alunoId;

    @NotNull(message = "O ID da Disciplina é obrigatório.")
    private Long disciplinaId;

    @NotNull(message = "O ID do Professor que está a registar a falta é obrigatório.")
    private Long professorId;

    @NotNull(message = "A data da falta é obrigatória.")
    private LocalDate dataFalta;

    // A justificação não é fornecida na criação inicial da falta.
    // Uma falta é criada como não justificada por defeito.
}