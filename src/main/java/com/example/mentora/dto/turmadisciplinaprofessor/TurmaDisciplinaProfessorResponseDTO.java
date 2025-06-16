package com.example.mentora.dto.turmadisciplinaprofessor;


import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class TurmaDisciplinaProfessorResponseDTO {
    private Long id; // ID da associação TurmaDisciplinaProfessor (se tiver um ID próprio)
    private Long disciplinaId;
    private String nomeDisciplina;
    private Long professorId;
    private String nomeProfessor;
}
