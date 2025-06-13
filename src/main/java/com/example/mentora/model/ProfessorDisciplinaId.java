package com.example.mentora.model;

import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;
import java.util.Objects;

@Setter
@Getter
public class ProfessorDisciplinaId implements Serializable {


    private Long professor;
    private Long disciplina;
    public ProfessorDisciplinaId() {
    }

    public ProfessorDisciplinaId(Long professorId, Long disciplinaId) {
        this.professor = professorId;
        this.disciplina = disciplinaId;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        ProfessorDisciplinaId that = (ProfessorDisciplinaId) o;
        return Objects.equals(professor, that.professor) &&
                Objects.equals(disciplina, that.disciplina);
    }

    @Override
    public int hashCode() {
        return Objects.hash(professor, disciplina);
    }
}