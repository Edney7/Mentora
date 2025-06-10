package com.example.mentora.dto.ofertadisciplinaturma;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OfertaDisciplinaTurmaRequestDTO {
    private Long turmaId;
    private Long disciplinaId;
    private Long professorId;
}
