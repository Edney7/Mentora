package com.example.mentora.dto.turmadisciplinaprofessor;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TurmaDisciplinaProfessorRequestDTO {
    private Long turmaId;
    private Long disciplinaId;
    private Long professorId;
}
