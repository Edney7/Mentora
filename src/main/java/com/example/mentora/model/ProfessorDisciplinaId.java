package com.example.mentora.model;

import java.io.Serializable;
import java.util.Objects;

public class ProfessorDisciplinaId implements Serializable {

    private Long professor; // Corresponds to Professor.id (via ProfessorDisciplina.professor field)
    private Long disciplina; // Corresponds to Disciplina.id (via ProfessorDisciplina.disciplina field)

    public ProfessorDisciplinaId() {}

    public ProfessorDisciplinaId(Long professor, Long disciplina) {
        this.professor = professor;
        this.disciplina = disciplina;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof ProfessorDisciplinaId)) return false;
        ProfessorDisciplinaId that = (ProfessorDisciplinaId) o;
        return Objects.equals(professor, that.professor) &&
                Objects.equals(disciplina, that.disciplina);
    }

    @Override
    public int hashCode() {
        return Objects.hash(professor, disciplina);
    }
}