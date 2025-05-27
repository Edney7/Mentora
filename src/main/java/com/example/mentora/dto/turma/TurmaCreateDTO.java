package com.example.mentora.dto.turma;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TurmaCreateDTO {

    @NotBlank(message = "Nome da turma é obrigatório")
    private String nome;

    @NotBlank(message = "Turno é obrigatório")
    private String turno;

    @NotBlank(message = "Série/Ano é obrigatório")
    private String serieAno;

    @NotNull(message = "Ano letivo é obrigatório")
    private Integer anoLetivo;
}
