package com.example.mentora.dto.falta;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDate;

@Getter
@Setter
@Builder
public class FaltaResponseDTO {
    private Long id;
    private LocalDate dataFalta;
    private Boolean justificada;
    private String descricaoJustificativa;

    private Long alunoId;
    private String nomeAluno;

    private Long disciplinaId;
    private String nomeDisciplina;

    private Long professorId;
    private String nomeProfessor;
}