package com.example.mentora.model; // Ou seu pacote de modelo

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

    @JoinColumn(name = "professor_id", referencedColumnName = "id")
    private Professor professor;

    @Id
    @ManyToOne(optional = false)

    @JoinColumn(name = "disciplina_id", referencedColumnName = "id")
    private Disciplina disciplina;


    public ProfessorDisciplina() {
    }

    public ProfessorDisciplina(Professor professor, Disciplina disciplina) {
        this.professor = professor;
        this.disciplina = disciplina;
    }

}