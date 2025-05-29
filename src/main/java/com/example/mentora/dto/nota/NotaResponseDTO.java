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
    private LocalDate dataLancamento;
    private Long alunoId;
    private String nomeAluno;
    private Long disciplinaId;
    private String nomeDisciplina;
    private Long professorId;     // Campo adicionado
    private String nomeProfessor; // Campo adicionado
}