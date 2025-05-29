package com.example.mentora.dto.disciplina;

import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class DisciplinaUpdateDTO {

    // Para atualização, os campos são opcionais.
    // Validações como @NotBlank não são usadas aqui, pois o campo pode não ser fornecido.
    // Se fornecido, @Size ainda pode ser útil.
    @Size(min = 2, max = 100, message = "O nome da disciplina deve ter entre 2 e 100 caracteres, se fornecido.")
    private String nome;

    @Size(max = 1000, message = "A descrição não pode exceder 1000 caracteres, se fornecida.")
    private String descricao;

    // Se disciplinas tivessem um status 'ativa' que pudesse ser atualizado:
    // private Boolean ativa;
}