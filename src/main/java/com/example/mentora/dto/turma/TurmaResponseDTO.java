package com.example.mentora.dto.turma; // Certifique-se que este é o seu pacote correto

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
    private Boolean ativa;
}
