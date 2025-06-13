package com.example.mentora.dto.falta;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class AlunoFaltasResumoDTO {
    private Long alunoId;
    private String nomeAluno;
    private int totalFaltas;
    private List<FaltasPorDisciplinaDTO> faltasPorDisciplina;
    private Integer aulasAssistidas;
    private Integer totalAulas;
}
