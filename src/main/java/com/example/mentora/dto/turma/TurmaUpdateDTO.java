package com.example.mentora.dto.turma;

import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
public class TurmaUpdateDTO {

    private String nome;
    private String turno;
    private String serieAno;
    private Integer anoLetivo;
    private Boolean ativa;


    public TurmaUpdateDTO() {
    }

}
