package com.example.mentora.dto.disciplina;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder // Facilita a construção do DTO no serviço
public class DisciplinaResponseDTO {
    private Long id;
    private String nome;
    private String descricao;
    // Se disciplinas tivessem um status 'ativa':
    // private Boolean ativa;
}