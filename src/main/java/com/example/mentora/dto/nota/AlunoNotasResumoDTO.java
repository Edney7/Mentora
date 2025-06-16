package com.example.mentora.dto.nota;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AlunoNotasResumoDTO {

    private Long alunoId;
    private String nomeAluno;
    private int totalFaltas;
    private int totalAulas;
    private int aulasAssistidas;

    private List<FaltasPorDisciplinaDTO> faltasPorDisciplina;
    private List<MediaPorDisciplinaDTO> mediasPorDisciplina;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class FaltasPorDisciplinaDTO {
        private Long disciplinaId;
        private String nomeDisciplina;
        private int faltas;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class MediaPorDisciplinaDTO {
        private Long disciplinaId;
        private String nomeDisciplina;
        private double media;
    }
}
