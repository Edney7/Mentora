package com.example.mentora.dto.nota;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@Builder
public class NotaResponseDTO {

    private Long id;
    private Double valor;
    private LocalDate dtLancamento;
    private Long idAluno;
    private Long idDisciplina;
}
