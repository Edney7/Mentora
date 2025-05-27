package com.example.mentora.dto.turma;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class TurmaResponseDTO {
    private Long id;
    private String nome;
    private String turno;
    private String serieAno;
    private Integer anoLetivo;
}
