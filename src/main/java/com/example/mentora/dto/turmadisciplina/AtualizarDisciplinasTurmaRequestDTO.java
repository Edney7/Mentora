package com.example.mentora.dto.turmadisciplina;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import java.util.List;

@Getter
@Setter
public class AtualizarDisciplinasTurmaRequestDTO {
    @NotNull(message = "ID da Turma é obrigatório")
    private Long turmaId;

    // Pode ser uma lista vazia para remover todas as disciplinas
    private List<Long> disciplinaIds;
}