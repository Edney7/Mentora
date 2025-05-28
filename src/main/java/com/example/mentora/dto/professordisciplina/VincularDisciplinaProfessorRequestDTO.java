package com.example.mentora.dto.professordisciplina; // Crie este pacote se necessário

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class VincularDisciplinaProfessorRequestDTO {
    @NotNull(message = "ID do Professor é obrigatório")
    private Long professorId;

    @NotNull(message = "ID da Disciplina é obrigatório")
    private Long disciplinaId;
}