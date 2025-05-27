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
    @ManyToOne(optional = false)
    @JoinColumn(name = "professor_id", referencedColumnName = "id") // Was: idProfessor
    private Professor professor; // Field name 'professor' is used in ProfessorDisciplinaId

    @Id
    @ManyToOne(optional = false)
    @JoinColumn(name = "disciplina_id", referencedColumnName = "id") // Was: idDisciplina
    private Disciplina disciplina; // Field name 'disciplina' is used in ProfessorDisciplinaId
}