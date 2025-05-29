package com.example.mentora.model; // Ou o seu pacote de modelo

import java.io.Serializable;
import java.util.Objects;

// Não precisa de @Embeddable se usada com @IdClass
public class TurmaDisciplinaId implements Serializable {

    private Long turma; // Corresponde ao tipo do ID em Turma e ao nome do campo na entidade TurmaDisciplina
    private Long disciplina; // Corresponde ao tipo do ID em Disciplina e ao nome do campo na entidade TurmaDisciplina

    // Construtor padrão é necessário para JPA
    public TurmaDisciplinaId() {
    }

    public TurmaDisciplinaId(Long turmaId, Long disciplinaId) {
        this.turma = turmaId;
        this.disciplina = disciplinaId;
    }

    // Getters e Setters (Lombok @Getter @Setter também funcionaria aqui)
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

    // Métodos equals() e hashCode() são cruciais para chaves compostas
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
