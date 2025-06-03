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

    private List<Long> disciplinaIds;
}