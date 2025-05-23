package com.example.mentora.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class TurmaResponseDTO {
    private Long id;
    private String nome;
    private String turno;
    private String serieAno;
    private Integer anoLetivo;
}
