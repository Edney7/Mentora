package com.example.mentora.model;

import jakarta.persistence.*;

import java.io.Serializable; // Importante para chaves compostas


@Entity
@Table(name = "turma_disciplina_professor")
public class TurmaDisciplinaProfessor implements Serializable { // Implementa Serializable se for chave composta

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Se a chave for gerada automaticamente
    private Long id; // Ou uma chave composta se preferir

    // Se for uma chave composta, você precisaria de @EmbeddedId e uma classe @Embeddable para a PK.
    // Exemplo de chave composta (mais robusto para esta relação):
    /*
    @EmbeddedId
    private TurmaDisciplinaProfessorId id; // Classe auxiliar para a PK

    // ... e a classe TurmaDisciplinaProfessorId
    @Embeddable
    public class TurmaDisciplinaProfessorId implements Serializable {
        private Long turmaId;
        private Long disciplinaId;
        // Getters, Setters, hashCode, equals
    }
    */

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "turma_id", nullable = false)
    private Turma turma;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "disciplina_id", nullable = false)
    private Disciplina disciplina;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "professor_id", nullable = false)
    private Professor professor;

    // Construtores, Getters e Setters
    // ...
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Turma getTurma() { return turma; }
    public void setTurma(Turma turma) { this.turma = turma; }
    public Disciplina getDisciplina() { return disciplina; }
    public void setDisciplina(Disciplina disciplina) { this.disciplina = disciplina; }
    public Professor getProfessor() { return professor; }
    public void setProfessor(Professor professor) { this.professor = professor; }
}