package com.example.mentora.dto.falta;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDate;

@Getter
@Setter
@Builder
public class FaltaResponseDTO {
    private Long id; // ID da falta
    private LocalDate dataFalta;
    private Boolean justificada;
    private String descricaoJustificativa;

    private Long alunoId;
    private String nomeAluno; // Para facilitar a exibição

    private Long disciplinaId;
    private String nomeDisciplina; // Para facilitar a exibição

    private Long professorId;
    private String nomeProfessor; // Professor que registou a falta
}