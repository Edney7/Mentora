package com.example.mentora.dto.disciplina;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class DisciplinaCreateDTO {

    @NotBlank(message = "O nome da disciplina é obrigatório.")
    @Size(min = 2, max = 100, message = "O nome da disciplina deve ter entre 2 e 100 caracteres.")
    private String nome;

    @Size(max = 1000, message = "A descrição não pode exceder 1000 caracteres.")
    private String descricao;

}