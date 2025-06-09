package com.example.mentora.dto.turma;

import com.example.mentora.dto.aluno.AlunoResponseDTO;
import com.example.mentora.dto.disciplina.DisciplinaResponseDTO;
import com.example.mentora.dto.professor.ProfessorResponseDTO;
import lombok.*;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TurmaDetalhadaDTO {
    private Long id;
    private String nome;
    private String turno;
    private String serieAno;
    private Integer anoLetivo;

    private List<AlunoResponseDTO> alunos;
    private List<ProfessorResponseDTO> professores;
    private List<DisciplinaResponseDTO> disciplinas;
}