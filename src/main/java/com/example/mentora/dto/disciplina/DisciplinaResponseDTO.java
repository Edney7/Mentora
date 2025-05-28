package com.example.mentora.dto.disciplina;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class DisciplinaResponseDTO {
    private Long id;
    private String nome;
    private String descricao;
}