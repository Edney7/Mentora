package com.example.mentora.dto.turmadisciplina; // Ou seu pacote de DTOs

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class VincularDisciplinaTurmaRequestDTO {
    @NotNull(message = "ID da Turma é obrigatório")
    private Long turmaId;

    @NotNull(message = "ID da Disciplina é obrigatório")
    private Long disciplinaId;
}