package com.example.mentora.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "professor_disciplina")
@IdClass(ProfessorDisciplinaId.class)
public class ProfessorDisciplina {

    @Id
    @ManyToOne
    @JoinColumn(name = "idProfessor", nullable = false)
    private Professor professor;

    @Id
    @ManyToOne
    @JoinColumn(name = "idDisciplina", nullable = false)
    private Disciplina disciplina;
}
