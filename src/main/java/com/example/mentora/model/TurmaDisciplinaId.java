package com.example.mentora.model; // Ou seu pacote de modelo

import java.io.Serializable;
import java.util.Objects;

public class TurmaDisciplinaId implements Serializable {

    private Long turma;
    private Long disciplina;

    public TurmaDisciplinaId() {
    }

    public TurmaDisciplinaId(Long turmaId, Long disciplinaId) {
        this.turma = turmaId;
        this.disciplina = disciplinaId;
    }

    public Long getTurma() {
        return turma;
    }

    public void setTurma(Long turma) {
        this.turma = turma;
    }

    public Long getDisciplina() {
        return disciplina;
    }

    public void setDisciplina(Long disciplina) {
        this.disciplina = disciplina;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        TurmaDisciplinaId that = (TurmaDisciplinaId) o;
        return Objects.equals(turma, that.turma) &&
                Objects.equals(disciplina, that.disciplina);
    }

    @Override
    public int hashCode() {
        return Objects.hash(turma, disciplina);
    }
}