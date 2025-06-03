package com.example.mentora.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "turma_disciplina")
@IdClass(TurmaDisciplinaId.class)
public class TurmaDisciplina {

    @Id
    @ManyToOne(optional = false)
    @JoinColumn(name = "turma_id", referencedColumnName = "id")
    private Turma turma;

    @Id
    @ManyToOne(optional = false)
    @JoinColumn(name = "disciplina_id", referencedColumnName = "id")
    private Disciplina disciplina;

    public TurmaDisciplina() {
    }

    public TurmaDisciplina(Turma turma, Disciplina disciplina) {
        this.turma = turma;
        this.disciplina = disciplina;
    }
}