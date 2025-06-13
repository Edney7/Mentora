package com.example.mentora.dto.falta;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class FaltasPorDisciplinaDTO {
    private Long disciplinaId;
    private String nomeDisciplina;
    private int faltas; // Número de faltas para esta disciplina
}