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
    private LocalDate dataLancamento;
    private Long alunoId;
    private String nomeAluno;
    private Long disciplinaId;
    private String nomeDisciplina;
    private Long professorId;     // Campo adicionado
    private String nomeProfessor; // Campo adicionado
    private Double prova1;
    private Double prova2;
    private Double media; // Se a média for calculada no backend e enviada
    private Integer bimestre; // Use Integer para números inteiros como 1, 2, 3, 4

    public NotaResponseDTO(Long id, LocalDate dataLancamento, Long alunoId, String nomeAluno,
                           Long disciplinaId, String nomeDisciplina, Long professorId, String nomeProfessor,
                           Double prova1, Double prova2, Double media, Integer bimestre) {
        this.id = id;
        this.dataLancamento = dataLancamento;
        this.alunoId = alunoId;
        this.nomeAluno = nomeAluno;
        this.disciplinaId = disciplinaId;
        this.nomeDisciplina = nomeDisciplina;
        this.professorId = professorId;
        this.nomeProfessor = nomeProfessor;
        this.prova1 = prova1;
        this.prova2 = prova2;
        this.media = media;
        this.bimestre = bimestre;
    }

    // Se você não usa @Builder, um construtor vazio e setters são suficientes
    public NotaResponseDTO() {}
}