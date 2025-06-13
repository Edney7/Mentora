package com.example.mentora.dto.turma; // Certifique-se que este é o seu pacote correto

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TurmaCreateDTO {

    @NotBlank(message = "Nome da turma é obrigatório")
    private String nome;

    private String turno;

    @NotBlank(message = "Série/Ano da turma é obrigatório")
    private String serieAno;

    @NotNull(message = "Ano letivo é obrigatório")
    private Integer anoLetivo;

    private Boolean ativa;
}
