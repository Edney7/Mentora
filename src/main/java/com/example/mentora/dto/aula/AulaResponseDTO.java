package com.example.mentora.dto.aula;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor; // Você já deve ter este
import lombok.AllArgsConstructor;

import java.time.LocalDate;
@Builder
@Getter
@Setter
@NoArgsConstructor // Mantenha este
@AllArgsConstructor

public class AulaResponseDTO {
    private Long id;
    private LocalDate dataAula;
    private String topico;

    // Apenas os IDs e nomes das entidades relacionadas
    private Long disciplinaId;
    private String nomeDisciplina;

    private Long professorId;
    private String nomeProfessor;

    private Long turmaId;
    private String nomeTurma;

    // Você pode adicionar outros campos se necessário, como:
    // private String descricaoDisciplina;
    // private String cpfProfessor;
}
