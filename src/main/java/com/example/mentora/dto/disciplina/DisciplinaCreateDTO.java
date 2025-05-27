package com.example.mentora.dto.disciplina;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class DisciplinaCreateDTO {

    @NotBlank(message = "Nome da disciplina é obrigatório")
    private String nome;

    private String descricao;
}
