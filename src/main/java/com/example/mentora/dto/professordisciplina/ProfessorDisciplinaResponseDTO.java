package com.example.mentora.dto.professordisciplina;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ProfessorDisciplinaResponseDTO {
    private Long idProfessor;
    private String nomeProfessor;
    private Long idDisciplina;
    private String nomeDisciplina;
}
