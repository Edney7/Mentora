package com.example.mentora.dto.professordisciplina;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import java.util.List;

@Getter
@Setter
public class AtualizarDisciplinasProfessorRequestDTO {
    @NotNull(message = "ID do Professor é obrigatório")
    private Long professorId;

    // Lista de IDs das disciplinas a serem associadas.
    // Pode ser vazia para desvincular todas as disciplinas.
    private List<Long> disciplinaIds;
}